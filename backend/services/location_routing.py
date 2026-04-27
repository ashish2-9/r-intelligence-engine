import httpx
import math
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371 # Radius of earth in kilometers
    return c * r

async def check_nearby_facilities(lat: float, lon: float, material_type: str) -> Tuple[bool, float]:
    """
    Queries OpenStreetMap Overpass API for nearby recycling facilities 
    and calculates the exact routing distance.
    
    Args:
        lat (float): User latitude.
        lon (float): User longitude.
        material_type (str): Type of material (e.g., "plastic", "electronic").
        
    Returns:
        Tuple[bool, float]: (is_feasible, distance_km). Feasible if under 10km.
    """
    # Overpass API endpoint
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    # We query for 'amenity=recycling' within a roughly 15km bounding box.
    # OpenStreetMap queries use (South, West, North, East) bounding box or around.
    # Using 'around:15000' means within 15,000 meters.
    overpass_query = f"""
    [out:json][timeout:25];
    node["amenity"="recycling"](around:15000, {lat}, {lon});
    out body;
    """
    
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.post(overpass_url, data=overpass_query)
            response.raise_for_status()
            data = response.json()
            
            elements = data.get('elements', [])
            if not elements:
                return False, -1.0
            
            # Find the closest facility
            closest_distance = float('inf')
            
            for facility in elements:
                f_lat = facility.get('lat')
                f_lon = facility.get('lon')
                
                if f_lat and f_lon:
                    dist = haversine_distance(lat, lon, f_lat, f_lon)
                    if dist < closest_distance:
                        closest_distance = dist
            
            # Determine feasibility (under 10km)
            is_feasible = closest_distance <= 10.0
            
            return is_feasible, round(closest_distance, 2)
            
    except httpx.TimeoutException:
        logger.error("Overpass API timed out.")
        return False, -1.0
    except Exception as exc:
        logger.error(f"Error calling Overpass API: {exc}")
        return False, -1.0

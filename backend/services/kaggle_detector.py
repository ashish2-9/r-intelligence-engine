import os
import httpx
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class KaggleInferenceResponse(BaseModel):
    """
    Pydantic model representing the expected response from the deployed Kaggle model.
    """
    material_category: str
    confidence_score: float

async def detect_material(item_description: str) -> str:
    """
    Identifies the material type from an item description using a deployed Kaggle model.
    
    Args:
        item_description (str): A description of the item (e.g., "cracked plastic chair").
        
    Returns:
        str: Standardized material category. Returns 'unknown' on failure.
    """
    # TODO: Add your Kaggle Inference Endpoint URL to your .env file
    # Example: KAGGLE_INFERENCE_URL=https://your-kaggle-model-endpoint.com/predict
    kaggle_url = os.getenv("KAGGLE_INFERENCE_URL", "https://placeholder-inference-api.com/predict")
    
    # TODO: Add your authentication token if required
    headers = {
        "Authorization": f"Bearer {os.getenv('KAGGLE_API_TOKEN', 'YOUR_TOKEN_HERE')}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "description": item_description
    }
    
    try:
        # Using httpx for async HTTP requests with a reasonable timeout
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(kaggle_url, json=payload, headers=headers)
            response.raise_for_status()
            
            # Parse response using Pydantic
            data = KaggleInferenceResponse(**response.json())
            
            # Return the predicted material category
            return data.material_category.lower()
            
    except httpx.TimeoutException:
        logger.error("Kaggle Inference API timed out.")
        return "unknown"
    except httpx.HTTPStatusError as exc:
        logger.error(f"Kaggle Inference API returned an error status: {exc.response.status_code}")
        return "unknown"
    except Exception as exc:
        logger.error(f"Unexpected error calling Kaggle Inference API: {exc}")
        return "unknown"

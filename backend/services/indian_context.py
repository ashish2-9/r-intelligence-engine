import os
import re
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Dictionary fallback in case the API is down
INDIAN_SLANG_MAP = {
    "raddi": "paper",
    "kabad": "mixed scrap",
    "bhangar": "metal",
    "loha": "metal",
    "patti": "metal",
    "kaanch": "glass",
    "khali botal": "plastic",
    "kachra": "organic",
    "dabba": "metal",
    "polythene": "plastic",
    "panni": "plastic",
    "gatta": "paper",
    "chhilka": "organic"
}

async def parse_local_slang(user_input: str) -> str:
    """
    Translates local Indian waste terminology into standard categories.
    Prioritizes an intelligent Hugging Face NLP model if the API key is set, 
    but falls back to a deterministic local dictionary if it fails or times out.
    
    Args:
        user_input (str): The raw input string from the user.
        
    Returns:
        str: The standardized material category.
    """
    normalized_input = user_input.lower().strip()
    hf_token = os.getenv("HUGGINGFACE_API_KEY")
    # Using a zero-shot classification model as default
    hf_url = os.getenv("HUGGINGFACE_INFERENCE_URL", "https://api-inference.huggingface.co/models/facebook/bart-large-mnli")
    
    # 1. Try Intelligent Hugging Face NLP Classification
    if hf_token:
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/json"
        }
        
        # Zero-shot classification expects inputs and candidate_labels
        payload = {
            "inputs": normalized_input,
            "parameters": {
                "candidate_labels": ["plastic", "metal", "paper", "glass", "organic", "electronic", "mixed scrap"]
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(hf_url, json=payload, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    # data is typically {"sequence": "...", "labels": ["metal", ...], "scores": [0.9, ...]}
                    if "labels" in data and len(data["labels"]) > 0:
                        top_label = data["labels"][0]
                        top_score = data["scores"][0]
                        
                        # Only trust the model if it is confident
                        if top_score > 0.5:
                            logger.info(f"Hugging Face mapped '{user_input}' to '{top_label}' (Score: {top_score:.2f})")
                            return top_label
                else:
                    logger.warning(f"Hugging Face API returned {response.status_code}. Falling back to dictionary.")
                    
        except httpx.TimeoutException:
            logger.warning("Hugging Face API timed out. Falling back to dictionary.")
        except Exception as exc:
            logger.warning(f"Hugging Face API error: {exc}. Falling back to dictionary.")

    # 2. Fallback to Local Dictionary
    logger.info("Using local dictionary mapping for Indian layman terms.")
    
    # Exact match check
    if normalized_input in INDIAN_SLANG_MAP:
        return INDIAN_SLANG_MAP[normalized_input]
        
    # Substring search if user typed a sentence
    for slang, standard_cat in INDIAN_SLANG_MAP.items():
        if re.search(rf"\b{slang}\b", normalized_input):
            return standard_cat
            
    # Return original input if no local slang is detected
    return normalized_input

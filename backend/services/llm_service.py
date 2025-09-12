import requests
import os
from config.envConfig import LLM_SERVICE_URL

def get_llm_response(payload):

    try:
        response = requests.post(
            LLM_SERVICE_URL,
            json=payload,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

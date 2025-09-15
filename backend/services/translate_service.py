import requests
from config.envConfig import TRANSLATE_SERVICE_URL

def translate_text(text):

    payload = {
        "sentences": [text]
    }
    try:
        response = requests.post(
            TRANSLATE_SERVICE_URL,
            json=payload
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}



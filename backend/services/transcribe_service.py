import requests
from config.config import TRANSCRIBE_SERVICE_URL

def forward_audio_to_transcribe_service(audio_file):
    response = requests.post(
        TRANSCRIBE_SERVICE_URL,
        files={"audio": (audio_file.filename, audio_file, audio_file.mimetype)}
    )
    return response

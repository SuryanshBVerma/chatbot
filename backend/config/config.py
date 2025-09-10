import os
from dotenv import load_dotenv

load_dotenv()

TRANSCRIBE_SERVICE_URL = os.getenv("TRANSCRIBE_SERVICE_URL")

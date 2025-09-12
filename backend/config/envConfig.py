import os
from dotenv import load_dotenv

load_dotenv()

TRANSCRIBE_SERVICE_URL = os.getenv("TRANSCRIBE_SERVICE_URL")
LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL")

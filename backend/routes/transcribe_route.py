from flask import Blueprint, request, jsonify
from services.transcribe_service import forward_audio_to_transcribe_service

transcribe_bp = Blueprint('transcribe', __name__)

@transcribe_bp.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    try:
        response = forward_audio_to_transcribe_service(audio_file)
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

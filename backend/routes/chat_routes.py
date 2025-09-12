
from flask import Blueprint, request, jsonify
from controllers.chat_controller import ChatController

chat_bp = Blueprint("chat_bp", __name__)


# Route to converse with LLM
@chat_bp.route("/chat", methods=["POST"])
def converse_with_llm():
    data = request.json
    chat_id = data.get("id")
    messages = data.get("messages", [])
    response = ChatController.converse_with_llm(chat_id, messages)
    return jsonify({
        "id": chat_id,
        "messages" : response
    })


# @chat_bp.route("/new-chat", methods=["POST"])
# def create_chat():
#     data = request.json
#     chat_id = ChatController.create_chat(data)
#     return jsonify({"id": chat_id}), 201



# @chat_bp.route("/chats/<chat_id>", methods=["GET"])
# def get_chat(chat_id):
#     chat = ChatController.get_chat(chat_id)
#     if not chat:
#         return jsonify({"error": "Chat not found"}), 404
#     chat["_id"] = str(chat["_id"])
#     return jsonify(chat)



# @chat_bp.route("/chats", methods=["GET"])
# def get_all_chats():
#     chats = ChatController.get_all_chats()
#     for c in chats:
#         c["_id"] = str(c["_id"])
#     return jsonify(chats)



# @chat_bp.route("/chats/<chat_id>", methods=["PUT"])
# def update_chat(chat_id):
#     update_data = request.json
#     updated_chat = ChatController.update_chat(chat_id, update_data)
#     updated_chat["_id"] = str(updated_chat["_id"])
#     return jsonify(updated_chat)



# @chat_bp.route("/chats/<chat_id>", methods=["DELETE"])
# def delete_chat(chat_id):
#     result = ChatController.delete_chat(chat_id)
#     if result.deleted_count == 0:
#         return jsonify({"error": "Chat not found"}), 404
#     return jsonify({"message": "Chat deleted successfully"})

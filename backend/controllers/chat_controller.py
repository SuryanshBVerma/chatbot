from datetime import datetime
from bson.objectid import ObjectId
# from config.db import mongo
from models.chat_model import ChatModel
from services.llm_service import get_llm_response
from services.translate_service import translate_text


class ChatController:
    # collection = mongo.db.chats

    @staticmethod
    def converse_with_llm(chat_id, messages):
        # Last user message is input, rest are history
        # Restructuring messages for LLM Service

        # Check - Received Input is English or Kannada
        input_message_eng = messages[-1].get("content-eng")
        input_message_kan = messages[-1].get("content-kan")


        # If English message is missing, translate Kannada to English
        if input_message_eng is None:
            translated_eng = translate_text(input_message_kan)["translations"][0]
            input_message_eng = translated_eng
            messages[-1]["content-eng"] = translated_eng
        else:
            # Otherwise, translate English to Kannada
            translated_kan = translate_text(input_message_eng)["translations"][0]
            input_message_kan = translated_kan
            messages[-1]["content-kan"] = translated_kan


        history = [
            {"content": m["content-eng"], "role": m["role"]}
            for m in messages[:-1]
        ]
        llm_payload = {
            "input": input_message_eng,
            "history": history
        }

        response = get_llm_response(llm_payload)    

        # Convert the response to Kannada
        response_eng = response["response"]
        response_kan = translate_text(input_message_eng)["translations"][0]

        # Adding response to the messages
        messages.append({
            "id" : "random",
            "role" : "assistant",
            "content-eng" : response_eng,
            "content-kan" : response_kan,
            "createdAt" : datetime.utcnow().isoformat()
        })

        return messages

    @staticmethod
    def create_chat(data):
        # Backend logic for creating a chat
        # Call service if needed
        # ...
        return "new_chat_id"

    @staticmethod
    def get_chat(chat_id):
        # Backend logic for getting a chat
        # ...
        return {"_id": chat_id}

    @staticmethod
    def get_all_chats():
        # Backend logic for getting all chats
        # ...
        return [{"_id": "chat1"}, {"_id": "chat2"}]

    @staticmethod
    def update_chat(chat_id, update_data):
        # Backend logic for updating a chat
        # ...
        return {"_id": chat_id}

    @staticmethod
    def delete_chat(chat_id):
        # Backend logic for deleting a chat
        # ...
        class Result:
            deleted_count = 1
        return Result()

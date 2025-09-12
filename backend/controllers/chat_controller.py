from datetime import datetime
from bson.objectid import ObjectId
# from config.db import mongo
from models.chat_model import ChatModel
from services.llm_service import get_llm_response


class ChatController:
    # collection = mongo.db.chats

    @staticmethod
    def converse_with_llm(chat_id, messages):
        # Last user message is input, rest are history
        # Restructuring messages for LLM Service
        input_message = messages[-1]["content"] 
        history = [
            {"content": m["content"], "role": m["role"]}
            for m in messages[:-1]
        ]
        llm_payload = {
            "input": input_message,
            "history": history
        }
        response = get_llm_response(llm_payload)

        # Adding response to the messages
        messages.append({
            "id" : "random",
            "role" : "assistant",
            "content" : response["response"],
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

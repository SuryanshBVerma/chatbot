from datetime import datetime


class ChatModel:
    def __init__(self, title, folder=None, pinned=False, messages=None):
        self.title = title
        self.updatedAt = datetime.utcnow().isoformat()
        self.messageCount = len(messages) if messages else 0
        self.preview = messages[0]["content"][:80] + "..." if messages else ""
        self.pinned = pinned
        self.folder = folder or "General"
        self.messages = messages or []

    def to_dict(self):
        return {
            "title": self.title,
            "updatedAt": self.updatedAt,
            "messageCount": self.messageCount,
            "preview": self.preview,
            "pinned": self.pinned,
            "folder": self.folder,
            "messages": self.messages,
        }

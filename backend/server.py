

from flask import Flask
from routes.transcribe_route import transcribe_bp
from routes.chat_routes import chat_bp
from config.config import enable_cors


app = Flask(__name__)
enable_cors(app)

# # MongoDB config
# app.config["MONGO_URI"] = "mongodb://localhost:27017/chatdb"
# mongo.init_app(app)


app.register_blueprint(transcribe_bp, url_prefix = "/api")
app.register_blueprint(chat_bp, url_prefix = "/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

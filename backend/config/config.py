from flask_cors import CORS

def enable_cors(app):
    CORS(app, resources={r"/api/*": {"origins": "*"}})

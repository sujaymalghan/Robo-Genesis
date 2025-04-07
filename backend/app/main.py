# backend/app/main.py
from flask import Flask
from flask_cors import CORS
from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from .models import db
from .routes import robot_bp
from .connect4 import connect4_bp

app = Flask(__name__)

CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI  # Points to your cloud DB
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

# Initialize SQLAlchemy
db.init_app(app)

# Register robot endpoints
app.register_blueprint(robot_bp)
app.register_blueprint(connect4_bp)
@app.route("/")
def home():
    return "Hello, Robo Genesis!"



if __name__ == "__main__":
    app.run(debug=True)

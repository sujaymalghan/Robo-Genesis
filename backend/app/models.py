
from datetime import datetime
# backend/app/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Robot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(80), nullable=False)
    health = db.Column(db.Integer, default=100)
    attack = db.Column(db.Integer, default=10)
    defense = db.Column(db.Integer, default=5)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'health': self.health,
            'attack': self.attack,
            'defense': self.defense
        }



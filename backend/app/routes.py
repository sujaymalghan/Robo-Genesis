# backend/app/routes.py
from flask import Blueprint, request, jsonify
from app.models import Robot, db

robot_bp = Blueprint('robot', __name__)

# Create a new robot
@robot_bp.route('/robot', methods=['POST'])
def create_robot():
    data = request.get_json()
    robot_name = data.get('name', 'Unnamed Robot')
    robot_type = data.get('type', 'Standard')
    
    new_robot = Robot(name=robot_name, type=robot_type)
    db.session.add(new_robot)
    db.session.commit()
    
    return jsonify({
        'message': f'Robot "{robot_name}" created successfully!',
        'robot': new_robot.to_dict()
    }), 201

# List all robots
@robot_bp.route('/robots', methods=['GET'])
def list_robots():
    all_robots = Robot.query.all()
    return jsonify([robot.to_dict() for robot in all_robots]), 200

# Retrieve a specific robot
@robot_bp.route('/robot/<int:robot_id>', methods=['GET'])
def get_robot(robot_id):
    robot = Robot.query.get(robot_id)
    if robot:
        return jsonify(robot.to_dict()), 200
    return jsonify({'error': 'Robot not found'}), 404

# Update a specific robot
@robot_bp.route('/robot/<int:robot_id>', methods=['PUT'])
def update_robot(robot_id):
    data = request.get_json()
    robot = Robot.query.get(robot_id)
    if not robot:
        return jsonify({'error': 'Robot not found'}), 404

    robot.name = data.get('name', robot.name)
    robot.type = data.get('type', robot.type)
    db.session.commit()

    return jsonify({'message': 'Robot updated successfully', 'robot': robot.to_dict()}), 200

# Delete a specific robot
@robot_bp.route('/robot/<int:robot_id>', methods=['DELETE'])
def delete_robot(robot_id):
    robot = Robot.query.get(robot_id)
    if not robot:
        return jsonify({'error': 'Robot not found'}), 404

    db.session.delete(robot)
    db.session.commit()
    return jsonify({'message': 'Robot deleted successfully'}), 200



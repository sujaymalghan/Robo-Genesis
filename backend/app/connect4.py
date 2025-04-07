# File: backend/app/routes/connect4.py

from flask import Blueprint, request, jsonify
import random

ROWS = 6
COLS = 7

connect4_bp = Blueprint('connect4_bp', __name__, url_prefix='/connect4')

def get_valid_moves(board):
    return [c for c in range(COLS) if board[0][c] is None]

def drop_piece(board, col, piece):
    new_board = [row.copy() for row in board]
    for row in reversed(range(ROWS)):
        if new_board[row][col] is None:
            new_board[row][col] = piece
            break
    return new_board

def check_winner(board):
    directions = [(0,1), (1,0), (1,1), (1,-1)]
    for r in range(ROWS):
        for c in range(COLS):
            if board[r][c] is None:
                continue
            for dr, dc in directions:
                if all(
                    0 <= r+dr*i < ROWS and 0 <= c+dc*i < COLS and board[r+dr*i][c+dc*i] == board[r][c]
                    for i in range(4)
                ):
                    return board[r][c]
    return None

@connect4_bp.route('/check-winner', methods=['POST'])
def check():
    data = request.json
    board = data['board']
    winner = check_winner(board)
    return jsonify({'winner': winner})

@connect4_bp.route('/computer-move', methods=['POST'])
def computer_move():
    data = request.json
    board = data['board']
    difficulty = data['difficulty']
    computer_char = data['computerChar']

    valid_moves = get_valid_moves(board)

    if not valid_moves:
        return jsonify({'board': board})

    if difficulty == 'easy':
        col = random.choice(valid_moves)
    elif difficulty == 'medium':
        col = get_medium_move(board, valid_moves, computer_char)
    else:
        col = get_best_move(board, computer_char)

    new_board = drop_piece(board, col, computer_char)
    return jsonify({'board': new_board})

def get_medium_move(board, valid_moves, computer_char):
    for col in valid_moves:
        temp_board = drop_piece(board, col, computer_char)
        if check_winner(temp_board) == computer_char:
            return col
    return random.choice(valid_moves)

def get_best_move(board, computer_char):
    return random.choice(get_valid_moves(board))

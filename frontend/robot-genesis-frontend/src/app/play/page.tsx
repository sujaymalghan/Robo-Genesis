"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import clsx from 'clsx';

const ROWS = 6;
const COLS = 7;
const CHARACTERS = ['X', 'Y', 'Z', '#', '@', '$', '&'];

const Connect4 = () => {
  const emptyBoard = useMemo(
    () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
    []
  );
  const [board, setBoard] = useState(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerChar, setPlayerChar] = useState<string>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [dropAnimation, setDropAnimation] = useState<{ row: number, col: number, char: string } | null>(null);
  const [loadingMove, setLoadingMove] = useState(false);
  const [characters, setCharacters] = useState<string[]>(CHARACTERS);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!gameStarted) {
      fetch('http://127.0.0.1:5000/robots')
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCharacters(data.map((r: { name: string }) => r.name));
          }
        })
        .catch(console.warn);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (!playerTurn && !winner && gameStarted) {
      setLoadingMove(true);

      axios.post('http://127.0.0.1:5000/connect4/computer-move', {
        board,
        difficulty,
        computerChar: 'O'
      }).then(res => {
        const newBoard = res.data.board;
        const colPlayed = findColPlayed(board, newBoard);
        const rowPlayed = findRowPlayed(board, newBoard, colPlayed);

        animateDiscDrop(rowPlayed, colPlayed, 'O', () => {
          setBoard(newBoard);
          checkWinner(newBoard);
          setPlayerTurn(true);
          setLoadingMove(false);
        });
      }).catch(() => {
        setPlayerTurn(true);
        setLoadingMove(false);
      });
    }
  }, [playerTurn, gameStarted]);

  // When a winner is set, show the notification modal.
  useEffect(() => {
    if (winner) {
      setShowNotification(true);
    }
  }, [winner]);

  const findColPlayed = (oldBoard: string[][], newBoard: string[][]) => {
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        if (oldBoard[row][col] !== newBoard[row][col] && newBoard[row][col] === 'O') {
          return col;
        }
      }
    }
    return -1;
  };

  const findRowPlayed = (oldBoard: string[][], newBoard: string[][], col: number) => {
    for (let row = 0; row < ROWS; row++) {
      if (oldBoard[row][col] !== newBoard[row][col] && newBoard[row][col] === 'O') {
        return row;
      }
    }
    return -1;
  };

  const animateDiscDrop = (row: number, col: number, char: string, callback?: () => void) => {
    setDropAnimation({ row, col, char });
    setTimeout(() => {
      setDropAnimation(null);
      callback?.();
    }, 300);
  };

  const dropDisc = useCallback((col: number) => {
    if (!playerTurn || winner || !gameStarted || loadingMove) return;

    const newBoard = board.map(row => [...row]);
    let placedRow = -1;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        placedRow = row;
        break;
      }
    }
    if (placedRow === -1) return;

    animateDiscDrop(placedRow, col, playerChar, () => {
      newBoard[placedRow][col] = playerChar;
      setBoard(newBoard);
      checkWinner(newBoard);
      setPlayerTurn(false);
    });
  }, [board, gameStarted, loadingMove, playerTurn, playerChar, winner]);

  const checkWinner = (board: string[][]) => {
    axios.post('http://127.0.0.1:5000/connect4/check-winner', { board })
      .then(res => {
        if (res.data.winner) {
          setWinner(res.data.winner);
        }
      });
  };

  const startGame = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setPlayerTurn(true);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(emptyBoard);
    setWinner(null);
    setShowNotification(false);
  };

  const getCellContent = (row: number, col: number) => {
    if (dropAnimation?.col === col && dropAnimation?.row === row) {
      return dropAnimation.char;
    }
    return board[row][col];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 p-6 relative">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        {!gameStarted ? (
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Game Setup</h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Choose Your Character</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                {characters.map(char => (
                  <motion.button
                    key={char}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPlayerChar(char)}
                    className={clsx(
                      "h-16 w-full rounded-xl text-white text-lg font-semibold shadow-lg px-4 py-2",
                      playerChar === char
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 ring-4 ring-white/30"
                        : "bg-blue-400 hover:bg-blue-500"
                    )}
                  >
                    {char}
                  </motion.button>
                ))}
              </div>
              <p className="text-white/80 mt-2 italic">Computer will play as O</p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Select Difficulty</h3>
              <div className="flex flex-wrap gap-3">
                {['easy', 'medium', 'hard'].map(level => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(level as any)}
                    className={clsx(
                      "px-5 py-2 rounded-full font-semibold text-lg transition-all",
                      difficulty === level
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                        : "bg-white/30 text-white hover:bg-white/50"
                    )}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              onClick={startGame}
            >
              Start Game
            </motion.button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2 sm:gap-0">
              <div className="w-full text-center text-white text-2xl font-bold">
                Connect 4
              </div>
              <div className="flex-1 text-white font-semibold text-base sm:text-lg text-left">
                {winner ? (
                  <span className="px-4 py-2 bg-white/20 rounded-full">
                    {winner === playerChar ? 'You won! 🎉' : 'Computer won!'}
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-white/20 rounded-full">
                    {playerTurn ? `${playerChar}'s turn` : 'Computer thinking...'}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-4 py-2 bg-white/20 rounded-full text-white hover:bg-white/30"
              >
                Reset Game
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-1 bg-blue-600 p-5 rounded-xl shadow-lg">
              {board.map((row, rowIndex) => (
                row.map((_, colIndex) => {
                  const cellContent = getCellContent(rowIndex, colIndex);
                  const isAnimating = dropAnimation?.col === colIndex && dropAnimation?.row === rowIndex;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="relative w-full aspect-square bg-blue-700 rounded-full overflow-hidden p-1"
                      onClick={() => dropDisc(colIndex)}
                    >
                      <div className="absolute inset-0 rounded-full bg-blue-800/50"></div>
                      <div className="absolute inset-1 rounded-full bg-blue-900/80"></div>
                      {(cellContent || isAnimating) && (
                        <motion.div
                          key={`${rowIndex}-${colIndex}-${cellContent}`}
                          className={clsx(
                            "absolute inset-1 rounded-full shadow-inner flex items-center justify-center text-white font-bold",
                            {
                              'bg-gradient-to-br from-red-400 to-red-600': cellContent === playerChar,
                              'bg-gradient-to-br from-yellow-300 to-yellow-500': cellContent === 'O',
                              'bg-gradient-to-br from-pink-400 to-purple-600': cellContent && cellContent !== playerChar && cellContent !== 'O',
                            }
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                        >
                          {cellContent}
                        </motion.div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Winning Notification Modal */}
      {winner && showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {winner === playerChar ? 'You won! 🎉' : 'Computer won!'}
            </h2>
            <div className="flex justify-around mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetGame();
                  setShowNotification(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
              >
                Reset Game
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotification(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connect4;

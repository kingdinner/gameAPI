// rockPaperScissorsController.js
const path = require('path');
const fs = require('fs');

const {readUserData, readGameData} = require("./index.controller")

// Path to the games data file
const gamesDataPath = path.join(__dirname, '../database/rockpaperscissor.json');

// Helper function to read games data from the JSON file
const readGamesData = () => {
  try {
    const data = fs.readFileSync(gamesDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Helper function to write games data to the JSON file
const writeGamesData = (gamesData) => {
  try {
    fs.writeFileSync(gamesDataPath, JSON.stringify(gamesData, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write games data:', error);
  }
};

// Route handler to create a new Rock, Paper, Scissors game
const createGame = (req, res) => {
  const gameId = Math.random().toString(36).substr(2, 9); // Generate a random game ID
  const players = [req.body.player1, req.body.player2]
  const gameDatas = readGameData()
  const userData = readUserData()
  
  players.forEach(element => {
    if (gameDatas["RockPaperScissor"].ageLimitation > userData[element].age) {
      return res.status(400).json({ error: 'Invalid player. Incorrect Age' });
    }
  });

  const gameData = {
    players: [req.body.player1, req.body.player2],
    moves: {},
    status: 'ongoing',
  };

  const gamesData = readGamesData();
  gamesData[gameId] = gameData;
  writeGamesData(gamesData);

  res.status(201).json({ gameId });
};

// Route handler to get the current status of a Rock, Paper, Scissors game
const getGameStatus = (req, res) => {
  const gameId = req.params.gameId;
  const gamesData = readGamesData();
  const gameData = gamesData[gameId];

  if (!gameData) {
    return res.status(404).json({ error: 'Game not found.' });
  }

  res.json(gameData);
};

// Route handler to make a move in the Rock, Paper, Scissors game
const makeMove = (req, res) => {
  const gameId = req.params.gameId;
  const { player, move } = req.body;
  const gamesData = readGamesData();
  const gameData = gamesData[gameId];

  if (!gameData) {
    return res.status(404).json({ error: 'Game not found.' });
  }

  if (!gameData.players.includes(player)) {
    return res.status(400).json({ error: 'Invalid player. Player not found in the game.' });
  }

  if (gameData.status !== 'ongoing') {
    return res.status(400).json({ error: 'Game is already completed.' });
  }

  gameData.moves[player] = move;

  if (Object.keys(gameData.moves).length === 2) {
    const player1Move = gameData.moves[gameData.players[0]].toLowerCase();
    const player2Move = gameData.moves[gameData.players[1]].toLowerCase();

    let result = 'draw';

    if (
      (player1Move === 'rock' && player2Move === 'scissors') ||
      (player1Move === 'scissors' && player2Move === 'paper') ||
      (player1Move === 'paper' && player2Move === 'rock')
    ) {
      result = gameData.players[0];
    } else if (
      (player2Move === 'rock' && player1Move === 'scissors') ||
      (player2Move === 'scissors' && player1Move === 'paper') ||
      (player2Move === 'paper' && player1Move === 'rock')
    ) {
      result = gameData.players[1];
    }

    gameData.result = result;
    gameData.status = 'completed';
  }

  gamesData[gameId] = gameData;
  writeGamesData(gamesData);

  res.status(200).json({ message: 'Move successful.', gameId });
};

module.exports = {
  createGame,
  getGameStatus,
  makeMove,
};

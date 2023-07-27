// gameRoutes.js
const express = require('express');
const router = express.Router();
const {gameInformation, gameAgeVerication} = require('../controller/index.controller');
const {createGame, getGameStatus, makeMove} = require('../controller/rockpaperscissor.controller');

router.post('/game/:game', gameInformation);

router.post('/game/allow/:userId', gameAgeVerication);

// Route to create a new Rock, Paper, Scissors game
router.post('/game/start/rockpaperscissor', createGame);

// Route to get the current status of a Rock, Paper, Scissors game
router.get('/game/start/rockpaperscissor/:gameId', getGameStatus);

// Route to make a move in the Rock, Paper, Scissors game
router.post('/game/start/rockpaperscissor/:gameId/move', makeMove);

module.exports = router;

// gameRoutes.js
const express = require('express');
const router = express.Router();
const {gameInformation, gameAgeVerication} = require('../controller/index.controller');
const {createGame, getGameStatus, makeMove} = require('../controller/rockpaperscissor.controller');
const guessWordController = require('../controller/guessword.controller');

router.post('/game/:game', gameInformation);

router.post('/game/allow/:userId', gameAgeVerication);

// Route to create a new Rock, Paper, Scissors game
router.post('/game/start/rockpaperscissor', createGame);

// Route to get the current status of a Rock, Paper, Scissors game
router.get('/game/start/rockpaperscissor/:gameId', getGameStatus);

// Route to make a move in the Rock, Paper, Scissors game
router.post('/game/start/rockpaperscissor/:gameId/move', makeMove);

//guess word
// Route to create a new "GuessWord" game
router.post('/game/start/guessword', guessWordController.createGame);

// Route to make a guess in the "GuessWord" game
router.post('/game/start/guessword/:gameId/guess', guessWordController.makeGuess);

module.exports = router;

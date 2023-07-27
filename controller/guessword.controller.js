const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const guesswordDataPath = path.join(__dirname, '../database/guessword.json');

// Helper function to read guessword data from the JSON file
const readGuesswordData = () => {
  try {
    const data = fs.readFileSync(guesswordDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Helper function to choose a random word from a given list
const getRandomWord = (wordList) => {
    return wordList[Math.floor(Math.random() * wordList.length)];
};
  

// Route handler to create a new "GuessWord" game
const createGame = (req, res) => {
  const players = [req.body.player1, req.body.player2];

  if (!players || players.length < 2) {
    return res.status(400).json({ error: 'At least two players are required to start the game.' });
  }

  // List of words to choose from for the wordToGuess
  const wordList = ['apple', 'banana', 'orange', 'grape', 'watermelon'];

  const gameId = uuidv4();
  const gameData = {
    players,
    wordToGuess: getRandomWord(wordList), // Choose a random word from the list
    guesses: {},
  };

  // Initialize the guesses object for each player
  players.forEach((player) => {
    gameData.guesses[player] = '';
  });

  // Save the game data to the guessword JSON file
  const guesswordData = readGuesswordData();
  guesswordData[gameId] = gameData;
  fs.writeFileSync(guesswordDataPath, JSON.stringify(guesswordData, null, 2), 'utf8');

  res.status(201).json({ gameId });
};

// Route handler to make a guess in the "GuessWord" game
const makeGuess = (req, res) => {
    const { gameId } = req.params;
    const { player, guess } = req.body;
  
    const guesswordData = readGuesswordData();
    const gameData = guesswordData[gameId];
  
    if (!gameData) {
      return res.status(404).json({ error: 'Game not found.' });
    }
  
    if (!gameData.players.includes(player)) {
      return res.status(403).json({ error: 'Player is not part of this game.' });
    }
  
    gameData.guesses[player] = guess.toLowerCase();
  
    // Check if all players have made a guess
    const allPlayersGuessed = gameData.players.every((p) => gameData.guesses[p] !== '');
  
    if (allPlayersGuessed) {
      const isCorrectGuess = gameData.players.every((p) => gameData.guesses[p] === gameData.wordToGuess);
  
      if (isCorrectGuess) {
        res.status(200).json({ message: 'Congratulations! All players guessed the word correctly.' });
      } else {
        res.status(200).json({ message: 'Oops! Some players guessed the word incorrectly.' });
      }
    } else {
      res.status(200).json({ message: 'Guess recorded successfully.' });
    }
  
    fs.writeFileSync(guesswordDataPath, JSON.stringify(guesswordData, null, 2), 'utf8');
  };

module.exports = {
  createGame,
  makeGuess,
};

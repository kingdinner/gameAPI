const request = require('supertest');
const app = require('../server'); // Assuming your Express app is in app.js
const fs = require('fs');
const path = require('path');

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

describe('Rock, Paper, Scissors API', () => {
  beforeEach(() => {
    // Clear the games data before each test
    writeGamesData({});
  });

  it('should create a new game', async () => {
    const player1 = 'john_doe';
    const player2 = 'johns_doeds';

    const response = await request(app)
      .post('/api/game/start/rockpaperscissor')
      .send({ player1, player2 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('gameId');
  });

  it('should get the status of an existing game', async () => {
    const gameId = 'random_game_id';
    const gamesData = {
      [gameId]: {
        players: ['john_doe', 'johns_doeds'],
        moves: {},
        status: 'ongoing',
      },
    };
    writeGamesData(gamesData);

    const response = await request(app).get(`/api/game/start/rockpaperscissor/${gameId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('players', ['john_doe', 'johns_doeds']);
    expect(response.body).toHaveProperty('moves', {});
    expect(response.body).toHaveProperty('status', 'ongoing');
  });

  it('should make a move in an existing game', async () => {
    const gameId = 'random_game_id';
    const gamesData = {
      [gameId]: {
        players: ['john_doe', 'johns_doeds'],
        moves: {},
        status: 'ongoing',
      },
    };
    writeGamesData(gamesData);

    const player = 'john_doe';
    const move = 'Rock';

    const response = await request(app)
      .post(`/api/game/start/rockpaperscissor/${gameId}/move`)
      .send({ player, move });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Move successful.');
    expect(response.body).toHaveProperty('gameId', gameId);

    // Check if the move is updated in the games data
    const updatedGamesData = readGamesData();
    expect(updatedGamesData[gameId].moves[player]).toBe(move);
  });
});

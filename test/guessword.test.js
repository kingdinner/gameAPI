const request = require('supertest');
const app = require('../server'); // Replace './app' with the path to your Express app

describe('GuessWord API', () => {
  describe('POST /api/game/start/guessword', () => {
    it('should create a new GuessWord game', async () => {
      const response = await request(app)
        .post('/api/game/start/guessword')
        .send({
          player1: 'john_doe',
          player2: 'jane_smith',
        });
      expect(response.body).toHaveProperty('gameId');
    });
  });

  describe('POST /api/game/start/guessword/:gameId/guess', () => {
    it('should make a guess in the GuessWord game', async () => {
      const newGameResponse = await request(app)
        .post('/api/game/start/guessword')
        .send({
          player1: 'john_doe',
          player2: 'jane_smith',
        });

      const gameId = newGameResponse.body.gameId;

      const guessResponse = await request(app)
        .post(`/api/game/start/guessword/${gameId}/guess`)
        .send({
          player: 'john_doe',
          guess: 'apple',
        });

      expect(guessResponse.status).toBe(200);
      expect(guessResponse.body).toHaveProperty('message');
    });

    it('should return 404 if the game does not exist', async () => {
      const nonExistentGameId = 'non_existent_game_id';

      const guessResponse = await request(app)
        .post(`/api/game/start/guessword/${nonExistentGameId}/guess`)
        .send({
          player: 'john_doe',
          guess: 'apple',
        });

      expect(guessResponse.status).toBe(404);
      expect(guessResponse.body).toHaveProperty('error');
    });

    it('should return 403 if player is not part of the game', async () => {
      const newGameResponse = await request(app)
        .post('/api/game/start/guessword')
        .send({
          player1: 'john_doe',
          player2: 'jane_smith',
        });

      const gameId = newGameResponse.body.gameId;

      const guessResponse = await request(app)
        .post(`/api/game/start/guessword/${gameId}/guess`)
        .send({
          player: 'john_smith', // This player is not part of the game
          guess: 'apple',
        });

      expect(guessResponse.status).toBe(403);
      expect(guessResponse.body).toHaveProperty('error');
    });
  });
});

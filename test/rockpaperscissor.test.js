const {
    createGame,
    getGameStatus,
    makeMove,
  } = require('./rockPaperScissorsController');
  
  // Mock the necessary functions for testing
  jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  }));
  
  jest.mock('./index.controller', () => ({
    readUserData: jest.fn(),
    readGameData: jest.fn(),
  }));
  
  describe('Rock, Paper, Scissors Controller', () => {
    let req;
    let res;
  
    beforeEach(() => {
      // Mock the request and response objects
      req = {
        body: {},
        params: {},
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createGame', () => {
      it('should create a new game', () => {
        req.body.player1 = 'john_doe';
        req.body.player2 = 'johns_doeds';
        const expectedGameId = 'random_game_id';
  
        readGameData.mockReturnValueOnce({
          RockPaperScissor: {
            ageLimitation: 12,
          },
        });
        readUserData.mockReturnValueOnce({
          john_doe: {
            age: 30,
          },
          johns_doeds: {
            age: 25,
          },
        });
  
        createGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ gameId: expectedGameId });
      });
  
      it('should return an error if a player has incorrect age', () => {
        req.body.player1 = 'john_doe';
        req.body.player2 = 'johns_doeds';
  
        readGameData.mockReturnValueOnce({
          RockPaperScissor: {
            ageLimitation: 15,
          },
        });
        readUserData.mockReturnValueOnce({
          john_doe: {
            age: 30,
          },
          johns_doeds: {
            age: 10,
          },
        });
  
        createGame(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Invalid player. Incorrect Age',
        });
      });
    });
  
    describe('getGameStatus', () => {
      it('should return the status of an existing game', () => {
        const gameId = 'random_game_id';
        const expectedGameData = {
          players: ['john_doe', 'johns_doeds'],
          moves: {},
          status: 'ongoing',
        };
  
        readGamesData.mockReturnValueOnce({
          [gameId]: expectedGameData,
        });
  
        req.params.gameId = gameId;
        getGameStatus(req, res);
  
        expect(res.json).toHaveBeenCalledWith(expectedGameData);
      });
  
      it('should return an error for a non-existing game', () => {
        const gameId = 'non_existing_game_id';
  
        readGamesData.mockReturnValueOnce({});
  
        req.params.gameId = gameId;
        getGameStatus(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Game not found.' });
      });
    });
  
    describe('makeMove', () => {
      it('should make a move in an ongoing game', () => {
        const gameId = 'random_game_id';
        const player = 'john_doe';
        const move = 'Rock';
        const expectedGameData = {
          players: ['john_doe', 'johns_doeds'],
          moves: {
            john_doe: 'Rock',
          },
          status: 'ongoing',
        };
  
        readGamesData.mockReturnValueOnce({
          [gameId]: {
            players: ['john_doe', 'johns_doeds'],
            moves: {},
            status: 'ongoing',
          },
        });
  
        req.params.gameId = gameId;
        req.body = {
          player,
          move,
        };
  
        makeMove(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Move successful.', gameId });
      });
  
      it('should complete the game and determine the winner', () => {
        const gameId = 'random_game_id';
        const player1 = 'john_doe';
        const player2 = 'johns_doeds';
        const move1 = 'Rock';
        const move2 = 'Scissors';
        const expectedGameData = {
          players: ['john_doe', 'johns_doeds'],
          moves: {
            john_doe: 'Rock',
            johns_doeds: 'Scissors',
          },
          status: 'completed',
          result: 'john_doe',
        };
  
        readGamesData.mockReturnValueOnce({
          [gameId]: {
            players: ['john_doe', 'johns_doeds'],
            moves: {},
            status: 'ongoing',
          },
        });
  
        req.params.gameId = gameId;
        req.body = {
          player: player1,
          move: move1,
        };
  
        makeMove(req, res);
  
        // Make the second move
        req.body = {
          player: player2,
          move: move2,
        };
  
        makeMove(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Move successful.', gameId });
      });
    });
  });
  
# MindQuest API And Rock, Paper, Scissors Multiplayer Game API
##### MindQuest API is a backend application that provides endpoints to manage user data and game information for the MindQuest: The Puzzle Expedition game.

##### Another API allows two players to play the classic game of Rock, Paper, Scissors. Players can create new games, make moves, and check the status of ongoing games. The game progress is saved in a local JSON file.

## Getting Started
To get started with the API, follow the instructions below.

## Prerequisites
Node.js (version X.X.X or higher)
npm (version X.X.X or higher)
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/mindquest-api.git
cd mindquest-api
Install dependencies:
bash
Copy code
npm install
Start the server:
bash
Copy code
npm start
By default, the server will run on http://localhost:3000. You can change the port by modifying the PORT variable in server.js.

## API Endpoints
### Game Routes

GET /api/game: Retrieve the number of levels and game metadata for MindQuest: The Puzzle Expedition.

POST /api/game/allow: Check if the player is allowed to play the game based on their age.

User Routes
GET /api/user/:userId: Retrieve game progress for a specific user.

POST /api/user: Register a new user or update user information.

POST /api/user/:userid: Register a new user or update user information.

## API Endpoints for RockPaperScissor
### Create a New Game
#### Request:
POST URL: /api/game/start/rockpaperscissors

{
  "player1": "john_doe",
  "player2": "johns_doeds"
}

### Response:
{
  "gameId": "random_game_id"
}

### Status of the game using game id
#### Request:
GET /api/game/start/rockpaperscissors/:gameId

{
  "players": ["john_doe", "johns_doeds"],
  "moves": {
    "john_doe": "Rock",
    "johns_doeds": "Paper"
  },
  "status": "completed",
  "result": "johns_doeds"
}

### Make a move
#### Request:
POST URL: /api/game/start/rockpaperscissors/:gameId/move

{
  "player": "john_doe",
  "move": "Rock"
}

### Response:
{
  "message": "Move successful.",
  "gameId": "random_game_id"
}

## API Endpoints for GuessWord
### Create a New Game
#### Request:
POST URL: /api/game/start/guessword

{
  "player1": "john_doe",
  "player2": "johns_doeds"
}

### Response:
{
  "gameId": "random_game_id"
}

### Create a New Game
#### Request:
POST URL: /api/game/start/guessword/:gameId/guess

{
  "player": "john_doe",
  "guess": "apple"
}

### Response:
{
  "message": "Congratulations! All players guessed the word correctly."
}

or

{
  "message": "Oops! Some players guessed the word incorrectly."
}

## Request and Response Examples
### Register a New User
#### Request:
POST /api/user
{
  "age": 30,
  "email": "john@example.com",
  "username": "John Doe"
}
#### Response:
{
  "message": "User data added successfully.",
  "userId": "john_doe"
}
### Update a User
#### Request:
POST /api/user/:john_doe
{
    "age": 3,
    "email": "john@example.com",
    "username": "Johns DoeDs",
    "playedGames": [
      "MindQuest: The Puzzle Expedition"
    ],
    "achievedLevels": {
      "MindQuest: The Puzzle Expedition": 3
    },
    "levelRates": {
      "MindQuest: The Puzzle Expedition": {
        "1": 4,
        "2": 5,
        "3": 3
      }
    },
    "achievements": {
      "MindQuest: The Puzzle Expedition": [
        "Puzzle Solver",
        "Speed Runner"
      ]
    }
}
#### Response:
{
  "message": "User data updated successfully.",
  "userId": "john_doe"
}
### Retrieve Game Metadata
#### Request:
GET /api/game
#### Response:
{
  "name": "MindQuest: The Puzzle Expedition",
  "levels": 10,
  "ageLimitation": 12,
  "metadata": {
    "description": "An adventurous puzzle game that challenges your mind.",
    "version": "1.0"
  }
}
### Retrieve User Progress
#### Request:
GET /api/user/john_doe
#### Response:
{
  "age": 30,
  "email": "john@example.com",
  "playedGames": [],
  "achievedLevels": {},
  "levelRates": {},
  "achievements": {}
}

## Error Handling
The API returns appropriate error codes and messages when encountering errors, such as missing fields or duplicate usernames.

## Contributing
Contributions are welcome! If you find any issues or have ideas for improvements, please submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

const path = require('path');
const fs = require('fs');
// Route to get the number of levels and game metadata

const gameMetadata = path.join(__dirname, '../database/game.json');

const gameInformation = (req, res) => {
  fs.readFile(gameMetadata, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read game data.' });
    }
    const gameMetadata = JSON.parse(data);
    res.json(gameMetadata);
  });
}
// helper
const readGameData = () => {
    try {
      const data = fs.readFileSync(gameMetadata, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
};

const gameAgeVerication = (req, res) => {
    const { userId } = req.params;
    const gameData = readGameData();
    const userData = readUserData();
    const userProgress = userData[userId]
    if (gameData.ageLimitation > userProgress.age) {
        res.status(403).json({ message: "You're not allowed to play this game." });
    } else {
      res.status(200).json(userData[userId]);
    }
}
 
// users
const userDataFilePath = path.join(__dirname, '../database/users.json');

// Helper function to read user data from the JSON file
const readUserData = () => {
  try {
    const data = fs.readFileSync(userDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const getUserInformation = (req, res) => {
    const { userId } = req.params;
    const userData = readUserData();
    const userProgress = userData[userId] || {};
    res.status(200).json(userProgress);
}

const insertUserJSON = (req, res) => {
    const { age, email, username } = req.body;
  
    if (!age || !email || !username) {
      res.status(400).json({ message: 'Age, email, and username are required fields.' });
      return;
    }
  
    const userData = readUserData();
    
  
    // Generate the user ID based on the username
    const userId = username.toLowerCase().replace(/\s+/g, '_');

    // Check if the username is already taken
    if (userData[userId]) {
        res.status(409).json({ message: 'Username already exists. Please choose a different username.' });
        return;
    }

    userData[userId] = {
      age,
      email,
      playedGames: [],
      achievedLevels: {},
      levelRates: {},
      achievements: {},
    };
  
    // Save user data to the JSON file
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2), 'utf8');
  
    res.status(200).json({ message: 'User data updated successfully.', userId });
}

const updateUserInformation = (req,res) => {
    const { userid } = req.params;
    const {playedGames, achievedLevels,levelRates, achievements} = req.body
  
    const userData = readUserData();
    // Update user data
    userData[userid] = { ...userData[userid],
        playedGames,
        achievedLevels,
        levelRates,
        achievements
    };
  
    // Save user data to the JSON file
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2), 'utf8');
  
    res.status(200).json({ message: 'User data updated successfully.', userid });
  }

module.exports = {
    gameInformation,
    getUserInformation,
    insertUserJSON,
    updateUserInformation,
    gameAgeVerication
}
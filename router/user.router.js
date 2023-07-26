// userRoutes.js
const express = require('express');
const router = express.Router();
const {getUserInformation, insertUserJSON, updateUserInformation} = require('../controller/index.controller')


// Route to get the user's game progress
router.get('/user/:userId', getUserInformation);

// register a new user
router.post('/user', insertUserJSON);

// Route for update user's game progress
router.put('/user/:userid', updateUserInformation);

module.exports = router;

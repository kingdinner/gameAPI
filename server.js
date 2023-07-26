// server.js
const express = require('express');
const app = express();
const gameRoutes = require('./router/game.router');
const userRoutes = require('./router/user.router');

// Middleware to parse JSON data
app.use(express.json());

// Use the defined routes
app.use('/api', gameRoutes);
app.use('/api', userRoutes);

// Start the server
module.exports = app;

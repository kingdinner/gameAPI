// gameRoutes.js
const express = require('express');
const router = express.Router();
const {gameInformation, gameAgeVerication} = require('../controller/index.controller');

router.get('/game', gameInformation)

router.post('/game/allow', gameAgeVerication);

module.exports = router;

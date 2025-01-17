// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route for chat request
router.post('/chatQuery', chatController.handleChatRequest);

module.exports = router;

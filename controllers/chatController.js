// controllers/chatController.js
const chatService = require('../services/chatService');

const chatController = {
  async handleChatRequest(req, res) {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      // Get the full response from OpenAI
      const openAIResponse = await chatService.getChatResponse(message);

      // Return the entire OpenAI response as JSON
      return res.json(openAIResponse);
    } catch (err) {
      console.error('Error communicating with OpenAI:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = chatController;

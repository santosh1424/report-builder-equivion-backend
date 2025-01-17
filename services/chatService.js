// services/chatService.js
const { OpenAI } = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatService = {
  async getChatResponse(message) {
    try {
      // Fetch response from OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // or gpt-3.5
        messages: [{ role: 'user', content: message }],
      });

      // Return the entire response object
      return response;
    } catch (err) {
      console.error('Error in chat service:', err);
      throw new Error('Failed to get OpenAI response');
    }
  },
};

module.exports = chatService;

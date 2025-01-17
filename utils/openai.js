const { OpenAI } = require('openai');
// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate summary using OpenAI
const generateSummary = async (text) => {
    try {
        // Fetch response from OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // or gpt-3.5
            messages: [{ role: 'user', content: text }],
        });
        return response;
    } catch (error) {
        console.error('Error generating summary:', error);
        return 'Error summarizing content.';
    }
};

module.exports = {
    generateSummary,
};

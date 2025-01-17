const searchService = require('../services/searchService');

const searchAndSummarize = async (req, res) => {
    const { query } = req.body;  // Get search query from the request body

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Call the service to handle the search and summarization
        const { searchResults, summary } = await searchService.searchAndSummarize(query);

        if (searchResults.length === 0) {
            return res.status(404).json({ error: 'No results found' });
        }

        // Return the results and summary to the client
        res.json({ searchResults, summary });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

module.exports = {
    searchAndSummarize,
};

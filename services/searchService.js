const axios = require('axios');
const cheerio = require('cheerio');
const { generateSummary } = require('../utils/openai');

// Function to fetch Google Custom Search results using Google Custom Search API
const fetchGoogleSearchResults = async (query) => {
    const apiKey = 'AIzaSyAACvicGZxYjrp3kOTiG0idd-c5792Jrn0'; // Your Google API Key
    const cx = '55500185f2faf4063'; // Your Custom Search Engine ID

    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
    console.log('Search URL:', searchUrl);
    try {
        // Send a GET request to the Google Custom Search API
        const { data } = await axios.get(searchUrl, { timeout: 60000 });
        console.log('Search results:', data);
        // Check if the search response contains items
        if (data.items && data.items.length > 0) {
            // Extract titles and URLs from the API response
            const results = data.items.map(item => ({
                title: item.title,
                url: item.link,
            }));
            return results;  // Return the results
        } else {
            console.log('No results found.');
            return [];  // Return empty array if no results found
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
        } else {
            console.error('Error fetching data:', error.message);
        }
        console.error('Error fetching Google Search results:', error);
        return [];  // Return empty array in case of error
    }
};

const searchAndSummarize = async (query) => {
    // Fetch search results using the function
    const searchResults = await fetchGoogleSearchResults(query);

    if (searchResults.length === 0) {
        return { searchResults, summary: 'No results found to summarize.' };
    }

    // Extract content (titles of the search results) and pass it to OpenAI for summarization
    const content = searchResults.map(result => result.title).join('\n\n');

    const summary = await generateSummary(content);

    return { searchResults, summary };
};

module.exports = {
    searchAndSummarize,
};

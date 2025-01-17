const axios = require('axios');
const cheerio = require('cheerio');
const { generateSummary } = require('../utils/openai');

const fetchGoogleSearchResults = async (query) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    try {
        // Get the HTML of the Google Search results page
        const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Extract titles and URLs from the search results
        const results = [];
        $('h3').each((i, element) => {
            const title = $(element).text();
            const url = $(element).parent().attr('href');
            results.push({ title, url });
        });

        return results;
    } catch (error) {
        console.error('Error scraping Google Search results:', error);
        return [];
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

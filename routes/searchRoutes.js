const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Define the API route
router.post('/search-and-summarize', searchController.searchAndSummarize);

module.exports = router;

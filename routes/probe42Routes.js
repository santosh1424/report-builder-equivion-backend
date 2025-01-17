const express = require('express');
const router = express.Router();
const probe42Controller = require('../controllers/probe42Controller');

router.get('/company', probe42Controller.getCompanyData);

module.exports = router; 
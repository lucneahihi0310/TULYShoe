const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');

router.get('/customers', filterController.getAllFilters);

module.exports = router;

const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');

router.get('/', filterController.getAllFilters);

module.exports = router;

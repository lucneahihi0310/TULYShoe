const express = require('express');
const { getInventory, getStatusList } = require('../controllers/inventory.controller');
const router = express.Router();

// Route xem tồn kho 
router.get('/', getInventory);
router.get('/status', getStatusList);
module.exports = router;

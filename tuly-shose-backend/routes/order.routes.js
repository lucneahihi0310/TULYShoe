const express = require('express');
const { getAllOrders, confirmOrder } = require('../controllers/order.controller');
const router = express.Router();

router.get('/', getAllOrders);
router.put('/confirm/:orderId', confirmOrder);
module.exports = router;

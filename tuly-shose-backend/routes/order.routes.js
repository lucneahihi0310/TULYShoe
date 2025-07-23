const express = require('express');
const { getAllOrders, confirmOrder, updateOrderStatus, getOrderStatuses } = require('../controllers/order.controller');
const router = express.Router();

router.get('/', getAllOrders);
router.put('/confirm/:orderId', confirmOrder);
router.put("/update-status/:orderId", updateOrderStatus);
router.get('/order-status', getOrderStatuses);

module.exports = router;

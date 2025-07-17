const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { createOrder, getOrderByOrderCode, getOrdersByUserId, getOrderDetailById } = require('../controllers/order.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.use(express.json());
router.post('/customers', createOrder);
router.get('/customers/:orderCode', getOrderByOrderCode);
router.get('/user/:userId', getOrdersByUserId);
router.get('/detail/:orderId', getOrderDetailById);

module.exports = router;

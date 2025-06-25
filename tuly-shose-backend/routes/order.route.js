const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllOrders, getOrderById } = require('../controllers/order.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;

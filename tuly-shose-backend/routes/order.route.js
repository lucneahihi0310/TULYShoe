const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { createOrder } = require('../controllers/order.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.use(express.json());
router.post('/customers', createOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllOrderDetails, getOrderDetailById } = require('../controllers/orderDetail.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllOrderDetails);
router.get('/:id', getOrderDetailById);

module.exports = router;

const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllOrderStatuses } = require('../controllers/orderStatus.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.use(express.json());
router.get('/get_all_order_statuses', getAllOrderStatuses);

module.exports = router;

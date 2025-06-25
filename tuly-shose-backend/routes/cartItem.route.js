const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllCartItems, getCartItemById } = require('../controllers/cartItem.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllCartItems);
router.get('/:id', getCartItemById);

module.exports = router;

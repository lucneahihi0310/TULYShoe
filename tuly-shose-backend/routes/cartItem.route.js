const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllCartItems, getCartItemById, addCartItem } = require('../controllers/cartItem.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllCartItems);
router.get('/:id', getCartItemById);
router.post('/', addCartItem);

module.exports = router;

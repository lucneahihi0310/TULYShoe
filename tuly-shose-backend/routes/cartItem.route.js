const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllCartItems, getCartItemById, addCartItem, getCartItemsByUserId, updateCartItemQuantity, deleteCartItem } = require('../controllers/cartItem.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllCartItems);
router.get('/:id', getCartItemById);
router.get('/user/:userId', getCartItemsByUserId);
router.post('/', addCartItem);
router.put('/:id', updateCartItemQuantity);
router.delete('/:id', deleteCartItem);


module.exports = router;

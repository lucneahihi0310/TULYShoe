const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllCartItems, getCartItemById, addCartItem, getCartItemsByUserId, updateCartItemQuantity, deleteCartItem } = require('../controllers/cartItem.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/customers', getAllCartItems);
router.get('/customers/:id', getCartItemById);
router.get('/customers/user/:userId', getCartItemsByUserId);
router.post('/customers', addCartItem);
router.put('/customers/:id', updateCartItemQuantity);
router.delete('/customers/:id', deleteCartItem);


module.exports = router;

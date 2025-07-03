const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllAddress, getAddressById, addAddress, updateAddress, deleteAddress } = require('../controllers/address_shipping.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}
router.use(timlog);
router.use(express.json());

router.get('/customers/', middleware, getAllAddress);
router.get('/customers/:id', middleware, getAddressById);
router.post('/customers/', addAddress);
router.put('/customers/:id', middleware, updateAddress);
router.delete('/customers/:id', middleware, deleteAddress);

module.exports = router;
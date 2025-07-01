const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllAddress, getAddressById, addAddress, updateAddress, deleteAddress, updateAddressById } = require('../controllers/address_shipping.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}
router.use(timlog);
router.use(express.json());

router.get('/', middleware, getAllAddress);
router.get('/:id', middleware, getAddressById);
router.post('/', addAddress);
router.put('/:id', middleware, updateAddress);
router.delete('/:id', middleware, deleteAddress);
module.exports = router;
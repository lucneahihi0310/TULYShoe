const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllProductDetails, getProductDetailById, getProductDetailsByProduct, getRelatedProducts } = require('../controllers/productDetail.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/customers', getAllProductDetails);
router.get('/customers/:id', getProductDetailById);
router.get('/customers/product/:productId', getProductDetailsByProduct);
router.get('/customers/related/:detailId', getRelatedProducts);

module.exports = router;

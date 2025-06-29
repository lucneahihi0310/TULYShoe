const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { getAllProductDetails, getProductDetailById, getProductDetailsByProduct, getRelatedProducts } = require('../controllers/productDetail.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/', getAllProductDetails);
router.get('/:id', getProductDetailById);
router.get('/product/:productId', getProductDetailsByProduct);
router.get('/related/:detailId', getRelatedProducts);

module.exports = router;

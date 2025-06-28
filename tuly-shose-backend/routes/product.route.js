const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const {getFilteredProducts } = require('../controllers/product.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}

router.use(timlog);
router.get('/listproducts', getFilteredProducts);


module.exports = router;

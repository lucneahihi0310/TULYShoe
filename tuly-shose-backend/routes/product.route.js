const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const {getFilteredProducts, list_product, create_product } = require('../controllers/product.controller');

const timlog = (req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
}
router.use(express.json());
router.use(timlog);
router.get('/customers/listproducts', getFilteredProducts);
router.get('/manager/list_product', list_product);
router.post('/manager/create_product', create_product);
// router.put('/sizes/edit/:id', edit_size);
// router.delete('/sizes/delete/:id', delete_size);

module.exports = router;

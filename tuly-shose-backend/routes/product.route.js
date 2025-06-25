const express = require('express');
const { list_product } = require('../controllers/product.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/products', list_product);
// router.post('/sizes/create', create_size);
// router.put('/sizes/edit/:id', edit_size);
// router.delete('/sizes/delete/:id', delete_size);

module.exports = router;
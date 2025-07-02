const express = require('express');
const { list_product_detail } = require('../controllers/product_detail.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/product_details', list_product_detail);
// router.post('/brands/create', create_brand);
// router.put('/brands/edit/:id', edit_brand);
// router.delete('/brands/delete/:id', delete_brand);

module.exports = router;
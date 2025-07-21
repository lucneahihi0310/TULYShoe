const express = require('express');
const { list_product_detail, list_product_detail_by_id, create_product_detail, edit_product_detail, delete_product_detail } = require('../controllers/product_detail.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/manager/list_product_detail', list_product_detail);
router.get('/manager/list_product_detail_by_id/:id', list_product_detail_by_id);
router.post('/manager/create_product_detail', create_product_detail);
router.put('/manager/edit_product_detail/:id', edit_product_detail);
router.delete('/manager/delete_product_detail/:id', delete_product_detail);

module.exports = router;
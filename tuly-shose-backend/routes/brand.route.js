const express = require('express');
const { list_brand, create_brand, edit_brand, delete_brand } = require('../controllers/brand.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/brands', list_brand);
router.post('/brands/create', create_brand);
router.put('/brands/edit/:id', edit_brand);
router.delete('/brands/delete/:id', delete_brand);

module.exports = router;
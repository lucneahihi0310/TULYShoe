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
router.get('/manager/list_brand', list_brand);
router.post('/manager/create_brand', create_brand);
router.put('/manager/edit_brand/:id', edit_brand);
router.delete('/manager/delete_brand/:id', delete_brand);

module.exports = router;
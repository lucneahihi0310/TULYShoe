const express = require('express');
const { list_category, create_category, edit_category, delete_category } = require('../controllers/category.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/manager/list_category', list_category);
router.post('/manager/create_category', create_category);
router.put('/manager/edit_category/:id', edit_category);
router.delete('/manager/delete_category/:id', delete_category);

module.exports = router;
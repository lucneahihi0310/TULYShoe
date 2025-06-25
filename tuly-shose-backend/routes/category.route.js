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
router.get('/categories', list_category);
router.post('/categories/create', create_category);
router.put('/categories/edit/:id', edit_category);
router.delete('/categories/delete/:id', delete_category);

module.exports = router;
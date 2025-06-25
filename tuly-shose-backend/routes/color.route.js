const express = require('express');
const { list_color, create_color, edit_color, delete_color } = require('../controllers/color.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/colors', list_color);
router.post('/colors/create', create_color);
router.put('/colors/edit/:id', edit_color);
router.delete('/colors/delete/:id', delete_color);

module.exports = router;
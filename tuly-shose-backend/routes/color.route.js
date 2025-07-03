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
router.get('/manager/list_color', list_color);
router.post('/manager/create_color', create_color);
router.put('/manager/edit_color/:id', edit_color);
router.delete('/manager/delete_color/:id', delete_color);

module.exports = router;
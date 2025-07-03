const express = require('express');
const { list_size, create_size, edit_size, delete_size } = require('../controllers/size.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/manager/list_size', list_size);
router.post('/manager/create_size', create_size);
router.put('/manager/edit_size/:id', edit_size);
router.delete('/manager/delete_size/:id', delete_size);

module.exports = router;
const express = require('express');
const { list_form, create_form, edit_form, delete_form } = require('../controllers/form.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/manager/list_form', list_form);
router.post('/manager/create_form', create_form);
router.put('/manager/edit_form/:id', edit_form);
router.delete('/manager/delete_form/:id', delete_form);

module.exports = router;
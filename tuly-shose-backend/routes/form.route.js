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
router.get('/forms', list_form);
router.post('/forms/create', create_form);
router.put('/forms/edit/:id', edit_form);
router.delete('/forms/delete/:id', delete_form);

module.exports = router;
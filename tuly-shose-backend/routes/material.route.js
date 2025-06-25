const express = require('express');
const { list_material, create_material, edit_material, delete_material } = require('../controllers/material.controller');
const router = express.Router();

const timelog = (req, res, next) => {
    console.log(`Date : ${Date.now()}`);
    next();
}
router.use(timelog);
router.use(express.json());
//định nghĩa các router dưới đây :
router.get('/materials', list_material);
router.post('/materials/create', create_material);
router.put('/materials/edit/:id', edit_material);
router.delete('/materials/delete/:id', delete_material);

module.exports = router;
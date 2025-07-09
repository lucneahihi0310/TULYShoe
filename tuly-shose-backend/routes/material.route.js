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
router.get('/manager/list_material', list_material);
router.post('/manager/create_material', create_material);
router.put('/manager/edit_material/:id', edit_material);
router.delete('/manager/delete_material/:id', delete_material);

module.exports = router;
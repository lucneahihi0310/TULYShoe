const category = require('../models/category.model');

exports.list_category = async (req, res, next) => {
    try {
        const newCategory = await category.find();
        const listCategory = newCategory.map((c) => {
            return {
                _id: c.id,
                category_name: c.category_name ,
                status: c.is_active
            }
        })
        res.status(201).json(listCategory);
    } catch (error){
        next(error);
    }
}
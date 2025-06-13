const category = require('../models/category.model');
const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

exports.list_category = async (req, res, next) => {
    try {
        const newCategory = await category.find();
        const listCategory = newCategory.map((c) => {
            return {
                _id: c.id,
                category_name: c.category_name,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listCategory);
    } catch (error) {
        next(error);
    }
}

exports.create_category = async (req, res, next) => {
    try {
        const newCategory = new category({
            category_name: req.body.category_name,
            is_active: req.body.is_active
        })
        const insertCategory = await newCategory.save();
        res.status(201).json(insertCategory);
    } catch (error) {
        next(error);
    }
}

exports.edit_category = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { category_name, is_active } = req.body;
        const updatedCategory = await category.findByIdAndUpdate(
            id,
            { category_name, is_active },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(201).json(updatedCategory);
    } catch (error) {
        next(error)
    }
}
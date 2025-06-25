const size = require('../models/size.model');
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

exports.list_size = async (req, res, next) => {
    try {
        const newSize = await size.find();
        const listSize = newSize.map((c) => {
            return {
                _id: c.id,
                size_name: c.size_name,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listSize);
    } catch (error) {
        next(error);
    }
}

exports.create_size = async (req, res, next) => {
    try {
        const newSize = new size({
            size_name: req.body.size_name,
            is_active: req.body.is_active
        })
        const insertSize = await newSize.save();
        res.status(201).json(insertSize);
    } catch (error) {
        next(error);
    }
}

exports.edit_size = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { size_name, is_active } = req.body;
        const updatedSize = await size.findByIdAndUpdate(
            id,
            { size_name, is_active, update_at: new Date().toISOString() },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );
        res.status(201).json(updatedCategory);
    } catch (error) {
        next(error);
    }
}

exports.delete_size = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteSize = await size.findByIdAndDelete(id);
        res.status(201).json(deleteSize);
    } catch (error) {
        next(error);
    }
}
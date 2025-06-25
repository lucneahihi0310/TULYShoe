const color = require('../models/color.model');
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

exports.list_color = async (req, res, next) => {
    try {
        const newColor = await color.find();
        const listColor = newColor.map((c) => {
            return {
                _id: c.id,
                color_code: c.color_code,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listColor);
    } catch (error) {
        next(error);
    }
}

exports.create_color = async (req, res, next) => {
    try {
        const newColor = new color({
            color_code: req.body.color_code,
            is_active: req.body.is_active
        })
        const insertColor = await newColor.save();
        res.status(201).json(insertColor);
    } catch (error) {
        next(error);
    }
}

exports.edit_color = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { color_code, is_active } = req.body;
        const updatedColor = await color.findByIdAndUpdate(
            id,
            { color_code, is_active, update_at: new Date().toISOString() },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );
        res.status(201).json(updatedColor);
    } catch (error) {
        next(error);
    }
}

exports.delete_color = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteColor = await color.findByIdAndDelete(id);
        res.status(201).json(deleteColor);
    } catch (error) {
        next(error);
    }
}
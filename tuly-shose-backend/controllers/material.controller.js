const material = require('../models/material.model');
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

exports.list_material = async (req, res, next) => {
    try {
        const newMaterial = await material.find();
        const listMaterial = newMaterial.map((c) => {
            return {
                _id: c.id,
                material_name: c.material_name,
                status: c.is_active,
                create_at: formatDateTime(c.create_at),
                update_at: formatDateTime(c.update_at)
            }
        })
        res.status(201).json(listMaterial);
    } catch (error) {
        next(error);
    }
}

exports.create_material = async (req, res, next) => {
    try {
        const newMaterial = new material({
            material_name: req.body.material_name,
            is_active: req.body.is_active
        })
        const insertMaterial = await newMaterial.save();
        res.status(201).json(insertMaterial);
    } catch (error) {
        next(error);
    }
}

exports.edit_material = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { material_name, is_active } = req.body;
        const updatedMaterial = await material.findByIdAndUpdate(
            id,
            { material_name, is_active, update_at: new Date().toISOString() },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );
        res.status(201).json(updatedMaterial);
    } catch (error) {
        next(error);
    }
}

exports.delete_material = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteMaterial = await material.findByIdAndDelete(id);
        res.status(201).json(deleteMaterial);
    } catch (error) {
        next(error);
    }
}
const brand = require('../models/brand.model');
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

exports.list_brand = async (req, res, next) => {
    try {
        const newBrand = await brand.find();
        const listBrand = newBrand.map((b) => {
            return {
                _id: b.id,
                brand_name: b.brand_name,
                status: b.is_active,
                create_at: formatDateTime(b.create_at),
                update_at: formatDateTime(b.update_at)
            }
        })
        res.status(201).json(listBrand);
    } catch (error) {
        next(error);
    }
}

exports.create_brand = async (req, res, next) => {
    try {
        const newBrand = new brand({
            brand_name: req.body.brand_name,
            is_active: req.body.is_active
        })
        const insertBrand = await newBrand.save();
        res.status(201).json(insertBrand);
    } catch (error) {
        next(error);
    }
}

exports.edit_brand = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { brand_name, is_active } = req.body;
        const updatedBrand = await brand.findByIdAndUpdate(
            id,
            { brand_name, is_active, update_at: new Date().toISOString() },
            { new: true, runValidators: true } // new: trả về bản ghi đã update
        );
        res.status(201).json(updatedBrand);
    } catch (error) {
        next(error);
    }
}

exports.delete_brand = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteBrand = await brand.findByIdAndDelete(id);
        res.status(201).json(deleteBrand);
    } catch (error) {
        next(error);
    }
}
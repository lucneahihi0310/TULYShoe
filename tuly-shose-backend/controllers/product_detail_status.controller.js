const product_detail_status = require('../models/product_detail_status.model');
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

exports.list_product_detail_status = async (req, res, next) => {
    try {
        const newProductDetailStatus = await product_detail_status.find();
        res.status(201).json(newProductDetailStatus);
    } catch (error) {
        next(error);
    }
}
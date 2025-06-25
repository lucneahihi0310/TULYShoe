const Products = require('../models/product.model.js');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.find().populate('brand_id', 'brand_name').populate('material_id', 'material_name').populate('form_id', 'form_name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id).populate('brand_id', 'brand_name').populate('material_id', 'material_name').populate('form_id', 'form_name');
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: error.message });
    }
}
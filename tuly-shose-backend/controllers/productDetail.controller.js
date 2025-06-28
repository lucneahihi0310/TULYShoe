const ProductDetail = require("./../models/productDetail.model");
const Product = require("../models/product.model");

exports.getAllProductDetails = async (req, res) => {
    try {
        const productDetails = await ProductDetail.find()
            .populate("product_id", "product_name")
            .populate("color_id", "color_name")
            .populate("size_id", "size_name")
            .populate("discount_id", "discount_value")
            .populate("product_detail_status", "status_name");
        res.json(productDetails);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách chi tiết sản phẩm", error: error.message });
    }
};

exports.getProductDetailById = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findById(req.params.id)
            .populate("product_id", "product_name")
            .populate("color_id", "color_name")
            .populate("size_id", "size_name")
            .populate("discount_id", "discount_value")
            .populate("product_detail_status", "status_name");
        if (!productDetail) return res.status(404).json({ message: "Không tìm thấy chi tiết sản phẩm!" });
        res.json(productDetail);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết sản phẩm", error: error.message });
    }
};

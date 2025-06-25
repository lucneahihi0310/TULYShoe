const CartItem = require('../models/cartItem.model');

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find()
            .populate("pdetail_id", "product_name")
            .populate("user_id", "username");
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm trong giỏ hàng", error: error.message });
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id)
            .populate("pdetail_id", "product_name")
            .populate("user_id", "username");
        if (!cartItem) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm trong giỏ hàng", error: error.message });
    }
};

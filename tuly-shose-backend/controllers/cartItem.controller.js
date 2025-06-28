const CartItem = require('../models/cartItem.model');

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find()
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm trong giỏ hàng", error: error.message });
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id)
        if (!cartItem) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm trong giỏ hàng", error: error.message });
    }
};

exports.addCartItem = async (req, res) => {
    try {
        const { pdetail_id, user_id, quantity } = req.body;

        if (!pdetail_id || !user_id || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin: pdetail_id, user_id, hoặc quantity" });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        let cartItem = await CartItem.findOne({ pdetail_id, user_id });

        if (cartItem) {
            // Nếu đã có, tăng số lượng
            cartItem.quantity += quantity;
            cartItem.update_at = new Date();
            await cartItem.save();
            return res.status(200).json({ message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng", data: cartItem });
        } else {
            // Nếu chưa có, thêm mới
            const newCartItem = new CartItem({
                pdetail_id,
                user_id,
                quantity,
                create_at: new Date(),
                update_at: new Date()
            });
            await newCartItem.save();
            return res.status(201).json({ message: "Đã thêm sản phẩm vào giỏ hàng", data: newCartItem });
        }
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi thêm sản phẩm vào giỏ hàng",
            error: error.message
        });
    }
};
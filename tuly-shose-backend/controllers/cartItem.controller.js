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

exports.getCartItemsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const cartItems = await CartItem.find({ user_id: userId })
            .populate({
                path: "pdetail_id",
                populate: [
                    { path: "size_id", select: "size_name" },
                    { path: "color_id", select: "color_code" },
                    {
                        path: "product_id",
                        select: "productName title",
                    },
                ],
                select: "images price_after_discount size_id color_id product_id inventory_number",
            });

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy giỏ hàng theo user",
            error: error.message,
        });
    }
};

exports.addCartItem = async (req, res) => {
    try {
        const { pdetail_id, user_id, quantity } = req.body;

        if (!pdetail_id || !user_id || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin: pdetail_id, user_id, hoặc quantity" });
        }

        // Kiểm tra số lượng tồn kho
        const productDetail = await require('../models/productDetail.model').findById(pdetail_id);
        if (!productDetail || productDetail.inventory_number < quantity) {
            return res.status(400).json({ message: "Sản phẩm không đủ số lượng tồn kho" });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        let cartItem = await CartItem.findOne({ pdetail_id, user_id });

        if (cartItem) {
            // Nếu đã có, kiểm tra tổng số lượng
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > productDetail.inventory_number) {
                return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
            }
            cartItem.quantity = newQuantity;
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

// Cập nhật số lượng
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findById(req.params.id).populate('pdetail_id');
        if (!cartItem) return res.status(404).json({ message: "Không tìm thấy mục giỏ hàng" });

        if (quantity > cartItem.pdetail_id.inventory_number) {
            return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
        }

        cartItem.quantity = quantity > 0 ? quantity : 1;
        cartItem.update_at = new Date();
        await cartItem.save();

        res.json({ message: "Cập nhật thành công", data: cartItem });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
    }
};

// Xóa mục giỏ hàng
exports.deleteCartItem = async (req, res) => {
    try {
        const deleted = await CartItem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy mục để xóa" });
        res.json({ message: "Đã xóa khỏi giỏ hàng" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};
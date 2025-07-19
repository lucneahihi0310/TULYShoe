const CartItem = require('../models/cartItem.model');
const ProductDetail = require('../models/productDetail.model');

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm trong giỏ hàng", error: error.message });
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);
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

        const productDetail = await ProductDetail.findById(pdetail_id).populate({
            path: "product_id",
            select: "productName"
        });
        if (!productDetail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        if (productDetail.inventory_number < quantity) {
            return res.status(400).json({
                message: `Số lượng vượt quá tồn kho. Sản phẩm "${productDetail.product_id?.productName || 'Không xác định'}" chỉ còn ${productDetail.inventory_number} trong kho`
            });
        }

        let cartItem = await CartItem.findOne({ pdetail_id, user_id });

        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > productDetail.inventory_number) {
                return res.status(400).json({
                    message: `Số lượng vượt quá tồn kho. Sản phẩm "${productDetail.product_id?.productName || 'Không xác định'}" chỉ còn ${productDetail.inventory_number} trong kho`
                });
            }
            cartItem.quantity = newQuantity;
            cartItem.update_at = new Date();
            await cartItem.save();
            return res.status(200).json({ message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng", data: cartItem });
        } else {
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

exports.syncGuestCart = async (req, res) => {
    try {
        const { user_id, guest_cart } = req.body;

        if (!user_id || !Array.isArray(guest_cart)) {
            return res.status(400).json({ message: "Thiếu user_id hoặc guest_cart không hợp lệ" });
        }

        const results = [];
        for (const item of guest_cart) {
            const { pdetail_id, quantity } = item;

            if (!pdetail_id || !quantity || quantity <= 0) {
                results.push({ pdetail_id, status: "failed", message: "Thiếu pdetail_id hoặc quantity không hợp lệ" });
                continue;
            }

            const productDetail = await ProductDetail.findById(pdetail_id).populate({
                path: "product_id",
                select: "productName"
            });
            if (!productDetail) {
                results.push({ pdetail_id, status: "failed", message: `Không tìm thấy sản phẩm "${pdetail_id}"` });
                continue;
            }

            const existingCartItem = await CartItem.findOne({ pdetail_id, user_id });
            let newQuantity = quantity;

            if (existingCartItem) {
                newQuantity = existingCartItem.quantity + quantity;
                if (newQuantity > productDetail.inventory_number) {
                    results.push({
                        pdetail_id,
                        status: "failed",
                        message: `Số lượng vượt quá tồn kho. Sản phẩm "${productDetail.product_id?.productName || 'Không xác định'}" chỉ còn ${productDetail.inventory_number} trong kho`
                    });
                    continue;
                }
                existingCartItem.quantity = newQuantity;
                existingCartItem.update_at = new Date();
                await existingCartItem.save();
                results.push({ pdetail_id, status: "updated", data: existingCartItem });
            } else {
                if (quantity > productDetail.inventory_number) {
                    results.push({
                        pdetail_id,
                        status: "failed",
                        message: `Số lượng vượt quá tồn kho. Sản phẩm "${productDetail.product_id?.productName || 'Không xác định'}" chỉ còn ${productDetail.inventory_number} trong kho`
                    });
                    continue;
                }
                const newCartItem = new CartItem({
                    pdetail_id,
                    user_id,
                    quantity: newQuantity,
                    create_at: new Date(),
                    update_at: new Date()
                });
                await newCartItem.save();
                results.push({ pdetail_id, status: "added", data: newCartItem });
            }
        }

        res.status(200).json({ message: "Đồng bộ giỏ hàng hoàn tất", results });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi đồng bộ giỏ hàng",
            error: error.message
        });
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findById(req.params.id).populate({
            path: "pdetail_id",
            populate: { path: "product_id", select: "productName" }
        });
        if (!cartItem) return res.status(404).json({ message: "Không tìm thấy mục giỏ hàng" });

        if (quantity > cartItem.pdetail_id.inventory_number) {
            return res.status(400).json({
                message: `Số lượng vượt quá tồn kho. Sản phẩm "${cartItem.pdetail_id.product_id?.productName || 'Không xác định'}" chỉ còn ${cartItem.pdetail_id.inventory_number} trong kho`
            });
        }

        cartItem.quantity = quantity > 0 ? quantity : 1;
        cartItem.update_at = new Date();
        await cartItem.save();

        res.json({ message: "Cập nhật thành công", data: cartItem });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const deleted = await CartItem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy mục để xóa" });
        res.json({ message: "Đã xóa khỏi giỏ hàng" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};
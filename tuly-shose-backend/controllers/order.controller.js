const Order = require("../models/order.model");
const OrderStatus = require("../models/orderStatus.model");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user_id", "username")
            .populate("order_status_id", "status_name")
            .populate("address_shipping_id", "address_detail");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user_id", "username")
            .populate("order_status_id", "status_name")
            .populate("address_shipping_id", "address_detail");
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
    }
};

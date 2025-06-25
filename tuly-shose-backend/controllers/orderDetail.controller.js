const OrderDetail = require('../models/orderDetail.model');

exports.getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find()
            .populate("order_id", "order_name")
            .populate("productdetail_id", "product_name");
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách chi tiết đơn hàng", error: error.message });
    }
};

exports.getOrderDetailById = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id)
            .populate("order_id", "order_name")
            .populate("productdetail_id", "product_name");
        if (!orderDetail) return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng!" });
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: error.message });
    }
};

const orderStatus = require('../models/orderStatus.model');

exports.getAllOrderStatuses = async (req, res) => {
    try {
        const orderStatuses = await orderStatus.find();
        res.json(orderStatuses);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách trạng thái đơn hàng", error: error.message });
    }
};
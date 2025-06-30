const orderModel = require("../models/order.model");
const User = require('../models/account.modle');
require("../models/orderStatus.model");
require("../models/account.modle");
require("../models/address_shipping.model");

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('order_status_id')
            .populate('address_shipping_id')
            .populate('accepted_by')
            .populate('user_id');

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            userName: order.user_id ? `${order.user_id.first_name} ${order.user_id.last_name}` : 'Unknown',
            order_code: order.order_code,
            order_date: order.order_date,
            order_status: order.order_status_id ? order.order_status_id.order_status_name : 'Không có trạng thái',
            address_shipping: order.address_shipping_id ? order.address_shipping_id.address : 'Không có địa chỉ',
            delivery_date: order.delivery_date,
            order_note: order.order_note,
            total_amount: order.total_amount,
            payment_status: order.payment_status,
            accepted_by: order.accepted_by ? `${order.accepted_by.first_name} ${order.accepted_by.last_name}` : null,
            create_at: order.create_at,
            update_at: order.update_at
        }));

        res.status(200).json({
            success: true,
            formattedOrders
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { staffId } = req.body;

        // Kiểm tra staff tồn tại
        const staff = await User.findById(staffId);
        if (!staff) return res.status(404).json({ message: 'Nhân viên không tồn tại' });

        // Tìm đơn hàng
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

        // Kiểm tra nếu đơn hàng đã xác nhận
        if (order.accepted_by) return res.status(400).json({ message: 'Đơn hàng đã được xác nhận trước đó' });

        // Xác nhận đơn hàng
        order.accepted_by = staffId;
        order.update_at = Date.now();
        await order.save();

        res.status(200).json({ message: 'Xác nhận đơn hàng thành công', order });
    } catch (error) {
        console.error('Lỗi xác nhận đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getAllOrders, confirmOrder };

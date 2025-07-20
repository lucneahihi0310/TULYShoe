const Notification = require('../models/notification.model');
require('../models/notification_type.model')
require('../models/account.modle')
require('../models/order.model')
// Lấy danh sách thông báo của staff
const getNotificationsByUser = async (req, res) => {
    try {

        const notifications = await Notification.find()
            .populate({
                path: 'notification_type_id',
                select: 'type_name' // lấy tên notification
            })
            .populate({
                path: 'related_id',
                model: 'Order', // model liên quan
                select: 'order_code' // lấy order_code làm relatedName
            })
            .sort({ create_at: -1 });

        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Đánh dấu đã đọc
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { is_read: true, update_at: new Date() },
            { new: true }
        );

        res.json({ success: true, data: updatedNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getNotificationsByUser, markAsRead};

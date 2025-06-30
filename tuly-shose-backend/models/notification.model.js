const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notification_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NotificationType', required: true },
    message: { type: String, required: true },
    related_id: { type: mongoose.Schema.Types.ObjectId },
    is_read: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);

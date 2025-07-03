const mongoose = require('mongoose');

const NotificationTypeSchema = new mongoose.Schema({
    type_name: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationType', NotificationTypeSchema,"notification_type");

const express = require('express');
const { getNotificationsByUser, markAsRead } = require('../controllers/notification.controller');
const router = express.Router();

// Lấy tất cả thông báo của user
router.get('/:userId', getNotificationsByUser);

// Đánh dấu đã đọc
router.put('/mark-as-read/:id', markAsRead);

module.exports = router;

const API_URL = 'http://localhost:9999/notifications';

// Lấy tất cả thông báo của user
export const fetchNotifications = async (userId) => {
    const response = await fetch(`${API_URL}/${userId}`);
    const data = await response.json();
    return data.data;
};

// Đánh dấu một thông báo đã đọc
export const markAsRead = async (id) => {
    await fetch(`${API_URL}/mark-as-read/${id}`, {
        method: 'PUT'
    });
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (userId) => {
    const notifications = await fetchNotifications(userId);
    const unreadNotifications = notifications.filter(noti => !noti.is_read);
    
    // Đánh dấu tất cả (gửi lần lượt)
    await Promise.all(
        unreadNotifications.map(noti => markAsRead(noti._id))
    );
};

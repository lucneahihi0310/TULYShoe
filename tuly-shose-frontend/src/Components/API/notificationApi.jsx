const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");
// Lấy tất cả thông báo của user
export const fetchNotifications = async () => {
    const response = await fetch(`${BASE_URL}/staff/notifications`);
    const data = await response.json();
    return data.data;
};

// Đánh dấu một thông báo đã đọc
export const markAsRead = async (id) => {
    await fetch(`${BASE_URL}/staff/notifications/mark-as-read/${id}`, {
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

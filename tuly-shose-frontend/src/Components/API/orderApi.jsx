import { getToken } from "./authApi";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/staff/orders`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    return data.formattedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const confirmOrder = async (orderId, staffId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/orders/confirm/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ staffId })
    });

    if (!response.ok) throw new Error("Xác nhận đơn hàng thất bại");

    return await response.json();
  } catch (error) {
    console.error("Lỗi xác nhận đơn hàng:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatusName) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/orders/update-status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ newStatusName })
    });

    if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");

    return await response.json();
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    throw error;
  }
};
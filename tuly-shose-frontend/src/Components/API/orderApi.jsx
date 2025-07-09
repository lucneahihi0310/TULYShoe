import { getToken } from "./authApi";

const API_URL = 'http://localhost:9999/staff/orders';

export const fetchOrders = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data.formattedOrders; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const confirmOrder = async (orderId, staffId) => {
    try {
        const response = await fetch(`http://localhost:9999/staff/orders/confirm/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ staffId })
        });

        if (!response.ok) throw new Error('Xác nhận đơn hàng thất bại');

        return await response.json();
    } catch (error) {
        console.error('Lỗi xác nhận đơn hàng:', error);
        throw error;
    }
};
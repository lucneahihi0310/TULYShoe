const API_URL = 'http://localhost:9999/orders';

export const fetchOrders = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data.formattedOrders; // vì trả về be trong key formattedOrders
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");
export const fetchSchedulesByStaff = async (staffId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/${staffId}`);
    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu lịch làm việc');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi API:', error);
    throw error;
  }
};
// Check-in
export const checkInSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/checkin/${scheduleId}`, { method: 'PUT' });
    if (!response.ok) throw new Error('Check-in thất bại');
    return await response.json();
  } catch (error) {
    console.error('Lỗi check-in:', error);
    throw error;
  }
};

// Check-out
export const checkOutSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/checkout/${scheduleId}`, { method: 'PUT' });
    if (!response.ok) throw new Error('Check-out thất bại');
    return await response.json();
  } catch (error) {
    console.error('Lỗi check-out:', error);
    throw error;
  }
};
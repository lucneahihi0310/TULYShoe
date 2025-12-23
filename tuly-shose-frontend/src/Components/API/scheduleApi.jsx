const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

const authHeaders = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const fetchSchedulesByStaff = async (staffId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/${staffId}`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      console.warn("Không lấy được lịch làm việc, nhưng sẽ tiếp tục hiển thị giao diện.");
      return []; // Trả về mảng rỗng thay vì throw
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Lỗi API (đã bị ẩn):", error);
    return []; // Trả về mảng rỗng nếu lỗi mạng, CORS, v.v.
  }
};

// Check-in
export const checkInSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/checkin/${scheduleId}`, {
      method: "PUT",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) throw new Error("Check-in thất bại");
    return await response.json();
  } catch (error) {
    console.error("Lỗi check-in:", error);
    throw error;
  }
};

// Check-out
export const checkOutSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${BASE_URL}/staff/schedules/checkout/${scheduleId}`, {
      method: "PUT",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) throw new Error("Check-out thất bại");
    return await response.json();
  } catch (error) {
    console.error("Lỗi check-out:", error);
    throw error;
  }
};

export const fetchScheduleSummary = async (staffId, month) => {
  try {
    const qs = month ? `?month=${month}` : '';
    const response = await fetch(`${BASE_URL}/staff/schedules/summary/${staffId}${qs}`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) throw new Error("Không lấy được tổng quan lịch");
    return await response.json();
  } catch (error) {
    console.error("Lỗi lấy tổng quan lịch:", error);
    throw error;
  }
};
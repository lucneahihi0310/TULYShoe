import axios from "axios";
import axiosRetry from "axios-retry";

// Địa chỉ API chính
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");

/**
 * Helper: Lấy token từ localStorage hoặc sessionStorage
 */
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Loading controller (tùy chọn nếu bạn dùng Context hay state quản lý loading)
let setGlobalLoading = null; // được gán từ bên ngoài

export const setLoadingCallback = (callbackFn) => {
  setGlobalLoading = callbackFn;
};

// Tạo một instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, //  10 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Retry nếu lỗi mạng hoặc lỗi server >= 500
axiosRetry(axiosInstance, {
  retries: 3, // thử lại tối đa 3 lần
  retryDelay: (retryCount) => retryCount * 1000, // delay 1s, 2s, 3s
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status >= 500,
});

// Tự động thêm token
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (setGlobalLoading) setGlobalLoading(true);
  return config;
});

// Tắt loading khi response xong
axiosInstance.interceptors.response.use(
  (response) => {
    if (setGlobalLoading) setGlobalLoading(false);
    return response;
  },
  (error) => {
    if (setGlobalLoading) setGlobalLoading(false);
    return Promise.reject(error);
  }
);

// GET
export const fetchData = async (endpoint, includeAuth = false) => {
  try {
    const config = includeAuth
      ? { headers: { Authorization: `Bearer ${getToken()}` } }
      : {};
    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// POST
export const postData = async (endpoint, data, includeAuth = false) => {
  try {
    const config = includeAuth
      ? { headers: { Authorization: `Bearer ${getToken()}` } }
      : {};
    const response = await axiosInstance.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

// PUT
export const updateData = async (endpoint, id, data, includeAuth = false) => {
  try {
    const config = includeAuth
      ? { headers: { Authorization: `Bearer ${getToken()}` } }
      : {};
    const response = await axiosInstance.put(`${endpoint}/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

// DELETE
export const deleteData = async (endpoint, id, includeAuth = false) => {
  try {
    const config = includeAuth
      ? { headers: { Authorization: `Bearer ${getToken()}` } }
      : {};
    const response = await axiosInstance.delete(`${endpoint}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

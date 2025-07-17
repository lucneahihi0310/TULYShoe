import axios from "axios";
import axiosRetry from "axios-retry";

// Base URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");
console.log("API URL đang dùng:", import.meta.env.VITE_API_URL);

// Helper: Lấy token từ localStorage hoặc sessionStorage
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Optional loading control
let setGlobalLoading = null;

export const setLoadingCallback = (callbackFn) => {
  setGlobalLoading = callbackFn;
};

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Retry khi lỗi mạng hoặc lỗi 5xx
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) || error.response?.status >= 500,
});

// Thêm token trước request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (setGlobalLoading) setGlobalLoading(true);
  return config;
});

// Dừng loading sau response
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

// ----------------------
// ✅ Các hàm API chính
// ----------------------

// GET
export const fetchData = async (endpoint, includeAuth = false) => {
  try {
    const headers = {
      "Cache-Control": "no-cache",
    };

    if (includeAuth) {
      headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await axiosInstance.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Request failed.";
    throw new Error(message);
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
    const message = error.response?.data?.message || "Request failed.";
    throw new Error(message);
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
    const message = error.response?.data?.message || "Failed to update.";
    throw new Error(message);
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
    const message = error.response?.data?.message || "Failed to delete.";
    throw new Error(message);
  }
};
export const uploadAvatar = async (formData) => {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/account/upload/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log("Upload Avatar Error:", err.response?.data);
    const message = err.response?.data?.message || "Lỗi upload avatar";
    throw new Error(message);
  }
};

export const uploadReview = async (formData) => {
  try {
    const token = getToken();
    const res = await axios.post(`${BASE_URL}/reviews/customers`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi upload review:", err.response?.data);
    throw new Error(err.response?.data?.message || "Lỗi khi đánh giá");
  }
};

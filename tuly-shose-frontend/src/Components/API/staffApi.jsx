// staffApi.jsx
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");
// Lấy token
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

// Cập nhật profile (BE yêu cầu token nếu có)
export const updateStaffProfile = async (staffId, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/account/profile/${staffId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Cập nhật địa chỉ
export const updateShippingAddress = async (addressId, newAddress) => {
  try {
    const res = await fetch(`${BASE_URL}/address/customers/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ address: newAddress }),
    });

    if (!res.ok) throw new Error("Failed to update address");
    return await res.json();
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Đổi mật khẩu
export const changeStaffPassword = async (staffId, oldPassword, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/account/profile/${staffId}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!res.ok) throw new Error("Failed to change password");
    return await res.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Lấy thông tin profile
export const fetchStaffProfile = async (staffId) => {
  try {
    const res = await fetch(`${BASE_URL}/account/profile/${staffId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload ảnh thất bại");

  const data = await res.json();
  return data.url;
};

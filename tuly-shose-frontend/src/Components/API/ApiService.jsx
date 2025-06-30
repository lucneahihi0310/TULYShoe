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

/**
 * Fetch GET
 */
export const fetchData = async (endpoint, includeAuth = false) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (includeAuth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${endpoint}`, { headers });
    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * POST
 */
export const postData = async (endpoint, data, includeAuth = false) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (includeAuth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    // ✅ CHỈ THROW khi lỗi server (status >= 500) hoặc 400
    if (!response.ok && response.status >= 400) {
      throw new Error(resData?.message || "Request failed.");
    }

    return resData;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};


/**
 * PUT
 */
export const updateData = async (endpoint, id, data, includeAuth = false) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (includeAuth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(`Failed to update data: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

/**
 * DELETE
 */
export const deleteData = async (endpoint, id, includeAuth = false) => {
  try {
    const headers = {};
    if (includeAuth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok)
      throw new Error(`Failed to delete data: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

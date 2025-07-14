const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9999"
    : "https://tulyshoe.onrender.com");
// Lấy danh sách tồn kho
export const fetchInventory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/staff/inventory`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Lấy danh sách trạng thái
export const fetchStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/staff/inventory/status`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    throw error;
  }
};

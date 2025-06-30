const BASE_URL = "http://localhost:9999";

// Lấy danh sách tồn kho
export const fetchInventory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/inventory`);
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
    const response = await fetch(`${BASE_URL}/inventory/status`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    throw error;
  }
};

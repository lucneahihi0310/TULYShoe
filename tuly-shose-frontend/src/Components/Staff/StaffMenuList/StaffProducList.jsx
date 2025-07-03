import React, { useEffect, useState } from "react";
import { fetchInventory, fetchStatus } from "../../API/inventoryApi";
import { AiFillCaretUp } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import '../../../CSS/InventoryList.css'
const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getData = async () => {
      try {
        const [inventoryRes, statusRes] = await Promise.all([
          fetchInventory(),
          fetchStatus()
        ]);

        if (inventoryRes.message === "Danh sách tồn kho" && Array.isArray(inventoryRes.data)) {
          setInventory(inventoryRes.data);
        } else {
          setError("Dữ liệu tồn kho không đúng định dạng");
        }

        if (statusRes.message === "Danh sách trạng thái" && Array.isArray(statusRes.data)) {
          setStatusList(statusRes.data);
        } else {
          setError("Dữ liệu trạng thái không đúng định dạng");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const filteredInventory = inventory.filter(item =>
    (filterStatus === "Tất cả" || item.product_detail_status === filterStatus) &&
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    return sortOrder === "asc" ? a.inventory_number - b.inventory_number : b.inventory_number - a.inventory_number;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  const getStatusColor = (status) => {
    if (status === "Hàng mới về") return { backgroundColor: "#28a745" };
    if (status === "Sắp hết hàng") return { backgroundColor: "#ffc107" };
    if (status === "Hết hàng") return { backgroundColor: "#dc3545" };
    return { backgroundColor: "#6c757d" };
  };

  if (loading) return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
<div style={styles.spinner} className="spinner"></div>
    <div style={styles.loadingText}>Đang tải dữ liệu tồn kho...</div>
  </div>
);

  if (error) return <div style={styles.error}>Lỗi: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Danh sách tồn kho</h2>

      <div style={styles.controls}>
        
          
          <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          style={styles.input}
          
        />
        
        
        <div style={styles.filterRight}>
          <label style={{ marginRight: 10 }}>Lọc theo trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={styles.select}
          >
            <option value="Tất cả">Tất cả</option>
            {statusList.map((status) => (
              <option key={status._id} value={status.productdetail_status_name}>
                {status.productdetail_status_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ảnh</th>
            <th style={styles.th}>Tên sản phẩm</th>
            <th style={styles.th}>
              <div style={styles.sortHeader}>
                <span style={styles.sortText}>Số lượng tồn</span>
                <button onClick={toggleSortOrder} style={styles.sortButton}>
                  {sortOrder === "asc" ? <AiFillCaretUp size={12} color="black" /> : <AiFillCaretDown size={12} color="black" />}
                </button>
              </div>
            </th>
            <th style={styles.th}>Giá sau giảm</th>
            <th style={styles.th}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>Không có sản phẩm phù hợp</td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.productDetailId} style={styles.tr}>
                <td style={styles.td}>
                  <img src={item.images[0]} alt={item.productName} style={styles.productImage} />
                </td>
                <td style={styles.td}>{item.productName}</td>
                <td style={styles.td}>{item.inventory_number}</td>
                <td style={styles.td}>{item.price_after_discount.toLocaleString("vi-VN")} đ</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getStatusColor(item.product_detail_status) }}>
                    {item.product_detail_status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
<div style={{ width: "100%", textAlign: "center" }}>
      <div style={styles.pagination}>
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={currentPage === 1 ? styles.disabledButton : styles.pageButton}
        >
          Prev
        </button>

        <span style={styles.currentPage}>{currentPage}</span>

        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? styles.disabledButton : styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    padding: "0 0 20px 0",
    margin: 0,
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  loading: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: "0 10px",
    boxSizing: "border-box",
  },
  badge: {
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 14,
    display: "inline-block",
  },
  input: {
    width: "20%",
    padding: "8px 12px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  filterRight: {
    width: "30%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  select: {
    padding: "8px 12px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  table: {
    width: "98%", // Lùi vào lề trái 1 chút
    marginLeft: "auto",
    marginRight: "auto",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  },
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f7f7f7",
    textAlign: "center",
    fontWeight: "bold",
  },
  sortHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sortText: {
    width: "80%",
    textAlign: "center",
  },

  sortButton: {
    width: "20%",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  },
  

  // Thêm animation keyframes
  loadingWrapper: {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Chiếm toàn bộ màn hình
},

spinner: {
  border: "6px solid #f3f3f3",
  borderTop: "6px solid #3498db",
  borderRadius: "50%",
  width: 50,
  height: 50,
  animation: "spin 1s linear infinite",
},

loadingText: {
  marginTop: 10,
  fontSize: 16,
},


  tr: {
    border: "1px solid #ccc",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center",
    verticalAlign: "middle",
  },
  productImage: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 4,
  },
  noData: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  pagination: {
    marginTop: 15,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 10px",
    gap: 5,
    
  },

  pageButton: {
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
    borderRadius: 4,
    border: "1px solid rgb(193, 236, 90)",
    backgroundColor: "rgb(193, 236, 90)",
    color: "white",
    width: 60
  },

  disabledButton: {
    padding: "5px 10px",
    fontSize: 12,
    borderRadius: 4,
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    color: "#888",
    cursor: "not-allowed",
    width: 60
  },
  currentPage: {
    fontSize: 14,
    fontWeight: "bold",
  },
};

export default InventoryList;

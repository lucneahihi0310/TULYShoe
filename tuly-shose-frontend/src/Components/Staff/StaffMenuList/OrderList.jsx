import React, { useState, useEffect } from "react";
import "../../../CSS/StaffOrderList.css";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { fetchOrders } from "../../API/orderApi";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const handleStatusUpdate = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === id ? { ...order, order_status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this order?")) {
      setOrders(orders.filter((order) => order._id !== id));
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // ✅ Filter orders trước khi phân trang
  const filteredOrders = orders.filter((order) => {
    return (
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "" || order.order_status === filterStatus)
    );
  });

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="order-container">
      <h2 className="order-title">Quản lý đơn hàng</h2>
      <div className="order-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm tên khách hàng..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-box">
          <select value={filterStatus} onChange={handleFilterChange}>
            <option value="">Trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang vận chuyển">Đang vận chuyển</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
          </select>
        </div>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên khách hàng</th>
            <th>Thời gian đặt hàng</th>
            <th>Trạng thái</th>
            <th>Địa chỉ</th>
            <th>Giao hàng dự kiến</th>
            <th>Note</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Xác nhận</th>
            <th>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order._id}>
              <td>{indexOfFirstOrder + index + 1}</td> {/* STT theo trang */}
              <td>{order.userName}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>
                <select
                  value={order.order_status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                </select>
              </td>
              <td>{order.address_shipping}</td>
              <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
              <td>
                <span className="note">
                  {order.order_note}
                </span>
              </td>              
              <td>{order.total_amount.toLocaleString()} VND</td>
              <td>
                <span
                  className={order.payment_status === "Đã thanh toán" ? "paid" : "unpaid"}
                >
                  {order.payment_status}
                </span>
              </td>
              <td>
                <span
                  className={order.accepted_by ? "accepted" : "not-accepted"}
                >
                  {order.accepted_by || "Chưa xác nhận"}
                </span>
              </td>              <td>
                <button className="btn-view" onClick={() => handleView(order)}>
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active-page" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal View */}
     {showModal && selectedOrder && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* Nút Đóng với Icon */}
      <button className="btn-close" onClick={() => setShowModal(false)}>
        <span className="btn-close-icon"></span>
      </button>

      <h3 className="modal-title">Chi tiết đơn hàng</h3>

      <div className="modal-section">
        <h4 className="section-title">Thông tin khách hàng</h4>
        <div className="info-box">
          <p><strong>Khách hàng:</strong> {selectedOrder.userName}</p>
          <p><strong>Mã đơn hàng:</strong> {selectedOrder.order_code}</p>
          <p><strong>Trạng thái đơn hàng:</strong> {selectedOrder.order_status}</p>
        </div>
      </div>

     

      <div className="modal-section">
        <h4 className="section-title">Thông tin vận chuyển</h4>
        <div className="info-box">
          <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address_shipping}</p>
          <p><strong>Ngày đặt hàng:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
          <p><strong>Ngày giao dự kiến:</strong> {new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Người xác nhận</h4>
        <div className="info-box">
          <p>
            <strong>Người xác nhận:</strong>{" "}
            <span className={selectedOrder.accepted_by ? "accepted" : "not-accepted"}>
              {selectedOrder.accepted_by || "Chưa xác nhận"}
            </span>
          </p>
        </div>
      </div>

      <div className="modal-section">
        <h4 className="section-title">Thời gian</h4>
        <div className="info-box">
          <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.create_at).toLocaleDateString()}</p>
          <p><strong>Ngày cập nhật:</strong> {new Date(selectedOrder.update_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default OrderList;

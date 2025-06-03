import React, { useState } from "react";
import "../../CSS/StaffOrderList.css";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Nguyen Van A",
      status: "Pending",
      createdAt: "2024-06-01",
    },
    {
      id: 2,
      customerName: "Tran Thi B",
      status: "Shipped",
      createdAt: "2024-06-02",
    },
    {
      id: 3,
      customerName: "Le Van C",
      status: "Delivered",
      createdAt: "2024-06-03",
    },
    {
      id: 4,
      customerName: "Pham Thi D",
      status: "Cancelled",
      createdAt: "2024-06-04",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);
  const handleStatusUpdate = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };
  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const filteredOrders = orders.filter((order) => {
    return (
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "" || order.status === filterStatus)
    );
  });

  return (
    <div className="order-container">
      <h2 className="order-title">Order Management</h2>
      <div className="order-controls">
  <div className="search-box">
    <i className="fas fa-search"></i>
    <input
      type="text"
      placeholder="Search by customer name..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>

  <div className="filter-box">
    <select value={filterStatus} onChange={handleFilterChange}>
      <option value="All">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
</div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className={`row-${order.status.toLowerCase()}`}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{order.createdAt}</td>
              <td>
                <button className="btn-view" onClick={() => handleView(order)}>
                  <FaEye />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(order.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Order Details</h3>
            <p>
              <strong>ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Created At:</strong> {selectedOrder.createdAt}
            </p>
            <button className="btn-close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;

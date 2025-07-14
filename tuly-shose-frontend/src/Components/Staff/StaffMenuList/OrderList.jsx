import React, { useState, useEffect, useContext } from "react";
import "../../../CSS/StaffOrderList.css";
import { FaEye, FaCheck, FaEdit } from "react-icons/fa";
import { fetchOrders, confirmOrder, updateOrderStatus } from "../../API/orderApi";
import { AuthContext } from "../../API/AuthContext";
import Swal from 'sweetalert2';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { user } = useContext(AuthContext);

  const statusColors = {
    "Chờ xác nhận": "#0d6efd",
    "Đã xác nhận": "#ffc107",
    "Đang vận chuyển": "#fd7e14",
    "Hoàn thành": "#198754",
  };

  const statusOptions = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang vận chuyển",
    "Hoàn thành",

  ];
  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const handleConfirmOrder = async (orderId) => {
    const confirmResult = await Swal.fire({
      title: 'Bạn có chắc muốn xác nhận đơn hàng này?',
      text: "Thao tác này sẽ không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });

    if (confirmResult.isConfirmed) {
      try {
        const staffId = user._id;
        await confirmOrder(orderId, staffId);
        Swal.fire('Thành công!', 'Đơn hàng đã được xác nhận.', 'success');
        setOrders(orders.map(order =>
          order._id === orderId
            ? {
              ...order,
              accepted_by: `${user.first_name} ${user.last_name}`,
              order_status: "Đã xác nhận" // ✅ cập nhật thủ công ở FE
            }
            : order
        ));

      } catch (error) {
        Swal.fire('Lỗi', 'Xác nhận đơn hàng thất bại', 'error');
        console.error('Xác nhận đơn hàng thất bại:', error);
      }
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter((order) =>
    (order.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) &&
    (filterStatus === "" || order.order_status === filterStatus)
  );



  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAvailableStatusOptions = (currentStatus) => {
    const statusFlow = {
      "Chờ xác nhận": ["Chờ xác nhận", "Đã xác nhận"],
      "Đã xác nhận": ["Đã xác nhận", "Đang vận chuyển"],
      "Đang vận chuyển": ["Đang vận chuyển", "Hoàn thành"],
      "Hoàn thành": ["Hoàn thành"],
    };
    return statusFlow[currentStatus] || [];
  };

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
            <option value="">Tất cả trạng thái</option>
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
            <th>Tổng tiền VNĐ</th>
            <th>Thanh toán</th>
            <th>Người xác nhận</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order._id}>
              <td>{indexOfFirstOrder + index + 1}</td>
              <td>{order.userName}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>
                <select
                  className={`status-select ${order.order_status === "Chờ xác nhận" ? "cho-xac-nhan" :
                    order.order_status === "Đã xác nhận" ? "da-xac-nhan" :
                      order.order_status === "Đang vận chuyển" ? "dang-van-chuyen" :
                        order.order_status === "Hoàn thành" ? "hoan-thanh" :
                          "da-huy"
                    }`}
                  value={order.order_status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      await updateOrderStatus(order._id, newStatus);
                      setOrders(prev =>
                        prev.map(o =>
                          o._id === order._id ? { ...o, order_status: newStatus } : o
                        )
                      );
                      Swal.fire({
                        icon: 'success',
                        title: 'Cập nhật thành công',
                        text: `Trạng thái đơn hàng đã đổi sang "${newStatus}"`,
                        timer: 2000,
                        showConfirmButton: false
                      });
                    } catch (error) {
                      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
                    }
                  }}
                  disabled={!order.accepted_by}
                >

                  {getAvailableStatusOptions(order.order_status).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>

              <td>{order.address_shipping}</td>
              <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
              <td>
                <span className="note">
                  {order.order_note && order.order_note.trim().length > 20
                    ? order.order_note.slice(0, 9) + '...'
                    : order.order_note}
                </span>
              </td>
              <td>{order.total_amount.toLocaleString()}</td>
              <td>
                <span className={order.payment_status === "Đã thanh toán" ? "paid" : "unpaid"}>
                  {order.payment_status}
                </span>
              </td>
              <td>
                <span className={order.accepted_by ? "accepted" : "not-accepted"}>
                  {order.accepted_by || "Chưa xác nhận"}
                </span>
              </td>
              <td className="order-actions">
                <button className="btn-icon" onClick={() => handleView(order)} title="Xem chi tiết">
                  <FaEye />
                </button>


                {!order.accepted_by && (
                  <button className="btn-icon" onClick={() => handleConfirmOrder(order._id)} title="Xác nhận đơn hàng">
                    <FaCheck />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowModal(false)}>
          
            </button>

            <h3 className="modal-title">Chi tiết đơn hàng</h3>

            <div className="modal-section">
              <h4 className="section-title">Thông tin khách hàng</h4>
              <div className="info-box">
                <p><strong>Khách hàng:</strong> {selectedOrder.userName}</p>
                <p><strong>Mã đơn hàng:</strong> {selectedOrder.order_code}</p>
                <p><strong>Trạng thái đơn hàng:</strong> {selectedOrder.order_status}</p>
                <p><strong>Note:</strong> {selectedOrder.order_note}</p>
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

import React, { useEffect, useState } from 'react';
import {
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';

const notificationsData = [
  {
    _id: "60a4c8b2f9a2d3c4e5f6a7d4",
    user_id: "60a4c8b2f9a2d3c4e5f6a8b3",
    notification_type_id: "60a4c8b2f9a2d3c4e5f6a7e4",
    message: "Ca làm của bạn đã kết thúc",
    related_id: "60a4c8b2f9a2d3c4e5f6a7c3",
    is_read: true,
    create_at: "2025-06-08T15:00:00+07:00",
    update_at: "2025-06-08T15:00:00+07:00",
    note: "",
  },
  {
    _id: "60a4c8b2f9a2d3c4e5f6a7d5",
    user_id: "60a4c8b2f9a2d3c4e5f6a8b4",
    notification_type_id: "60a4c8b2f9a2d3c4e5f6a7e4",
    message: "Bạn có ca làm vào ngày mai",
    related_id: "60a4c8b2f9a2d3c4e5f6a7c4",
    is_read: false,
    create_at: "2025-06-09T10:00:00+07:00",
    update_at: "2025-06-09T10:00:00+07:00",
    note: "",
  },
];

const NotificationTable = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filtered, setFiltered] = useState(notificationsData);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, notifications]);

  const applyFilters = () => {
    let result = [...notifications];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (n) =>
          n.user_id.toLowerCase().includes(term) ||
          n.message.toLowerCase().includes(term)
      );
    }

    if (filterStatus === 'read') {
      result = result.filter((n) => n.is_read);
    } else if (filterStatus === 'unread') {
      result = result.filter((n) => !n.is_read);
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, is_read: true } : n
      )
    );
  };

  const handleNoteChange = (id, value) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, note: value } : n
      )
    );
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-3">
      <h4>Thông báo người dùng</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo user hoặc message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="read">Đã đọc</option>
            <option value="unread">Chưa đọc</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Người dùng</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((n, index) => (
            <tr key={n._id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{n.user_id}</td>
              <td>{n.message}</td>
              <td>
                {n.is_read ? (
                  <Badge bg="success">Đã đọc</Badge>
                ) : (
                  <Badge bg="warning">Chưa đọc</Badge>
                )}
              </td>
              <td>{new Date(n.create_at).toLocaleString()}</td>
              <td>
                <Form.Control
                  type="text"
                  value={n.note || ''}
                  onChange={(e) => handleNoteChange(n._id, e.target.value)}
                  placeholder="Nhập ghi chú..."
                />
              </td>
              <td>
                <div className="d-flex gap-1">
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleView(n)}
                  >
                    Xem
                  </Button>
                  {!n.is_read && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleMarkAsRead(n._id)}
                    >
                      Đã đọc
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} />
        {[...Array(totalPages).keys()].map((n) => (
          <Pagination.Item
            key={n + 1}
            active={n + 1 === currentPage}
            onClick={() => setCurrentPage(n + 1)}
          >
            {n + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} />
      </Pagination>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <>
              <p><strong>Người dùng:</strong> {selectedNotification.user_id}</p>
              <p><strong>Loại:</strong> {selectedNotification.notification_type_id}</p>
              <p><strong>Nội dung:</strong> {selectedNotification.message}</p>
              <p><strong>Liên quan:</strong> {selectedNotification.related_id}</p>
              <p><strong>Đã đọc:</strong> {selectedNotification.is_read ? 'Có' : 'Chưa'}</p>
              <p><strong>Thời gian:</strong> {new Date(selectedNotification.create_at).toLocaleString()}</p>
              <p><strong>Ghi chú:</strong> {selectedNotification.note || '(Trống)'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationTable;

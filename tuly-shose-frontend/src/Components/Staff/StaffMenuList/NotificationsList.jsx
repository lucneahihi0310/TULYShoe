"use client"

import { useEffect, useState, useContext } from "react"
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Pagination } from "react-bootstrap"
import { AuthContext } from "../../API/AuthContext"
import { fetchNotifications, markAllAsRead, markAsRead } from "../../API/notificationApi"
import { FaCheck, FaBell, FaClock, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from "react-icons/fa"

const NotificationList = () => {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const notificationsPerPage = 4

  const loadNotifications = async () => {
    try {
      if (!user) return
      setLoading(true)
      const data = await fetchNotifications()
      const sortedData = data.sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
      setNotifications(sortedData)
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    await markAsRead(id)
    setNotifications((prev) => prev.map((noti) => (noti._id === id ? { ...noti, is_read: true } : noti)))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(user._id)
    setNotifications((prev) => prev.map((noti) => ({ ...noti, is_read: true })))
  }

  useEffect(() => {
    loadNotifications()
  }, [user])

  const unreadCount = notifications.filter((noti) => !noti.is_read).length

  // Phân trang
  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification)
  const totalPages = Math.ceil(notifications.length / notificationsPerPage)

  const getTypeIcon = (typeName) => {
    switch (typeName?.toLowerCase()) {
      case "info":
        return <FaInfoCircle />
      case "warning":
        return <FaExclamationTriangle />
      case "error":
        return <FaTimes />
      case "success":
        return <FaCheckCircle />
      default:
        return <FaBell />
    }
  }

  const getTypeBadgeVariant = (typeName) => {
    switch (typeName?.toLowerCase()) {
      case "info":
        return "info"
      case "warning":
        return "warning"
      case "error":
        return "danger"
      case "success":
        return "success"
      default:
        return "secondary"
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      <FaBell className="text-primary" style={{ fontSize: "2.5rem" }} />
                      {unreadCount > 0 && (
                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h1 className="mb-0 fw-bold text-dark" style={{ fontSize: "2.5rem" }}>
                        Thông báo
                      </h1>
                      <small className="text-muted">Quản lý thông báo của bạn</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats & Controls */}
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <Alert variant="info" className="d-inline-flex align-items-center mb-0 rounded-pill">
            <FaBell className="me-2" />
            Bạn có <strong className="mx-1 text-danger">{unreadCount}</strong> thông báo chưa đọc
          </Alert>
        </Col>
        <Col md={8} className="d-flex justify-content-end gap-3">
          <Button
            variant="primary"
            className="rounded-pill position-relative"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheck className="me-2" />
            Đánh dấu đã đọc
            {unreadCount > 0 && (
              <Badge bg="warning" text="dark" pill className="position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <Button variant="outline-secondary" className="rounded-pill" onClick={loadNotifications} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tải...
              </>
            ) : (
              <>
                <FaBell className="me-2" />
                Làm mới
              </>
            )}
          </Button>
        </Col>
      </Row>

      {/* Notifications List */}
      <Row>
        <Col>
          {loading ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">Đang tải thông báo...</p>
              </Card.Body>
            </Card>
          ) : currentNotifications.length > 0 ? (
            <Row className="g-3">
              {currentNotifications.map((notification) => {
                const typeName = notification.notification_type_id?.type_name || "default"
                return (
                  <Col xs={12} key={notification._id}>
                    <Card
                      className={`border-0 shadow-sm h-100 ${
                        !notification.is_read ? "border-start border-primary border-4" : ""
                      }`}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col lg={10} md={7}>
                            <div className="d-flex align-items-start mb-2">
                              <Badge bg={getTypeBadgeVariant(typeName)} className="me-2 d-flex align-items-center">
                                {getTypeIcon(typeName)}
                                <span className="ms-1">{typeName.charAt(0).toUpperCase() + typeName.slice(1)}</span>
                              </Badge>
                              {!notification.is_read && (
                                <Badge bg="primary" pill>
                                  Mới
                                </Badge>
                              )}
                            </div>
                            <p className={`mb-2 ${!notification.is_read ? "fw-semibold" : "text-muted"}`}>
                              {notification.message}
                            </p>
                            <div className="d-flex align-items-center text-muted small">
                              <FaClock className="me-1" />
                              <span>{formatTime(notification.create_at)}</span>
                            </div>
                          </Col>
                          <Col lg={2} md={5} className="text-md-end text-center mt-3 mt-md-0">
                            {!notification.is_read && (
                              <Button
                                variant="success"
                                size="sm"
                                className="rounded-pill"
                                onClick={() => handleMarkAsRead(notification._id)}
                              >
                                <FaCheck className="me-1" />
                                Đã đọc
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <FaBell className="text-muted mb-3" style={{ fontSize: "4rem" }} />
                <h5 className="text-muted">Không có thông báo</h5>
                <p className="text-muted">Thông báo mới sẽ xuất hiện ở đây</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                return (
                  <Pagination.Item key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                )
              })}
              <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default NotificationList

import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../API/AuthContext"
import { fetchNotifications, markAllAsRead, markAsRead } from "../../API/notificationApi"
import { FaCheck, FaBell, FaClock, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from "react-icons/fa"

const NotificationList = () => {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const notificationsPerPage = 5

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

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

  const getTypeBadgeClass = (typeName) => {
    switch (typeName?.toLowerCase()) {
      case "info":
        return "badge bg-info"
      case "warning":
        return "badge bg-warning text-dark"
      case "error":
        return "badge bg-danger"
      case "success":
        return "badge bg-success"
      default:
        return "badge bg-secondary"
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
    <>
      {/* Bootstrap CSS CDN */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body py-4">
                  <div className="row align-items-center">
                    {/* Left side - Icon và Title */}
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <FaBell className="text-primary" style={{ fontSize: "2.5rem" }} />
                          {unreadCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>
                        <div>
                          <h1 className="mb-0 fw-bold text-dark" style={{ fontSize: "2.5rem" }}>
                            Thông báo
                          </h1>
                          <small className="text-muted">Quản lý thông báo của bạn</small>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action Button */}

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="row mb-4 align-items-center">
            {/* Thông báo chưa đọc */}
            <div className="col-md-4 d-flex align-items-center">
              <div className="alert alert-info border-0 rounded-pill d-inline-flex align-items-center mb-0 px-3 py-2">
                <FaBell className="me-2" />
                Bạn có <strong className="mx-1 text-danger">{unreadCount}</strong> thông báo chưa đọc
              </div>
            </div>

            {/* Cụm nút: Đánh dấu đã đọc + Làm mới */}
            <div className="col-md-8 d-flex justify-content-end" style={{ gap: "20px" }}>
              {/* Nút đánh dấu đã đọc */}
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="btn btn-primary rounded-pill px-3 py-2 shadow-sm position-relative overflow-hidden d-flex align-items-center justify-content-center"
                style={{
                  background: unreadCount > 0 ? "linear-gradient(45deg, #007bff, #0056b3)" : "",
                  border: "none",
                  transition: "all 0.3s ease",
                  transform: unreadCount > 0 ? "scale(1.02)" : "scale(1)",
                  width: "180px",
                  fontSize: "14px"
                }}
              >
                <FaCheck className="me-2" />
                <span className="fw-semibold">Đánh dấu đã đọc</span>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Nút làm mới */}
              <button
                onClick={loadNotifications}
                disabled={loading}
                className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center"
                style={{
                  width: "120px",
                  padding: "6px 12px",
                  fontSize: "14px"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <FaBell className="me-2" />
                    Làm mới
                  </>
                )}
              </button>
            </div>
          </div>


          {/* Notifications List */}
          <div className="row">
            <div className="col-12">
              {loading ? (
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Đang tải thông báo...</p>
                  </div>
                </div>
              ) : currentNotifications.length > 0 ? (
                <div className="row g-3">
                  {currentNotifications.map((notification) => {
                    const typeName = notification.notification_type_id?.type_name || "default"

                    return (
                      <div key={notification._id} className="col-12">
                        <div
                          className={`card shadow-sm border-0 h-100 ${!notification.is_read ? "border-start border-primary border-4" : ""}`}
                        >
                          <div className="card-body">
                            <div className="row align-items-center">
                              {/* Left side - Content */}
                              <div className="col-lg-8 col-md-7">
                                <div className="d-flex align-items-start mb-2">
                                  <span className={`${getTypeBadgeClass(typeName)} me-2`}>
                                    {getTypeIcon(typeName)}
                                    <span className="ms-1">{typeName.charAt(0).toUpperCase() + typeName.slice(1)}</span>
                                  </span>
                                  {!notification.is_read && <span className="badge bg-primary rounded-pill">Mới</span>}
                                </div>

                                <p className={`mb-2 ${!notification.is_read ? "fw-semibold" : "text-muted"}`}>
                                  {notification.message}
                                </p>

                                <div className="d-flex align-items-center text-muted small">
                                  <FaClock className="me-1" />
                                  <span>{formatTime(notification.create_at)}</span>
                                </div>
                              </div>

                              {/* Right side - Actions */}
                              <div className="col-lg-4 col-md-5 text-md-end text-center mt-3 mt-md-0">
                                {!notification.is_read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification._id)}
                                    className="btn btn-success rounded-pill btn-sm"
                                  >
                                    <FaCheck className="me-1" />
                                    Đã đọc
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center py-5">
                    <FaBell className="text-muted mb-3" style={{ fontSize: "4rem" }} />
                    <h5 className="text-muted">Không có thông báo</h5>
                    <p className="text-muted">Thông báo mới sẽ xuất hiện ở đây</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-4">
              <div className="col-12 d-flex justify-content-center">
                <nav aria-label="Pagination">
                  <ul className="pagination pagination-lg">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link rounded-pill me-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &laquo; Trước
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link rounded-pill mx-1" onClick={() => handlePageChange(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link rounded-pill ms-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Sau &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificationList

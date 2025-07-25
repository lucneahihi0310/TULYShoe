"use client"

import { useState, useEffect, useContext } from "react"
import { Container, Row, Col, Card, Badge, Button, ProgressBar, ListGroup, Alert, Spinner } from "react-bootstrap"
import {
  FaShoppingCart,
  FaBell,
  FaCalendarAlt,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaTasks,
  FaDollarSign,
} from "react-icons/fa"
import { AuthContext } from "../../API/AuthContext"
import { fetchOrders } from "../../API/orderApi"
import { fetchNotifications } from "../../API/notificationApi"
import { fetchSchedulesByStaff } from "../../API/scheduleApi"
import { fetchInventory } from "../../API/inventoryApi"
import { useNavigate } from "react-router-dom"

const DashboardOverview = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    notifications: [],
    schedules: [],
    inventory: [],
  })

  const navigate = useNavigate();
  useEffect(() => {
    if (user?._id) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersRes, notificationsRes, schedulesRes, inventoryRes] = await Promise.all([
        fetchOrders(),
        fetchNotifications(),
        fetchSchedulesByStaff(user._id),
        fetchInventory(),
      ])

      setDashboardData({
        orders: ordersRes || [],
        notifications: notificationsRes || [],
        schedules: schedulesRes || [],
        inventory: inventoryRes.data || [],
      })
    } catch (error) {
      console.error("Lỗi khi tải dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  // Tính toán thống kê
  const stats = {
    totalOrders: dashboardData.orders.length,
    pendingOrders: dashboardData.orders.filter((order) => order.order_status === "Chờ xác nhận").length,
    completedOrders: dashboardData.orders.filter((order) => order.order_status === "Hoàn thành").length,
    unreadNotifications: dashboardData.notifications.filter((notif) => !notif.is_read).length,
    todaySchedules: dashboardData.schedules.filter(
      (schedule) => schedule.schedule_date === new Date().toISOString().split("T")[0],
    ).length,
    lowStockItems: dashboardData.inventory.filter((item) => item.inventory_number < 10).length,
    totalRevenue: dashboardData.orders
      .filter((order) => order.order_status === "Hoàn thành")
      .reduce((sum, order) => sum + (order.total_amount || 0), 0),
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  const getRecentOrders = () => {
    return dashboardData.orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).slice(0, 5)
  }

  const getRecentNotifications = () => {
    return dashboardData.notifications.sort((a, b) => new Date(b.create_at) - new Date(a.create_at)).slice(0, 4)
  }

  const getTodaySchedules = () => {
    const today = new Date().toISOString().split("T")[0]
    return dashboardData.schedules.filter((schedule) => schedule.schedule_date === today)
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "warning"
      case "Đã xác nhận":
        return "info"
      case "Đang vận chuyển":
        return "primary"
      case "Hoàn thành":
        return "success"
      default:
        return "secondary"
    }
  }

  const getWorkStatusVariant = (status) => {
    switch (status) {
      case "Chưa bắt đầu ca làm":
        return "warning"
      case "Đang thực hiện công việc":
        return "info"
      case "Ca làm đã hoàn thành":
        return "success"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Đang tải dashboard...</p>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card
  className="border-0 shadow-sm text-white"
  style={{
    backgroundImage: "linear-gradient(135deg, #7d93f6 0%, #764ba2 100%)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
>

            <Card.Body className="text-white py-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="mb-1 fw-bold">
                    {getGreeting()}, {user?.first_name}! 👋
                  </h2>
                  <p className="mb-0 opacity-75">Chào mừng bạn quay trở lại. Đây là tổng quan hoạt động hôm nay.</p>
                </Col>
                <Col md={4} className="text-end">
                  <div className="text-white-50 small">
                    {new Date().toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <FaShoppingCart className="text-primary" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold text-primary fs-4">{stats.totalOrders}</div>
                  <div className="text-muted small">Tổng đơn hàng</div>
                  <div className="small text-warning">{stats.pendingOrders} chờ xác nhận</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <FaDollarSign className="text-success" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold text-success fs-4">{stats.totalRevenue.toLocaleString("vi-VN")}₫</div>
                  <div className="text-muted small">Doanh thu</div>
                  <div className="small text-success">{stats.completedOrders} đơn hoàn thành</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <FaBell className="text-warning" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold text-warning fs-4">{stats.unreadNotifications}</div>
                  <div className="text-muted small">Thông báo mới</div>
                  <div className="small text-muted">{dashboardData.notifications.length} tổng cộng</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <FaCalendarAlt className="text-info" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold text-info fs-4">{stats.todaySchedules}</div>
                  <div className="text-muted small">Ca làm hôm nay</div>
                  <div className="small text-muted">{dashboardData.schedules.length} tổng tuần</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Recent Orders */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold text-primary">
                  <FaShoppingCart className="me-2" />
                  Đơn hàng gần đây
                </h5>
                
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {getRecentOrders().length > 0 ? (
                <ListGroup variant="flush">
                  {getRecentOrders().slice(0, 3).map((order) => (
                    <ListGroup.Item key={order._id} className="d-flex align-items-center justify-content-between py-3">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{order.userName}</div>
                        <div className="small text-muted">
                          {new Date(order.order_date).toLocaleDateString("vi-VN")} •{" "}
                          {order.total_amount?.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                      <Badge bg={getStatusVariant(order.order_status)}>{order.order_status}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <FaShoppingCart size={48} className="mb-3 opacity-25" />
                  <p>Chưa có đơn hàng nào</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Today's Schedule */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold text-info">
                  <FaCalendarAlt className="me-2" />
                  Lịch làm hôm nay
                </h5>
                
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {getTodaySchedules().length > 0 ? (
                <ListGroup variant="flush">
                  {getTodaySchedules().map((schedule) => (
                    <ListGroup.Item
                      key={schedule._id}
                      className="d-flex align-items-center justify-content-between py-3"
                    >
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{schedule.notes}</div>
                        <div className="small text-muted">
                          <FaClock className="me-1" />
                          {schedule.scheduled_start_time} - {schedule.scheduled_end_time}
                        </div>
                      </div>
                      <Badge bg={getWorkStatusVariant(schedule.work_status)}>{schedule.work_status}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <FaCalendarAlt size={48} className="mb-3 opacity-25" />
                  <p>Không có ca làm việc hôm nay</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      

      
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold text-secondary" >
                <FaTasks className="me-2" />
                Thao tác nhanh
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button variant="outline-primary" className="w-100 py-3"
                  onClick={() => navigate("/dashboard/orders")} >
                    <FaShoppingCart className="d-block mb-2" size={24} />
                    Quản lý đơn hàng
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-info" className="w-100 py-3"
                  onClick={() => navigate("/dashboard/schedule")} >
                    <FaCalendarAlt className="d-block mb-2" size={24} />
                    Xem lịch làm việc
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-warning" className="w-100 py-3"
                  onClick={() => navigate("/dashboard/notifications")} >
                    <FaBell className="d-block mb-2" size={24} />
                    Thông báo
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="outline-success" className="w-100 py-3"
                  onClick={() => navigate("/dashboard/products")} >
                    <FaBox className="d-block mb-2" size={24} />
                    Kiểm tra kho
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardOverview

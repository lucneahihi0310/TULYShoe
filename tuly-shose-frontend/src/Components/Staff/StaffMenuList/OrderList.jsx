"use client"

import { useState, useEffect, useContext } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Modal,
  Pagination,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap"
import { FaEye, FaCheck, FaSearch, FaFilter, FaUser, FaMapMarkerAlt } from "react-icons/fa"
import { fetchOrders, confirmOrder, updateOrderStatus } from "../../API/orderApi"
import { AuthContext } from "../../API/AuthContext"
import Swal from "sweetalert2"

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 6
  const { user } = useContext(AuthContext)

  const statusVariants = {
    "Chờ xác nhận": "warning",
    "Đã xác nhận": "info",
    "Đang vận chuyển": "primary",
    "Hoàn thành": "success",
    "Đã hủy": "danger",
  }

  const statusOptions = ["Chờ xác nhận", "Đã xác nhận", "Đang vận chuyển", "Hoàn thành"]

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        const data = await fetchOrders()
        // Sắp xếp theo thời gian từ mới nhất đến cũ nhất
        const sortedOrders = data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        setOrders(sortedOrders)
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const handleFilterChange = (e) => setFilterStatus(e.target.value)

  const handleConfirmOrder = async (orderId) => {
    const confirmResult = await Swal.fire({
      title: "Xác nhận đơn hàng",
      text: "Bạn có chắc muốn xác nhận đơn hàng này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    })

    if (confirmResult.isConfirmed) {
      try {
        const staffId = user._id
        await confirmOrder(orderId, staffId)

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đơn hàng đã được xác nhận.",
          timer: 2000,
          showConfirmButton: false,
        })

        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  accepted_by: `${user.first_name} ${user.last_name}`,
                  order_status: "Đã xác nhận",
                }
              : order,
          ),
        )
      } catch (error) {
        Swal.fire("Lỗi", "Xác nhận đơn hàng thất bại", "error")
        console.error("Xác nhận đơn hàng thất bại:", error)
      }
    }
  }

  const handleView = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, order_status: newStatus } : o)))
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: `Trạng thái đơn hàng đã đổi sang "${newStatus}"`,
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error")
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) &&
      (filterStatus === "" || order.order_status === filterStatus),
  )

  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const getAvailableStatusOptions = (currentStatus) => {
    const statusFlow = {
      "Chờ xác nhận": ["Chờ xác nhận", "Đã xác nhận"],
      "Đã xác nhận": ["Đã xác nhận", "Đang vận chuyển"],
      "Đang vận chuyển": ["Đang vận chuyển", "Hoàn thành"],
      "Hoàn thành": ["Hoàn thành"],
    }
    return statusFlow[currentStatus] || []
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const orderDate = new Date(dateString)
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return formatDateTime(dateString).date
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1 fw-bold text-primary">Quản lý đơn hàng</h2>
                  <p className="text-muted mb-0">Tổng cộng {filteredOrders.length} đơn hàng</p>
                </div>
                <Badge bg="info" className="fs-6 px-3 py-2">
                  Đơn hàng mới nhất trước
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select value={filterStatus} onChange={handleFilterChange}>
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="outline-primary" className="w-100" onClick={() => window.location.reload()}>
            Làm mới
          </Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Đang tải đơn hàng...</p>
                </div>
              ) : currentOrders.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 fw-semibold">#</th>
                        <th className="border-0 fw-semibold">Khách hàng</th>
                        <th className="border-0 fw-semibold">Mã đơn hàng</th>
                        <th className="border-0 fw-semibold">Thời gian đặt</th>
                        <th className="border-0 fw-semibold">Trạng thái</th>
                        <th className="border-0 fw-semibold">Giao hàng</th>
                        <th className="border-0 fw-semibold">Tổng tiền</th>
                        <th className="border-0 fw-semibold">Thanh toán</th>
                        <th className="border-0 fw-semibold">Người xác nhận</th>
                        <th className="border-0 fw-semibold text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order, index) => {
                        const orderDateTime = formatDateTime(order.order_date)
                        const deliveryDateTime = formatDateTime(order.delivery_date)

                        return (
                          <tr key={order._id}>
                            <td className="align-middle">
                              <Badge bg="secondary" pill>
                                {indexOfFirstOrder + index + 1}
                              </Badge>
                            </td>
                            <td className="align-middle">
                              <div>
                                <div className="fw-semibold">{order.userName}</div>
                              </div>
                              
                            </td>
                            <td className="align-middle">
                              <div>
                                
                                <div className="text-muted">{order.order_code}</div>
                              </div>
                              
                            </td>
                            <td className="align-middle">
                              <div>
                                <div className="fw-semibold">{orderDateTime.date}</div>
                                <small className="text-muted">{orderDateTime.time}</small>
                                <div>
                                  <Badge bg="light" text="dark" className="mt-1">
                                    {getTimeAgo(order.order_date)}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle">
                              <Form.Select
                                size="sm"
                                value={order.order_status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                disabled={!order.accepted_by}
                                className="w-auto"
                              >
                                {getAvailableStatusOptions(order.order_status).map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </Form.Select>
                              
                            </td>
                            
                            <td className="align-middle">
                              <div>
                                <div className="fw-semibold">{deliveryDateTime.date}</div>
                                <small className="text-muted">{deliveryDateTime.time}</small>
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="fw-bold text-success">
                                {order.total_amount?.toLocaleString("vi-VN")} 
                              </div>
                            </td>
                            <td className="align-middle">
                              <Badge
                                bg={order.payment_status === "Đã thanh toán" ? "success" : "warning"}
                                text={order.payment_status === "Đã thanh toán" ? "white" : "dark"}
                              >
                                {order.payment_status}
                              </Badge>
                            </td>
                            <td className="align-middle">
                              <div>
                                {order.accepted_by ? (
                                  <>
                                    <FaUser className="text-success me-1" />
                                    <span className="small text-success fw-semibold">{order.accepted_by}</span>
                                  </>
                                ) : (
                                  <Badge bg="secondary">Chưa xác nhận</Badge>
                                )}
                              </div>
                            </td>
                            <td className="align-middle text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleView(order)}
                                  title="Xem chi tiết"
                                >
                                  <FaEye />
                                </Button>
                                {!order.accepted_by && (
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleConfirmOrder(order._id)}
                                    title="Xác nhận đơn hàng"
                                  >
                                    <FaCheck />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <Alert variant="info" className="d-inline-block">
                    <FaSearch className="me-2" />
                    Không tìm thấy đơn hàng nào phù hợp
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />

              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = index + 1
                } else if (currentPage <= 3) {
                  pageNumber = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index
                } else {
                  pageNumber = currentPage - 2 + index
                }

                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                )
              })}

              <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
              <Pagination.Last disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* Order Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaEye className="me-2" />
            Chi tiết đơn hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Row>
              <Col md={6}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Header className="bg-info text-white">
                    <FaUser className="me-2" />
                    Thông tin khách hàng
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Khách hàng:</strong> {selectedOrder.userName}
                    </p>
                    <p>
                      <strong>Mã đơn hàng:</strong>
                      <Badge bg="secondary" className="ms-2">
                        {selectedOrder.order_code}
                      </Badge>
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>
                      <Badge bg={statusVariants[selectedOrder.order_status]} className="ms-2">
                        {selectedOrder.order_status}
                      </Badge>
                    </p>
                    <p>
                      <strong>Ghi chú:</strong> {selectedOrder.order_note || "Không có"}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Header className="bg-warning text-dark">
                    <FaMapMarkerAlt className="me-2" />
                    Thông tin vận chuyển
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Địa chỉ:</strong> {selectedOrder.address_shipping}
                    </p>
                    <p>
                      <strong>Ngày đặt:</strong> {formatDateTime(selectedOrder.order_date).date}
                    </p>
                    <p>
                      <strong>Giờ đặt:</strong> {formatDateTime(selectedOrder.order_date).time}
                    </p>
                    <p>
                      <strong>Giao hàng dự kiến:</strong> {formatDateTime(selectedOrder.delivery_date).date}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} className="mt-3">
                <Card className="border-0 bg-light">
                  <Card.Header className="bg-success text-white">
                    <FaCheck className="me-2" />
                    Thông tin xử lý
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Người xác nhận:</strong>
                          <span className={selectedOrder.accepted_by ? "text-success ms-2" : "text-muted ms-2"}>
                            {selectedOrder.accepted_by || "Chưa xác nhận"}
                          </span>
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong>
                          <span className="text-success fw-bold ms-2">
                            {selectedOrder.total_amount?.toLocaleString("vi-VN")} ₫
                          </span>
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Thanh toán:</strong>
                          <Badge
                            bg={selectedOrder.payment_status === "Đã thanh toán" ? "success" : "warning"}
                            className="ms-2"
                          >
                            {selectedOrder.payment_status}
                          </Badge>
                        </p>
                        <p>
                          <strong>Cập nhật lần cuối:</strong> {formatDateTime(selectedOrder.update_at).date}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default OrderList

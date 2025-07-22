"use client"

import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert,
  Pagination,
  Button,
  Image,
} from "react-bootstrap"
import { fetchInventory, fetchStatus } from "../../API/inventoryApi"
import { FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown, FaBox } from "react-icons/fa"

const InventoryList = () => {
  const [inventory, setInventory] = useState([])
  const [statusList, setStatusList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("Tất cả")
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const getData = async () => {
      try {
        const [inventoryRes, statusRes] = await Promise.all([fetchInventory(), fetchStatus()])

        if (inventoryRes.message === "Danh sách tồn kho" && Array.isArray(inventoryRes.data)) {
          setInventory(inventoryRes.data)
        } else {
          setError("Dữ liệu tồn kho không đúng định dạng")
        }

        if (statusRes.message === "Danh sách trạng thái" && Array.isArray(statusRes.data)) {
          setStatusList(statusRes.data)
        } else {
          setError("Dữ liệu trạng thái không đúng định dạng")
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const filteredInventory = inventory.filter(
    (item) =>
      (filterStatus === "Tất cả" || item.product_detail_status === filterStatus) &&
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    return sortOrder === "asc" ? a.inventory_number - b.inventory_number : b.inventory_number - a.inventory_number
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedInventory.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage)

  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc")

  const getStatusVariant = (status) => {
    if (status === "Hàng mới về") return "success"
    if (status === "Sắp hết hàng") return "warning"
    if (status === "Hết hàng") return "danger"
    return "secondary"
  }

  const getSortIcon = () => {
    if (sortOrder === "asc") return <FaSortUp />
    return <FaSortDown />
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Đang tải dữ liệu tồn kho...</p>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          <strong>Lỗi:</strong> {error}
        </Alert>
      </Container>
    )
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
                  <h2 className="mb-1 fw-bold text-primary d-flex align-items-center">
                    <FaBox className="me-2" />
                    Danh sách tồn kho
                  </h2>
                  <p className="text-muted mb-0">Quản lý tồn kho sản phẩm</p>
                </div>
                <Badge bg="info" className="fs-6 px-3 py-2">
                  {filteredInventory.length} sản phẩm
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaFilter />
            </InputGroup.Text>
            <Form.Select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              {statusList.map((status) => (
                <option key={status._id} value={status.productdetail_status_name}>
                  {status.productdetail_status_name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Button variant="outline-primary" onClick={toggleSortOrder} className="w-100">
            <FaSort className="me-2" />
            Sắp xếp số lượng {getSortIcon()}
          </Button>
        </Col>
      </Row>

      {/* Inventory Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {currentItems.length === 0 ? (
                <div className="text-center py-5">
                  <Alert variant="info" className="d-inline-block">
                    <FaSearch className="me-2" />
                    Không có sản phẩm phù hợp
                  </Alert>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 fw-semibold text-center">Ảnh</th>
                        <th className="border-0 fw-semibold">Tên sản phẩm</th>
                        <th className="border-0 fw-semibold text-center">
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none fw-semibold"
                            onClick={toggleSortOrder}
                          >
                            Số lượng tồn {getSortIcon()}
                          </Button>
                        </th>
                        <th className="border-0 fw-semibold text-center">Giá sau giảm</th>
                        <th className="border-0 fw-semibold text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.productDetailId}>
                          <td className="align-middle text-center">
                            <Image
                              src={item.images[0] || "/placeholder.svg?height=60&width=60"}
                              alt={item.productName}
                              width={60}
                              height={60}
                              className="rounded border"
                              style={{ objectFit: "cover" }}
                            />
                          </td>
                          <td className="align-middle">
                            <div>
                              <div className="fw-semibold">{item.productName}</div>
                              <small className="text-muted">ID: {item.productDetailId}</small>
                            </div>
                          </td>
                          <td className="align-middle text-center">
                            <Badge
                              bg={
                                item.inventory_number > 50
                                  ? "success"
                                  : item.inventory_number > 10
                                    ? "warning"
                                    : "danger"
                              }
                              className="fs-6 px-3 py-2"
                            >
                              {item.inventory_number}
                            </Badge>
                          </td>
                          <td className="align-middle text-center">
                            <div className="fw-bold text-success">
                              {item.price_after_discount?.toLocaleString("vi-VN")} ₫
                            </div>
                          </td>
                          <td className="align-middle text-center">
                            <Badge bg={getStatusVariant(item.product_detail_status)} className="px-3 py-2">
                              {item.product_detail_status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
    </Container>
  )
}

export default InventoryList

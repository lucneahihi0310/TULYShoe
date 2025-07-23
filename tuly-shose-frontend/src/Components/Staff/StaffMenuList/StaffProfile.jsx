"use client"

import { useEffect, useState, useContext } from "react"
import { Container, Row, Col, Card, Form, Button, Image, Tabs, Tab, Spinner, Alert } from "react-bootstrap"
import { AuthContext } from "../../API/AuthContext"
import Swal from "sweetalert2"
import { FaUser, FaLock, FaCamera, FaEdit, FaSave } from "react-icons/fa"
import {
  fetchStaffProfile,
  updateStaffProfile,
  changeStaffPassword,
  updateShippingAddress,
  uploadImage,
} from "../../API/staffApi"

const StaffProfile = () => {
  const { user } = useContext(AuthContext)
  const staffId = user?._id
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    address_id: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const isFormChanged = () => {
    if (!staff) return false
    const [first_name, ...rest] = form.fullName.trim().split(" ")
    const last_name = rest.join(" ")
    return (
      first_name !== staff.first_name ||
      last_name !== staff.last_name ||
      form.phone !== staff.phone ||
      form.gender !== staff.gender ||
      form.dob !== (staff.dob ? staff.dob.substring(0, 10) : "") ||
      form.address !== staff.address ||
      selectedFile !== null
    )
  }

  useEffect(() => {
    if (staffId) loadProfile()
  }, [staffId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await fetchStaffProfile(staffId)
      setStaff(res)
      setForm({
        fullName: `${res.first_name} ${res.last_name}`,
        username: res.first_name.toLowerCase() + res.last_name.toLowerCase(),
        email: res.email,
        phone: res.phone,
        gender: res.gender,
        dob: res.dob ? res.dob.substring(0, 10) : "",
        address: res.address || "",
        address_id: res.address_id || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      Swal.fire("Error", "Failed to load profile.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdateInfo = async () => {
    if (!isFormChanged()) {
      return Swal.fire({
        icon: "info",
        title: "Không có thay đổi",
        text: "Vui lòng cập nhật thông tin trước khi lưu!",
      })
    }

    const confirmResult = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn cập nhật thông tin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    })

    if (confirmResult.isConfirmed) {
      try {
        const [first_name, ...rest] = form.fullName.trim().split(" ")
        const last_name = rest.join(" ")
        let avatarUrl = staff.avatar_image

        if (selectedFile) {
          avatarUrl = await uploadImage(selectedFile)
        }

        await updateStaffProfile(staffId, {
          first_name,
          last_name,
          phone: form.phone,
          dob: form.dob,
          gender: form.gender,
          avatar_image: avatarUrl,
        })

        await updateShippingAddress(staff.address_id, form.address)

        await Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          showConfirmButton: false,
          timer: 1500,
        })

        loadProfile()
        setSelectedFile(null)
        setSelectedImage(null)
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại!",
          text: error.message || "Vui lòng thử lại.",
        })
      }
    }
  }

  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return Swal.fire("Error", "Mật khẩu mới không trùng với mật khẩu xác nhận.", "error")
    }

    try {
      await changeStaffPassword(staffId, form.oldPassword, form.newPassword)
      Swal.fire("Success", "Thay đổi mật khẩu thành công.", "success")
      setForm({ ...form, oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      Swal.fire("Error", "Cập nhật mật khẩu thất bại.", "error")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        Swal.fire("Error", "Kích thước file không được vượt quá 1MB", "error")
        return
      }
      setSelectedImage(URL.createObjectURL(file))
      setSelectedFile(file)
    }
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải thông tin...</p>
        </div>
      </Container>
    )
  }

  if (!staff) return <Alert variant="danger">Không thể tải thông tin người dùng</Alert>

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Row>
            {/* Profile Card */}
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="position-relative d-inline-block mb-3">
                    <Image
                      src={selectedImage || staff.avatar_image || "/placeholder.svg?height=120&width=120"}
                      roundedCircle
                      width={120}
                      height={120}
                      className="border border-3 border-light shadow-sm"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: "35px", height: "35px" }}
                      onClick={() => document.getElementById("upload-photo").click()}
                    >
                      <FaCamera />
                    </Button>
                    <input
                      type="file"
                      id="upload-photo"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </div>
                  <h4 className="mb-1">{form.fullName}</h4>
                  <p className="text-muted mb-3">@{form.username}</p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => document.getElementById("upload-photo").click()}
                  >
                    <FaCamera className="me-2" />
                    Đổi ảnh đại diện
                  </Button>
                  <Alert variant="info" className="mt-3 small">
                    <strong>Lưu ý:</strong> Kích thước tối đa 1MB. Ảnh sẽ được tự động resize.
                  </Alert>
                </Card.Body>
              </Card>
            </Col>

            {/* Form Card */}
            <Col md={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h4 className="mb-0 text-primary">
                    <FaEdit className="me-2" />
                    Cập nhật thông tin
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Tabs defaultActiveKey="personal" className="mb-4">
                    <Tab
                      eventKey="personal"
                      title={
                        <span>
                          <FaUser className="me-2" />
                          Thông tin cá nhân
                        </span>
                      }
                    >
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Họ và Tên</Form.Label>
                            <Form.Control
                              type="text"
                              name="fullName"
                              value={form.fullName}
                              onChange={handleInputChange}
                              placeholder="Nhập họ và tên"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Username</Form.Label>
                            <Form.Control type="text" name="username" value={form.username} disabled />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} disabled />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={form.phone}
                              onChange={handleInputChange}
                              placeholder="Nhập số điện thoại"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Giới tính</Form.Label>
                            <Form.Select
                              name="gender"
                              value={form.gender}
                              onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                              <option value="">Chọn giới tính</option>
                              <option value="Male">Nam</option>
                              <option value="Female">Nữ</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
                            <Form.Control type="date" name="dob" value={form.dob} onChange={handleInputChange} />
                          </Form.Group>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Địa chỉ</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="address"
                              value={form.address}
                              onChange={handleInputChange}
                              placeholder="Nhập địa chỉ"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button variant="primary" onClick={handleUpdateInfo} disabled={!isFormChanged()}>
                        <FaSave className="me-2" />
                        Cập nhật thông tin
                      </Button>
                    </Tab>

                    <Tab
                      eventKey="password"
                      title={
                        <span>
                          <FaLock className="me-2" />
                          Đổi mật khẩu
                        </span>
                      }
                    >
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Mật khẩu cũ</Form.Label>
                            <Form.Control
                              type="password"
                              name="oldPassword"
                              value={form.oldPassword}
                              onChange={handleInputChange}
                              placeholder="Nhập mật khẩu cũ"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
                            <Form.Control
                              type="password"
                              name="newPassword"
                              value={form.newPassword}
                              onChange={handleInputChange}
                              placeholder="Nhập mật khẩu mới"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label className="fw-semibold">Xác nhận mật khẩu</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Xác nhận mật khẩu mới"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        variant="danger"
                        onClick={handleChangePassword}
                        disabled={!form.oldPassword || !form.newPassword || !form.confirmPassword}
                      >
                        <FaLock className="me-2" />
                        Thay đổi mật khẩu
                      </Button>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default StaffProfile

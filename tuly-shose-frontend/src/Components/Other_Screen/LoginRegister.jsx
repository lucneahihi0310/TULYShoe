import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../CSS/LoginRegister.css";

const LoginRegister = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", message: "" });
  const [resetValidationErrors, setResetValidationErrors] = useState({});

  const navigate = useNavigate();
  const API_URL = "http://localhost:9999/account";

  useEffect(() => {
    // Kiểm tra token trong localStorage và xóa nếu đã hết hạn
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");
    if (token && expiresAt) {
      const currentTime = Date.now();
      if (currentTime > parseInt(expiresAt)) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
        window.dispatchEvent(
          new StorageEvent("storage", { key: "token", newValue: null })
        );
      }
    }
    if (token && !expiresAt) {
      // Nếu token tồn tại nhưng không có expires_at (trường hợp cũ), xóa token
      localStorage.removeItem("token");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "token", newValue: null })
      );
    }
    if (token && expiresAt && parseInt(expiresAt) > Date.now()) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (remember) {
          const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
          console.log(
            "expires_at:",
            expiresAt,
            new Date(expiresAt).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })
          );
          localStorage.setItem("token", data.token);
          localStorage.setItem("expires_at", expiresAt.toString());
        } else {
          // Lưu vào sessionStorage
          sessionStorage.setItem("token", data.token);
          localStorage.removeItem("token");
          localStorage.removeItem("expires_at");
        }
        window.dispatchEvent(
          new StorageEvent("storage", { key: "token", newValue: data.token })
        );
        navigate("/");
      } else {
        setErrorMessage(data.message || "Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFields = async () => {
    const validationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0\d{9,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const today = new Date();

    if (!first_name) validationErrors.first_name = "Họ không được để trống!";
    if (!last_name) validationErrors.last_name = "Tên không được để trống!";
    if (!gender) validationErrors.gender = "Giới tính không được để trống!";
    if (!address) validationErrors.address = "Địa chỉ không được để trống!";

    if (!email) {
      validationErrors.email = "Email không được để trống!";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Định dạng email không hợp lệ!";
    }

    if (!phone) {
      validationErrors.phone = "Số điện thoại không được để trống!";
    } else if (!phoneRegex.test(phone)) {
      validationErrors.phone = "Định dạng số điện thoại không hợp lệ!";
    }

    if (!dob) {
      validationErrors.dob = "Ngày sinh không được để trống!";
    } else if (new Date(dob) > today) {
      validationErrors.dob = "Ngày sinh không được là ngày tương lai!";
    }

    if (!password) {
      validationErrors.password = "Mật khẩu không được để trống!";
    } else if (!passwordRegex.test(password)) {
      validationErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số!";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Vui lòng xác nhận mật khẩu!";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    setValidationErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const isValid = await validateFields();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    const data = {
      first_name,
      last_name,
      email,
      password,
      phone,
      dob,
      gender,
      address,
    };

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
        setCurrentForm("login");
      } else {
        setErrorMessage(responseData.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateResetPassword = () => {
    const resetValidationErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!resetToken) {
      resetValidationErrors.resetToken = "Mã đặt lại không được để trống!";
    }

    if (!newPassword) {
      resetValidationErrors.newPassword = "Mật khẩu mới không được để trống!";
    } else if (!passwordRegex.test(newPassword)) {
      resetValidationErrors.newPassword =
        "Mật khẩu mới phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số!";
    }

    if (!confirmNewPassword) {
      resetValidationErrors.confirmNewPassword =
        "Vui lòng xác nhận mật khẩu mới!";
    } else if (newPassword !== confirmNewPassword) {
      resetValidationErrors.confirmNewPassword =
        "Mật khẩu xác nhận không khớp!";
    }

    setResetValidationErrors(resetValidationErrors);
    return Object.keys(resetValidationErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Email không được để trống!");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (response.ok) {
        setPopupContent({
          title: "Yêu cầu thành công",
          message: data.message || "Yêu cầu đặt lại mật khẩu đã được gửi.",
        });
        setPopupVisible(true);
        setCurrentForm("resetPassword");
      } else {
        setErrorMessage(
          data.message || "Lỗi khi gửi yêu cầu đặt lại mật khẩu!"
        );
      }
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const isValid = validateResetPassword();
    if (!isValid) return;

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          resetToken: resetToken.toUpperCase(),
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPopupContent({
          title: "Đổi mật khẩu thành công",
          message: data.message || "Mật khẩu đã được thay đổi thành công.",
        });
        setPopupVisible(true);
        setCurrentForm("login");
      } else {
        setErrorMessage(data.message || "Lỗi khi đổi mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setFirst_name("");
    setLast_name("");
    setPhone("");
    setDob("");
    setGender("");
    setAddress("");
    setConfirmPassword("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrorMessage("");
    setValidationErrors({});
    setCurrentForm("login");
  };

  return (
    <div className="login-register-container">
      <Card className="text-center border-0">
        <Card.Body>
          <div className="tabs mb-4">
            <Button
              variant="outline-danger"
              className={`me-2 ${currentForm === "login" ? "active-tab" : ""}`}
              onClick={() => setCurrentForm("login")}
            >
              <i className="bi bi-box-arrow-in-right"> Đăng nhập</i>
            </Button>
            <Button
              variant="outline-warning"
              className={currentForm === "register" ? "active-tab" : ""}
              onClick={() => setCurrentForm("register")}
            >
              <i className="bi bi-person-plus-fill"> Đăng ký</i>
            </Button>
          </div>

          <div className="form-container">
            {currentForm === "login" && (
              <Form onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                  />
                </InputGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Form.Group
                  className="mb-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                >
                  <Form.Check.Input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{ marginRight: "10px" }}
                  />
                  <Form.Check.Label htmlFor="remember">
                    Ghi nhớ
                  </Form.Check.Label>
                </Form.Group>

                <div className="forgot-password">
                  <Button
                    style={{
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentForm("forgotPassword")}
                  >
                    <i className="bi bi-question-circle"> Quên mật khẩu?</i>
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="btn-danger w-100"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-box-arrow-in-right"> Đăng nhập</i>
                </Button>
              </Form>
            )}

            {currentForm === "register" && (
              <Form onSubmit={handleRegister}>
                <h2>Đăng ký</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Họ"
                    value={first_name}
                    onChange={(e) => {
                      setFirst_name(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        first_name: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.first_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.first_name}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Tên"
                    value={last_name}
                    onChange={(e) => {
                      setLast_name(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        last_name: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.last_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.last_name}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-house"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Địa chỉ"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        address: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.address}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="* Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Mật khẩu"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        password: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        confirmPassword: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-telephone-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Số điện thoại"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        phone: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.phone}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-calendar-date"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    placeholder="* Ngày sinh"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        dob: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.dob}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.dob}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-gender-ambiguous"></i>
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        gender: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.gender}
                  >
                    <option value="">* Giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.gender}
                  </Form.Control.Feedback>
                </InputGroup>

                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <Button
                  style={{ marginBottom: "5px" }}
                  variant="secondary"
                  onClick={handleCancel}
                >
                  <i className="bi bi-x-circle"> Hủy</i>
                </Button>
                <Button
                  type="submit"
                  className="btn-warning w-100"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-person-plus-fill"> Đăng ký</i>
                </Button>
              </Form>
            )}
            <Modal
              show={showSuccessModal}
              onHide={() => setShowSuccessModal(false)}
              backdrop="static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Tạo tài khoản thành công</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập
                  để trải nghiệm!
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Đóng
                </Button>
              </Modal.Footer>
            </Modal>
            {currentForm === "forgotPassword" && (
              <Form onSubmit={handleForgotPassword}>
                {errorMessage && (
                  <div className="text-danger">{errorMessage}</div>
                )}
                <h2 className="mb-4">Quên mật khẩu</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      setErrorMessage("");
                    }}
                    placeholder="Nhập email"
                    required
                  />
                </InputGroup>
                <Button
                  style={{ marginBottom: "5px" }}
                  disabled={isSubmitting}
                  variant="secondary"
                  onClick={handleCancel}
                >
                  <i className="bi bi-x-circle"> Hủy</i>
                </Button>
                <Button
                  variant="primary"
                  disabled={isSubmitting}
                  type="submit"
                  className="w-100"
                >
                  <i className="bi bi-send"> Gửi yêu cầu đặt lại mật khẩu</i>
                </Button>
              </Form>
            )}
            {currentForm === "resetPassword" && (
              <Form onSubmit={handleResetPassword}>
                {errorMessage && (
                  <div className="text-danger">{errorMessage}</div>
                )}
                <h2 className="mb-4">Đặt lại mật khẩu</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-check2-circle"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={resetToken}
                    onChange={(e) => {
                      setResetToken(e.target.value.toUpperCase());
                      setErrorMessage("");
                      setResetValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        resetToken: "",
                      }));
                    }}
                    placeholder="Nhập mã đặt lại"
                    isInvalid={!!resetValidationErrors.resetToken}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetValidationErrors.resetToken}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-key"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMessage("");
                      setResetValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        newPassword: "",
                      }));
                    }}
                    placeholder="Nhập mật khẩu mới"
                    isInvalid={!!resetValidationErrors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetValidationErrors.newPassword}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setErrorMessage("");
                      setResetValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        confirmNewPassword: "",
                      }));
                    }}
                    placeholder="Xác nhận mật khẩu mới"
                    isInvalid={!!resetValidationErrors.confirmNewPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetValidationErrors.confirmNewPassword}
                  </Form.Control.Feedback>
                </InputGroup>
                <Button
                  style={{ marginBottom: "5px" }}
                  variant="secondary"
                  onClick={handleCancel}
                >
                  <i className="bi bi-x-circle"> Hủy</i>
                </Button>
                <Button variant="primary" type="submit" className="w-100">
                  <i className="bi bi-check-circle"> Đặt lại mật khẩu</i>
                </Button>
              </Form>
            )}
          </div>
        </Card.Body>
      </Card>
      <Modal show={popupVisible} onHide={() => setPopupVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{popupContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{popupContent.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setPopupVisible(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginRegister;

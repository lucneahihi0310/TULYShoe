import React, { useEffect, useState, useContext } from "react";
import { Card, Avatar, Button, Input, Tabs, Row, Col, Select } from "antd";
import { AuthContext } from "../../API/AuthContext";
import Swal from "sweetalert2";
import { fetchStaffProfile, updateStaffProfile, changeStaffPassword, updateShippingAddress, uploadImage } from "../../API/staffApi";

const { TabPane } = Tabs;

const StaffProfile = () => {
  const { user } = useContext(AuthContext);
  const staffId = user?._id;

  const [staff, setStaff] = useState(null);
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
  });
  const { Option } = Select;

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const isFormChanged = () => {
    const [first_name, ...rest] = form.fullName.trim().split(" ");
    const last_name = rest.join(" ");
    return (
      first_name !== staff.first_name ||
      last_name !== staff.last_name ||
      form.phone !== staff.phone ||
      form.gender !== staff.gender ||
      form.dob !== (staff.dob ? staff.dob.substring(0, 10) : "") ||
      form.address !== staff.address ||
      selectedFile !== null
    );
  };

  useEffect(() => {
    if (staffId) loadProfile();
  }, [staffId]);

  const loadProfile = async () => {
    try {
      const res = await fetchStaffProfile(staffId);
      setStaff(res);
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
      });
    } catch (error) {
      Swal.fire("Error", "Failed to load profile.", "error");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateInfo = async () => {
    if (!isFormChanged()) {
      return Swal.fire({
        icon: 'info',
        title: 'Không có thay đổi',
        text: 'Vui lòng cập nhật thông tin trước khi lưu!',
      });
    }

    const confirmResult = await Swal.fire({
      title: 'Bạn có chắc chắn muốn cập nhật không?',
      text: 'Thao tác này sẽ thay đổi thông tin cá nhân của bạn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Huỷ',

    });

    if (confirmResult.isConfirmed) {
      try {
        const [first_name, ...rest] = form.fullName.trim().split(" ");
        const last_name = rest.join(" ");

        let avatarUrl = staff.avatar_image;
        if (selectedFile) {
          avatarUrl = await uploadImage(selectedFile);
        }

        await updateStaffProfile(staffId, {
          first_name,
          last_name,
          phone: form.phone,
          dob: form.dob,
          gender: form.gender,
          avatar_image: avatarUrl,
        });

        await updateShippingAddress(staff.address_id, form.address);

        await Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          showConfirmButton: false,
          timer: 1500,
        });

        loadProfile();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại!',
          text: error.message || 'Vui lòng thử lại.',
        });
      }
    }
  };



  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return Swal.fire("Error", "Mật khẩu mới không trùng với mật khẩu xác nhận.", "error");
    }

    try {
      await changeStaffPassword(staffId, form.oldPassword, form.newPassword);
      Swal.fire("Success", "Thay đổi mật khẩu thành công.", "success");
      setForm({ ...form, oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire("Error", "Cập nhật mật khẩu thất bại.", "error");
    }
  };

  if (!staff) return <p>Loading...</p>;

  return (
    <div
      style={{

        background: "#f0f2f5",
        minHeight: "100vh",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Row gutter={32} style={{ padding: "20px" }}>
          <Col xs={24} md={8}>
            <Card style={{ borderRadius: 12, textAlign: "center", paddingTop: 24 }}>
              <Avatar size={100} src={selectedImage || staff.avatar_image} />
              <h2 style={{ marginTop: 16 }}>{form.fullName}</h2>
              <p>@{form.username}</p>
              <Button
                type="primary"
                style={{ marginTop: 12, backgroundColor: "#ff4d4f" }}
                onClick={() => document.getElementById('upload-photo').click()}
              >
                Chọn Ảnh Mới
              </Button>

              <input
                type="file"
                id="upload-photo"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedImage(URL.createObjectURL(file)); // Xem trước ảnh
                    setSelectedFile(file); // Lưu file để upload
                  }
                }}
              />


              <label htmlFor="upload-photo">

              </label>

              <p style={{ marginTop: 12, fontSize: 12 }}>
                Tải lên ảnh đại diện mới. Ảnh lớn hơn sẽ tự động được thay đổi kích thước.
                <br />

                Kích thước tải lên tối đa là <strong>1 MB</strong>
              </p>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card style={{ borderRadius: 12 }}>
              <h2>Cập nhật thông tin</h2>
              <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
                <TabPane tab="Thông tin cá nhân" key="1">
                  <Row gutter={16}>
                    <Col span={12}>
                      <label>Họ và Tên</label>
                      <Input name="fullName" value={form.fullName} onChange={handleInputChange} />
                    </Col>
                    <Col span={12}>
                      <label>Username</label>
                      <Input name="username" value={form.username} disabled />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Email </label>
                      <Input name="email" value={form.email} disabled />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Số điện thoại</label>
                      <Input name="phone" value={form.phone} onChange={handleInputChange} />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Giới tính</label>
                      <Select
                        name="gender"
                        value={form.gender}
                        onChange={(value) => setForm({ ...form, gender: value })}
                        style={{ width: '100%' }}
                      >
                        <Option value="Male">Nam</Option>
                        <Option value="Female">Nữ</Option>
                      </Select>
                    </Col>


                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Ngày sinh</label>
                      <Input name="dob" type="date" value={form.dob} onChange={handleInputChange} />
                    </Col>

                    <Col span={24} style={{ marginTop: 16 }}>
                      <label>Địa chỉ</label>
                      <Input name="address" value={form.address} onChange={handleInputChange} />
                    </Col>
                  </Row>

                  <Button
                    type="primary"
                    style={{ marginTop: 24, backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                    onClick={handleUpdateInfo}
                  >
                    Cập nhật thông tin
                  </Button>
                </TabPane>

                <TabPane tab="Thay đổi mật khẩu" key="2">
                  <Row gutter={16}>
                    <Col span={12}>
                      <label>Mật khẩu cũ</label>
                      <Input.Password name="oldPassword" value={form.oldPassword} onChange={handleInputChange} />
                    </Col>
                    <Col span={12}>
                      <label>Mật khẩu mới</label>
                      <Input.Password name="newPassword" value={form.newPassword} onChange={handleInputChange} />
                    </Col>
                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Xác nhận mật khẩu</label>
                      <Input.Password name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    style={{ marginTop: 24, backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                    onClick={handleChangePassword}
                  >
                    Thay đổi mật khẩu
                  </Button>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StaffProfile;

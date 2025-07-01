import React, { useEffect, useState, useContext } from "react";
import { Card, Avatar, Button, Input, Tabs, Row, Col } from "antd";
import { AuthContext } from "../../API/AuthContext";
import Swal from "sweetalert2";
import { fetchStaffProfile, updateStaffProfile, changeStaffPassword, updateShippingAddress } from "../../API/staffApi";

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
    address_id: "", // Thêm address_id
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        address_id: res.address_id || "", // Gán địa chỉ ID vào form
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
  const confirmResult = await Swal.fire({
    title: 'Bạn có chắc chắn muốn cập nhật không?',
    text: "Thao tác này sẽ thay đổi thông tin cá nhân của bạn!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Có, cập nhật!',
    cancelButtonText: 'Hủy'
  });

  if (confirmResult.isConfirmed) {
    try {
      const [first_name, ...rest] = form.fullName.trim().split(" ");
      const last_name = rest.join(" ");

      // Cập nhật thông tin cá nhân
      await updateStaffProfile(staffId, {
        first_name,
        last_name,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        avatar_image: staff.avatar_image,
      });

      // Cập nhật địa chỉ
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
      return Swal.fire("Error", "New passwords do not match.", "error");
    }

    try {
      await changeStaffPassword(staffId, form.oldPassword, form.newPassword);
      Swal.fire("Success", "Password changed successfully.", "success");
      setForm({ ...form, oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire("Error", "Failed to change password.", "error");
    }
  };

  if (!staff) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
              <Avatar size={100} src={staff.avatar_image} />
              <h2 style={{ marginTop: 16 }}>{form.fullName}</h2>
              <p>@{form.username}</p>
              <Button type="primary" style={{ marginTop: 12, backgroundColor: "#ff4d4f" }}>
                Upload New Photo
              </Button>
              <p style={{ marginTop: 12, fontSize: 12 }}>
                Upload a new avatar. Larger image will be resized automatically.
                <br />
                Maximum upload size is <strong>1 MB</strong>
              </p>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card style={{ borderRadius: 12 }}>
              <h2>Edit Profile</h2>
              <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
                <TabPane tab="User Info" key="1">
                  <Row gutter={16}>
                    <Col span={12}>
                      <label>Full Name</label>
                      <Input name="fullName" value={form.fullName} onChange={handleInputChange} />
                    </Col>
                    <Col span={12}>
                      <label>Username</label>
                      <Input name="username" value={form.username} disabled />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Email Address</label>
                      <Input name="email" value={form.email} disabled />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Phone</label>
                      <Input name="phone" value={form.phone} onChange={handleInputChange} />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Gender</label>
                      <Input name="gender" value={form.gender} onChange={handleInputChange} />
                    </Col>

                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Date of Birth</label>
                      <Input name="dob" type="date" value={form.dob} onChange={handleInputChange} />
                    </Col>

                    <Col span={24} style={{ marginTop: 16 }}>
                      <label>Address</label>
                      <Input name="address" value={form.address} onChange={handleInputChange} />
                    </Col>
                  </Row>

                  <Button
                    type="primary"
                    style={{ marginTop: 24, backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                    onClick={handleUpdateInfo}
                  >
                    Update Info
                  </Button>
                </TabPane>

                <TabPane tab="Change Password" key="2">
                  <Row gutter={16}>
                    <Col span={12}>
                      <label>Old Password</label>
                      <Input.Password name="oldPassword" value={form.oldPassword} onChange={handleInputChange} />
                    </Col>
                    <Col span={12}>
                      <label>New Password</label>
                      <Input.Password name="newPassword" value={form.newPassword} onChange={handleInputChange} />
                    </Col>
                    <Col span={12} style={{ marginTop: 16 }}>
                      <label>Confirm New Password</label>
                      <Input.Password name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    style={{ marginTop: 24, backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                    onClick={handleChangePassword}
                  >
                    Change Password
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

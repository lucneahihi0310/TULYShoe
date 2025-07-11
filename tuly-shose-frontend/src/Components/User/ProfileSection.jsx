import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Typography,
  Image,
  Radio,
  Spin,
  Upload,
  message,
} from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import { fetchData, updateData, uploadAvatar } from "../API/ApiService";

const { Title } = Typography;

const ProfileSection = ({
  user,
  avatar,
  setAvatar,
  setIsPasswordModalVisible,
  isPasswordModalVisible,
}) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchUserInfo = async () => {
    try {
      const data = await fetchData("/account/info", true);
      form.setFieldsValue({
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        dob: data.dob?.split("T")[0],
        gender: data.gender,
      });
      setAvatar(data.avatar_image);
    } catch (err) {
      message.error("Không thể tải thông tin người dùng." + err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const handleUploadAvatar = async (info) => {
    const file = info.file;

    if (!file) {
      message.error("Không tìm thấy file");
      return;
    }

    setAvatarLoading(true);
    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await uploadAvatar(formData);
      setAvatar(result.avatar);
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      message.error("Upload ảnh thất bại: " + err.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleProfileSubmit = async (values) => {
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        dob: values.dob,
        gender: values.gender,
        address: values.address,
        email: values.email,
      };

      await updateData("/account/profile", "", payload, true);
      message.success("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      message.error("Cập nhật thông tin thất bại." + err.message);
    }
  };

  const handlePasswordSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      await updateData(
        "/account/change-password-user",
        "",
        {
          current_password: values.currentPassword,
          new_password: values.newPassword,
        },
        true
      );

      message.success("Mật khẩu đã được thay đổi thành công!");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (err) {
      message.error("Đổi mật khẩu thất bại: " + err.message);
    }
  };

  return (
    <div>
      <Title level={2} className={styles.title}>
        Thông tin cá nhân
      </Title>
      <div className={styles.profileContainer}>
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          {avatarLoading ? (
            <div className={styles.avatarLoading}>
              <Spin size="large" />
            </div>
          ) : (
            <Image
              src={previewImage || avatar}
              alt="Ảnh đại diện"
              className={styles.avatar}
              width={176}
              height={176}
            />
          )}
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={(info) => {
              handleUploadAvatar(info);
            }}
            className={styles.avatarUpload}
          >
            <Button
              icon={<CameraOutlined />}
              className={styles.avatarUploadBtn}
            >
              Tải ảnh mới
            </Button>
          </Upload>
        </div>

        {/* Form thông tin cá nhân */}
        <Form
          form={form}
          onFinish={handleProfileSubmit}
          className={styles.profileForm}
          layout="vertical"
        >
          <div className={styles.formGrid}>
            <Form.Item
              name="firstName"
              label="Họ"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính">
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
                <Radio value="Khác">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className={styles.formButtons}>
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
            <Button onClick={() => setIsPasswordModalVisible(true)}>
              Thay đổi mật khẩu
            </Button>
          </div>
        </Form>
      </div>

      <Modal
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        className={styles.modal}
        closeIcon={<CloseOutlined />}
      >
        <Title level={3}>Thay đổi mật khẩu</Title>
        <Form form={passwordForm} onFinish={handlePasswordSubmit}>
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className={styles.modalButtons}>
            <Button
              onClick={() => {
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileSection;
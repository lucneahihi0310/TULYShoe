import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Form,
  Input,
  Button,
  Modal,
  Tabs,
  List,
  Card,
  Typography,
  Image,
  Rate,
  Radio,
  Spin,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  CameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import { AuthContext } from "../API/AuthContext";
import { fetchData, updateData, uploadAvatar } from "../API/ApiService";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [reviews, setReviews] = useState({});
  const { user } = useContext(AuthContext);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const formatCurrency = (vnd) => {
    return vnd.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  useEffect(() => {
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

    if (user) fetchUserInfo();
  }, [user]);

  const handleUploadAvatar = async (info) => {
    const file = info.file; // chính là file gốc

    if (!file) {
      message.error("Không tìm thấy file");
      return;
    }

    console.log("Selected file:", file);

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
      message.error("Cập nhật thông tin thất bại.");
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

  const handleOrderClick = (orderId) => {
    setSelectedOrder(ordersData[orderId]);
    setIsOrderModalVisible(true);
  };

  const handleReviewSubmit = () => {
    const newReviews = [];
    Object.keys(reviews).forEach((orderdetail_id) => {
      const review = reviews[orderdetail_id];
      if (review.rating || review.content || review.images.length) {
        newReviews.push({
          orderdetail_id,
          productdetail_id: selectedOrder.items.find(
            (item) => item.orderdetail_id === orderdetail_id
          ).productdetail_id,
          rating: review.rating || 0,
          review_content: review.content || "",
          images: review.images,
        });
      }
    });

    if (newReviews.length === 0) {
      message.error("Vui lòng đánh giá ít nhất một sản phẩm trước khi lưu.");
      return;
    }

    newReviews.forEach((review) => {
      const item = selectedOrder.items.find(
        (i) => i.orderdetail_id === review.orderdetail_id
      );
      if (item) {
        item.review = {
          ...review,
          review_date: new Date().toISOString(),
          is_approved: false,
          replies: [],
        };
      }
    });

    message.success("Đánh giá đã được lưu thành công! Cảm ơn bạn.");
    setIsOrderModalVisible(false);
    setReviews({});
  };

  const handleReviewChange = (orderdetail_id, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [orderdetail_id]: {
        ...prev[orderdetail_id],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsPasswordModalVisible(false);
        setIsOrderModalVisible(false);
        passwordForm.resetFields();
        setReviews({});
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [passwordForm]);

  return (
    <div className={styles.appContainer}>
      <Layout className={styles.layout}>
        <Sider
          width={192}
          className={styles.sider}
          breakpoint="md"
          collapsedWidth="0"
        >
          <Menu
            mode="vertical"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            className={styles.menu}
          >
            <Menu.Item key="profile" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
              Orders
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.content}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className={styles.tabs}
          >
            <TabPane tab="Profile" key="profile">
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
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ" },
                      ]}
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
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày sinh" },
                      ]}
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
            </TabPane>

            <TabPane tab="Orders" key="orders">
              <Title level={2} className={styles.title}>
                Danh sách đơn hàng
              </Title>
              <List
                bordered
                // dataSource={Object.values(ordersData)}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleOrderClick(item.id)}
                    className={styles.orderItem}
                    actions={[<Button type="link">Xem chi tiết</Button>]}
                  >
                    <List.Item.Meta
                      title={`Đơn hàng #${item.order_code}`}
                      description={`Ngày đặt: ${item.order_date}`}
                    />
                  </List.Item>
                )}
                className={styles.orderList}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>

      <Modal
        visible={isPasswordModalVisible}
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
            <Input.Password />
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

      <Modal
        visible={isOrderModalVisible}
        onCancel={() => {
          setIsOrderModalVisible(false);
          setReviews({});
        }}
        footer={null}
        className={styles.orderModal}
        closeIcon={<CloseOutlined />}
      >
        {selectedOrder && (
          <>
            <Title level={3}>Chi tiết đơn hàng</Title>
            <div className={styles.orderDetails}>
              <Text>
                <strong>Mã đơn hàng:</strong> #{selectedOrder.order_code}
              </Text>
              <Text>
                <strong>Ngày đặt:</strong> {selectedOrder.order_date}
              </Text>
              <Text>
                <strong>Ngày giao dự kiến:</strong>{" "}
                {selectedOrder.delivery_date}
              </Text>
              <Text>
                <strong>Trạng thái:</strong> {selectedOrder.order_status}
              </Text>
              <Text>
                <strong>Thanh toán:</strong> {selectedOrder.payment_status}
              </Text>
              <Text>
                <strong>Ghi chú:</strong>{" "}
                {selectedOrder.order_note || "Không có"}
              </Text>
              <Text>
                <strong>Thông tin giao hàng:</strong>
              </Text>
              <Text>Họ tên: {selectedOrder.shipping_info.full_name}</Text>
              <Text>Số điện thoại: {selectedOrder.shipping_info.phone}</Text>
              <Text>Email: {selectedOrder.shipping_info.email}</Text>
              <Text>Địa chỉ: {selectedOrder.shipping_info.address}</Text>
              <Title level={4}>Sản phẩm</Title>
              {selectedOrder.items.map((item) => (
                <Card
                  key={item.orderdetail_id}
                  className={styles.orderItemCard}
                >
                  <div className={styles.itemContainer}>
                    <Image
                      src={item.image}
                      alt={`Hình ảnh ${item.name}`}
                      width={176}
                      height={112}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <Title level={4}>{item.name}</Title>
                      <Text>{item.description}</Text>
                      <Text>
                        {formatCurrency(item.price_at_order)} x {item.quantity}
                      </Text>
                      <div className={styles.reviewSection}>
                        <Text strong>Đánh giá sản phẩm</Text>
                        <Rate
                          value={
                            reviews[item.orderdetail_id]?.rating ||
                            item.review?.rating ||
                            0
                          }
                          onChange={(value) =>
                            handleReviewChange(
                              item.orderdetail_id,
                              "rating",
                              value
                            )
                          }
                        />
                        <Input.TextArea
                          rows={3}
                          placeholder="Viết nhận xét của bạn..."
                          value={
                            reviews[item.orderdetail_id]?.content ||
                            item.review?.review_content ||
                            ""
                          }
                          onChange={(e) =>
                            handleReviewChange(
                              item.orderdetail_id,
                              "content",
                              e.target.value
                            )
                          }
                        />
                        <Upload
                          beforeUpload={() => false}
                          onChange={({ fileList }) =>
                            handleReviewChange(
                              item.orderdetail_id,
                              "images",
                              fileList.map((file) =>
                                URL.createObjectURL(file.originFileObj)
                              )
                            )
                          }
                          multiple
                          showUploadList={false}
                        >
                          <Button icon={<CameraOutlined />}>Thêm ảnh</Button>
                        </Upload>
                        <div className={styles.imagePreview}>
                          {(
                            reviews[item.orderdetail_id]?.images ||
                            item.review?.images ||
                            []
                          ).map((img, i) => (
                            <Image
                              key={i}
                              src={img}
                              width={80}
                              height={80}
                              className={styles.previewImage}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Text strong className={styles.total}>
                Tổng cộng: {formatCurrency(selectedOrder.total_amount)}
              </Text>
              <div className={styles.modalButtons}>
                <Button
                  onClick={() => {
                    setIsOrderModalVisible(false);
                    setReviews({});
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" onClick={handleReviewSubmit}>
                  Lưu đánh giá
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Profile;

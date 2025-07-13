import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Divider,
  Image,
  Rate,
  Input,
  Upload,
  message,
  Spin,
} from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import { fetchData, uploadReview } from "../API/ApiService";

const { Title, Text } = Typography;

const OrdersSection = ({
  user,
  ordersList,
  setOrdersList,
  setIsOrderModalVisible,
  isOrderModalVisible,
  selectedOrder,
  setSelectedOrder,
  reviews,
  setReviews,
  formatCurrency,
}) => {
  const [editingReviews, setEditingReviews] = useState({});
  const [reviewLoading, setReviewLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetchData(`/orders/user/${user._id}`, true);
      setOrdersList(Array.isArray(response) ? response : response.orders || []);
    } catch (err) {
      message.error("Không thể tải danh sách đơn hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);
  
  const handleOrderClick = async (orderCode) => {
    setOrderLoading(true);
    try {
      const data = await fetchData(`/orders/customers/${orderCode}`, true);
      const { order, products } = data;

      const items = products.map((p) => ({
        _id: p._id,
        orderdetail_id: p._id,
        name: p.product_name,
        image: p.image,
        price_at_order: p.price,
        quantity: p.quantity,
        total_price: p.total_price,
        productdetail_id: p.productdetail_id,
        color: p.color,
        size: p.size,
        review: p.review || null,
      }));

      const shippingFee = order.shipping_info?.address
        ?.toLowerCase()
        .includes("hà nội")
        ? 0
        : 30000;
      const totalProductAmount = items.reduce(
        (sum, item) => sum + item.total_price,
        0
      );

      setSelectedOrder({
        ...order,
        items,
        shippingFee,
        total_amount: totalProductAmount + shippingFee,
      });
      setIsOrderModalVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết đơn hàng: " + err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleReviewChange = (id, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async () => {
    if (!selectedOrder || selectedOrder.order_status !== "Hoàn thành") {
      message.error("Chỉ có thể đánh giá đơn hàng đã hoàn thành.");
      return;
    }

    const reviewPromises = [];
    const updatedItems = [...selectedOrder.items];

    for (const orderdetail_id in reviews) {
      const item = updatedItems.find(
        (i) => i.orderdetail_id === orderdetail_id
      );
      if (!item) continue;

      const isReviewed = !!item.review;
      const isEditing = editingReviews[orderdetail_id];
      if (isReviewed && !isEditing) continue;

      const review = reviews[orderdetail_id];
      if (!review.rating || !review.content) continue;

      const formData = new FormData();
      formData.append("ordetail_id", item._id);
      formData.append("productdetail_id", item.productdetail_id);
      formData.append("rating", review.rating);
      formData.append("review_content", review.content);

      const allImages = review.images || [];

      allImages.slice(0, 3).forEach((img) => {
        if (img instanceof File) {
          // Ảnh mới
          formData.append("images", img);
        } else if (typeof img === "string") {
          // Ảnh cũ
          formData.append("images_old", img);
        }
      });

      const promise = uploadReview(formData).then((res) => {
        const index = updatedItems.findIndex(
          (i) => i.orderdetail_id === orderdetail_id
        );
        if (index !== -1) {
          updatedItems[index].review = res.review;
        }

        setEditingReviews((prev) => {
          const updated = { ...prev };
          delete updated[orderdetail_id];
          return updated;
        });
      });

      reviewPromises.push(promise);
    }

    if (reviewPromises.length === 0) {
      message.error("Vui lòng nhập ít nhất một đánh giá để lưu.");
      return;
    }

    setReviewLoading(true);
    try {
      await Promise.all(reviewPromises);
      message.success("Đánh giá đã được gửi thành công!");
      setSelectedOrder((prev) => ({
        ...prev,
        items: updatedItems,
      }));
      setReviews({});
    } catch (err) {
      message.error("Có lỗi khi gửi đánh giá: " + err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div>
      <Title level={2} className={styles.title}>
        Danh sách đơn hàng
      </Title>

      {loading && ordersList.length === 0 ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          bordered
          dataSource={ordersList}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleOrderClick(item.order_code)}
              className={styles.orderItem}
              actions={[
                <Button
                  type="link"
                  loading={orderLoading}
                  disabled={orderLoading}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện onClick của List.Item
                    handleOrderClick(item.order_code);
                  }}
                >
                  Xem chi tiết
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`Đơn hàng ${item.order_code}`}
                description={`Ngày đặt: ${new Date(
                  item.order_date
                ).toLocaleDateString("vi-VN")}`}
              />
            </List.Item>
          )}
          className={styles.orderList}
        />
      )}

      <Modal
        open={isOrderModalVisible}
        onCancel={() => {
          setIsOrderModalVisible(false);
          setReviews({});
        }}
        footer={null}
        className={styles.orderModal}
        closeIcon={<CloseOutlined />}
      >
        <div className={styles.modalContent}>
          {selectedOrder && (
            <div className={styles.orderDetails}>
              <Card className={styles.orderCard}>
                <Title level={2} className={styles.sectionTitle}>
                  CHI TIẾT ĐƠN HÀNG
                </Title>
                <Row gutter={[16, 16]} className={styles.orderInfo}>
                  <Col xs={24} md={8}>
                    <Title level={4}>Thông tin đơn hàng</Title>
                    <ul className={styles.infoList}>
                      <li>
                        <Text strong>Mã đơn hàng:</Text>{" "}
                        {selectedOrder.order_code}
                      </li>
                      <li>
                        <Text strong>Ngày đặt:</Text>{" "}
                        {new Date(selectedOrder.order_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </li>
                      <li>
                        <Text strong>Ngày giao dự kiến:</Text>{" "}
                        {new Date(selectedOrder.delivery_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </li>
                      <li>
                        <Text strong>Ghi chú:</Text>{" "}
                        {selectedOrder.order_note || "Không có"}
                      </li>
                      <li>
                        <Text strong>Trạng thái:</Text>{" "}
                        <Text className={styles.status}>
                          {selectedOrder.order_status}
                        </Text>
                      </li>
                      <li>
                        <Text strong>Phương thức thanh toán:</Text>{" "}
                        {selectedOrder.payment_status}
                      </li>
                    </ul>
                  </Col>
                  <Col xs={24} md={8}>
                    <Title level={4}>Thông tin người nhận</Title>
                    <ul className={styles.infoList}>
                      <li>
                        <Text strong>Họ tên:</Text>{" "}
                        {selectedOrder.shipping_info.full_name}
                      </li>
                      <li>
                        <Text strong>Địa chỉ:</Text>{" "}
                        {selectedOrder.shipping_info.address}
                      </li>
                      <li>
                        <Text strong>Điện thoại:</Text>{" "}
                        {selectedOrder.shipping_info.phone}
                      </li>
                      <li>
                        <Text strong>Email:</Text>{" "}
                        {selectedOrder.shipping_info.email}
                      </li>
                    </ul>
                  </Col>
                  <Col xs={24} md={8}>
                    <Title level={4}>Tổng đơn hàng</Title>
                    <ul className={styles.infoList}>
                      <li>
                        <Text strong>Tổng tiền hàng:</Text>{" "}
                        {formatCurrency(
                          selectedOrder.items.reduce(
                            (sum, i) => sum + i.total_price,
                            0
                          )
                        )}
                      </li>
                      <li>
                        <Text strong>Phí vận chuyển:</Text>{" "}
                        {formatCurrency(selectedOrder.shippingFee)}
                      </li>
                      <li className={styles.total}>
                        <Text strong>Tổng cộng:</Text>{" "}
                        {formatCurrency(selectedOrder.total_amount)}
                      </li>
                    </ul>
                  </Col>
                </Row>
                <Divider />
                <Title level={3}>Sản phẩm đã đặt</Title>
                {selectedOrder.items.map((item) => {
                  const isReviewed = !!item.review;
                  return (
                    <Card
                      key={item.orderdetail_id}
                      className={styles.productCard}
                      hoverable
                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col flex="0 0 140px">
                          <Image
                            src={item.image}
                            width={140}
                            height={140}
                            preview={false}
                            className={styles.productImage}
                          />
                        </Col>
                        <Col flex="auto">
                          <div className={styles.productInfo}>
                            <Title level={4} className={styles.productName}>
                              {item.name}
                            </Title>
                            <Text>Màu:</Text>
                            <span
                              style={{ backgroundColor: item.color }}
                              className={styles.colorSwatch}
                            />
                            <p>Size: {item.size}</p>
                            <Text strong>
                              {formatCurrency(item.price_at_order)}
                            </Text>
                          </div>

                          {selectedOrder.order_status === "Hoàn thành" && (
                            <div className={styles.reviewSection}>
                              <Text strong>Đánh giá sản phẩm</Text>
                              {isReviewed &&
                              !editingReviews[item.orderdetail_id] ? (
                                <div>
                                  <Rate disabled value={item.review.rating} />
                                  <p>{item.review.review_content}</p>
                                  <p
                                    style={{ fontStyle: "italic", color: "#888" }}
                                  >
                                    Đánh giá lúc:{" "}
                                    {new Date(
                                      item.review.review_date
                                    ).toLocaleString("vi-VN")}
                                  </p>
                                  <div className={styles.imagePreview}>
                                    {(item.review.images || []).map((img, i) => (
                                      <Image
                                        key={i}
                                        src={img}
                                        width={80}
                                        height={80}
                                      />
                                    ))}
                                  </div>
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      setEditingReviews((prev) => ({
                                        ...prev,
                                        [item.orderdetail_id]: true,
                                      }));
                                      setReviews((prev) => ({
                                        ...prev,
                                        [item.orderdetail_id]: {
                                          rating: item.review.rating,
                                          content: item.review.review_content,
                                          images: item.review.images || [],
                                        },
                                      }));
                                    }}
                                  >
                                    Chỉnh sửa
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <Rate
                                    value={
                                      reviews[item.orderdetail_id]?.rating ??
                                      item.review?.rating ??
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
                                      reviews[item.orderdetail_id]?.content ??
                                      item.review?.review_content ??
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
                                    disabled={
                                      !editingReviews[item.orderdetail_id]
                                    }
                                    beforeUpload={(file) => {
                                      const current =
                                        reviews[item.orderdetail_id]?.images
                                          ?.length || 0;
                                      if (current >= 3) {
                                        message.warning(
                                          "Chỉ được tải lên tối đa 3 ảnh."
                                        );
                                        return Upload.LIST_IGNORE;
                                      }
                                      handleReviewChange(
                                        item.orderdetail_id,
                                        "images",
                                        [
                                          ...(reviews[item.orderdetail_id]
                                            ?.images || []),
                                          file,
                                        ]
                                      );
                                      return false;
                                    }}
                                    showUploadList={false}
                                  >
                                    <Button
                                      icon={<CameraOutlined />}
                                      style={{ marginTop: "0.5rem" }}
                                      disabled={
                                        !editingReviews[item.orderdetail_id]
                                      }
                                    >
                                      Thêm ảnh (tối đa 3)
                                    </Button>
                                  </Upload>
                                  <div className={styles.imagePreview}>
                                    {(
                                      reviews[item.orderdetail_id]?.images ||
                                      item.review?.images ||
                                      []
                                    ).map((img, i) => {
                                      const isFile = !(typeof img === "string");
                                      const previewUrl = isFile
                                        ? URL.createObjectURL(img)
                                        : img;
                                      return (
                                        <div
                                          key={i}
                                          className={styles.previewWrapper}
                                        >
                                          <Image
                                            src={previewUrl}
                                            width={80}
                                            height={80}
                                            className={styles.previewImage}
                                          />
                                          {editingReviews[
                                            item.orderdetail_id
                                          ] && (
                                            <CloseOutlined
                                              onClick={() => {
                                                const updatedImages = (
                                                  reviews[item.orderdetail_id]
                                                    ?.images || []
                                                ).filter(
                                                  (_, index) => index !== i
                                                );
                                                handleReviewChange(
                                                  item.orderdetail_id,
                                                  "images",
                                                  updatedImages
                                                );
                                              }}
                                              className={styles.removeIcon}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <Button
                                    danger
                                    style={{ marginTop: "0.5rem" }}
                                    onClick={() => {
                                      setEditingReviews((prev) => ({
                                        ...prev,
                                        [item.orderdetail_id]: false,
                                      }));
                                      setReviews((prev) => {
                                        const updated = { ...prev };
                                        delete updated[item.orderdetail_id];
                                        return updated;
                                      });
                                    }}
                                  >
                                    Hủy chỉnh sửa
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </Card>
              {selectedOrder?.order_status === "Hoàn thành" && (
                <div className={styles.modalButtons}>
                  <Button
                    onClick={() => {
                      setIsOrderModalVisible(false);
                      setReviews({});
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleReviewSubmit}
                    loading={reviewLoading}
                    disabled={reviewLoading}
                  >
                    Lưu đánh giá
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OrdersSection;
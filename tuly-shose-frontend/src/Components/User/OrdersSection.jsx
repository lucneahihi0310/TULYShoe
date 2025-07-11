import React, { useEffect } from "react";
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
} from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import { fetchData } from "../API/ApiService";

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
  const fetchOrders = async () => {
    try {
      console.log("Fetching orders for user:", user._id);
      const response = await fetchData(`/orders/user/${user._id}`, true);
      setOrdersList(Array.isArray(response) ? response : response.orders || []);
      console.log(
        "Orders fetched:",
        Array.isArray(response) ? response : response.orders
      );
    } catch (err) {
      message.error("Không thể tải danh sách đơn hàng: " + err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleOrderClick = async (orderCode) => {
    try {
      const data = await fetchData(`/orders/customers/${orderCode}`, true);
      const { order, products } = data;

      const formattedItems = products.map((p, idx) => ({
        orderdetail_id: idx.toString(),
        name: p.product_name,
        image: p.image,
        price_at_order: p.price,
        quantity: p.quantity,
        total_price: p.total_price,
        description: `Màu: ${p.color}, Size: ${p.size}`,
        productdetail_id: p.productdetail_id,
        color: p.color,
        size: p.size,
      }));

      const isInHanoi = order.shipping_info?.address
        ?.toLowerCase()
        .includes("hà nội");
      const shippingFee = isInHanoi ? 0 : 30000;
      const totalProductAmount = products.reduce(
        (sum, item) => sum + item.total_price,
        0
      );

      setSelectedOrder({
        ...order,
        items: formattedItems,
        total_amount: totalProductAmount + shippingFee,
        shippingFee,
      });
      setIsOrderModalVisible(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết đơn hàng: " + err.message);
    }
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

  return (
    <div>
      <Title level={2} className={styles.title}>
        Danh sách đơn hàng
      </Title>
      <List
        bordered
        dataSource={ordersList}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleOrderClick(item.order_code)}
            className={styles.orderItem}
            actions={[<Button type="link">Xem chi tiết</Button>]}
          >
            <List.Item.Meta
              title={`Đơn hàng #${item.order_code}`}
              description={`Ngày đặt: ${new Date(
                item.order_date
              ).toLocaleDateString("vi-VN")}`}
            />
          </List.Item>
        )}
        className={styles.orderList}
      />

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
        {selectedOrder && (
          <div className={styles.orderDetails}>
            <Card className={styles.orderCard}>
              <Title level={2} className={styles.sectionTitle}>
                CHI TIẾT ĐƠN HÀNG
              </Title>
              <Row gutter={[16, 16]} className={styles.orderInfo}>
                <Col xs={24} md={8}>
                  <Title level={4} className={styles.subTitle}>
                    Thông tin đơn hàng
                  </Title>
                  <ul className={styles.infoList}>
                    <li>
                      <Text strong>Mã đơn hàng:</Text> {selectedOrder.order_code}
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
                        {selectedOrder.order_status || "Đang xử lý"}
                      </Text>
                    </li>
                    <li>
                      <Text strong>Phương thức thanh toán:</Text>{" "}
                      {selectedOrder.payment_status}
                    </li>
                  </ul>
                </Col>
                <Col xs={24} md={8}>
                  <Title level={4} className={styles.subTitle}>
                    Thông tin người nhận
                  </Title>
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
                  <Title level={4} className={styles.subTitle}>
                    Tổng đơn hàng
                  </Title>
                  <ul className={styles.infoList}>
                    <li>
                      <Text strong>Tổng tiền hàng:</Text>{" "}
                      {formatCurrency(
                        selectedOrder.items.reduce(
                          (sum, item) => sum + item.total_price,
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

              <Title level={3} className={styles.productsTitle}>
                Sản phẩm đã đặt
              </Title>
              <div className={styles.productList}>
                {selectedOrder.items.map((item) => (
                  <Card
                    key={item.orderdetail_id}
                    className={styles.productCard}
                    hoverable
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col flex="0 0 140px">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={140}
                          className={styles.productImage}
                          preview={false}
                        />
                      </Col>
                      <Col flex="auto">
                        <div className={styles.productInfo}>
                          <div className={styles.productTopRow}>
                            <Title level={4} className={styles.productName}>
                              {item.name}
                            </Title>
                            <Text className={styles.quantity}>
                              Số lượng: {item.quantity}
                            </Text>
                          </div>
                          <div className={styles.productDetail}>
                            <Text>Màu:</Text>
                            <span
                              className={styles.colorSwatch}
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </div>
                          <p className={styles.productDetail}>
                            Size: {item.size}
                          </p>
                          <Text strong className={styles.productPrice}>
                            {formatCurrency(item.price_at_order)}
                          </Text>
                        </div>
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
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Card>
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
        )}
      </Modal>
    </div>
  );
};

export default OrdersSection;
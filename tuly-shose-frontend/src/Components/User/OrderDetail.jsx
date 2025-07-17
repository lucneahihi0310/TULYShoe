import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Divider,
  message,
  Spin,
} from "antd";
import { fetchData } from "../API/ApiService";
import styles from "../../CSS/OrderDetail.module.css";

const { Title, Text, Paragraph } = Typography;

const OrderDetail = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await fetchData(`/orders/customers/${orderCode}`);
        setOrder(data.order);
        setProducts(data.products); // đúng key từ backend
      } catch {
        message.error("Mã đơn hàng sai hoặc không tồn tại.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderCode]);

  const totalProductAmount = products.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  const isInHanoi = order?.shipping_info?.address
    ?.toLowerCase()
    .includes("hà nội");

  const shippingFee = isInHanoi ? 0 : 30000;
  const total = totalProductAmount + shippingFee;

  if (loading)
    return (
      <div className={styles.loaderContainer}>
        <Spin size="large" />
      </div>
    );

  if (!order) return null;

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <main className={styles.main}>
        <Card className={styles.orderCard} id="order-detail">
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
                  <Text strong>Mã đơn hàng:</Text> {order.order_code}
                </li>
                <li>
                  <Text strong>Ngày đặt:</Text>{" "}
                  {new Date(order.order_date).toLocaleDateString("vi-VN")}
                </li>
                <li>
                  <Text strong>Ngày giao dự kiến:</Text>{" "}
                  {new Date(order.delivery_date).toLocaleDateString("vi-VN")}
                </li>
                <li>
                  <Text strong>Ghi chú:</Text>{" "}
                  {order.order_note ? order.order_note : "Không có ghi chú"}
                </li>

                <li>
                  <Text strong>Trạng thái:</Text>{" "}
                  <Text className={styles.status}>
                    {order.order_status || "Đang xử lý"}
                  </Text>
                </li>
                <li>
                  <Text strong>Phương thức thanh toán:</Text>{" "}
                  {order.payment_status}
                </li>
              </ul>
            </Col>
            <Col xs={24} md={8}>
              <Title level={4} className={styles.subTitle}>
                Thông tin người nhận
              </Title>
              <address className={styles.address}>
                <li>
                  <Text strong>Họ tên:</Text> {order.shipping_info.full_name}
                </li>
                <li>
                  <Text strong>Địa chỉ:</Text> {order.shipping_info.address}
                </li>
                <li>
                  <Text strong>Điện thoại:</Text> {order.shipping_info.phone}
                </li>
              </address>
            </Col>
            <Col xs={24} md={8}>
              <Title level={4} className={styles.subTitle}>
                Tổng đơn hàng
              </Title>
              <ul className={styles.infoList}>
                <li>
                  <Text strong>Tổng tiền hàng:</Text>{" "}
                  {totalProductAmount.toLocaleString()}₫
                </li>
                <li>
                  <Text strong>Phí vận chuyển:</Text>{" "}
                  {shippingFee.toLocaleString()}₫
                </li>
                <li className={styles.total}>
                  <Text strong>Tổng cộng:</Text> {total.toLocaleString()}₫
                </li>
              </ul>
            </Col>
          </Row>

          <Divider />

          <Title level={3} className={styles.productsTitle}>
            Sản phẩm đã đặt
          </Title>
          <div className={styles.productList}>
            {products.map((item, index) => (
              <Card className={styles.productCard} hoverable key={index}>
                <Row gutter={[16, 16]} align="middle">
                  <Col flex="0 0 140px">
                    <Image
                      src={item.image}
                      alt={item.product_name}
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
                          {item.product_name}
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
                      <p className={styles.productDetail}>Size: {item.size}</p>
                      <Text strong className={styles.productPrice}>
                        {item.price.toLocaleString()}₫
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </Card>

        {/* About Us Section */}
        <section className={styles.aboutSection} id="about-us">
          <Row gutter={[0, 0]}>
            <Col xs={24} md={12} className={styles.aboutText}>
              <Title level={2} className={styles.aboutTitle}>
                Về TULY Shoe
              </Title>
              <Paragraph className={styles.aboutParagraph}>
                Tại <Text strong>TULY Shoe</Text>, chúng tôi đam mê mang đến
                trải nghiệm sneaker tuyệt vời nhất cho mọi khách hàng. Được
                thành lập với tầm nhìn kết hợp phong cách, sự thoải mái và đổi
                mới, bộ sưu tập của chúng tôi bao gồm những xu hướng mới nhất và
                những mẫu kinh điển vượt thời gian.
              </Paragraph>
              <Paragraph className={styles.aboutParagraph}>
                Chúng tôi tin rằng giày sneaker không chỉ là đôi giày — mà còn
                là tuyên ngôn cá tính và phong cách sống. Đội ngũ chuyên gia của
                chúng tôi lựa chọn kỹ càng từng đôi giày để đảm bảo chất lượng
                cao cấp, độ bền và thiết kế độc đáo.
              </Paragraph>
              <Paragraph className={styles.aboutParagraph}>
                Hãy gia nhập đại gia đình <Text strong>TULY Shoe</Text> và bước
                vào thế giới nơi thời trang gặp gỡ chức năng. Đôi sneaker hoàn
                hảo đang chờ bạn.
              </Paragraph>
              <div className={styles.socialLinks}>
                <a
                  href="https://facebook.com/tulyshoe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={`fab fa-facebook-square ${styles.socialIcon}`}
                  ></i>
                </a>
                <a
                  href="https://instagram.com/tulyshoe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-instagram ${styles.socialIcon}`}></i>
                </a>
                <a
                  href="https://twitter.com/tulyshoe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={`fab fa-twitter-square ${styles.socialIcon}`}
                  ></i>
                </a>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Image
                src="https://storage.googleapis.com/a1aa/image/f05c04e8-7fbc-4ebb-f5ea-f23c49c10cbe.jpg"
                alt="Trưng bày giày sneaker phong cách"
                className={styles.aboutImage}
                preview={false}
              />
            </Col>
          </Row>
        </section>
      </main>
    </div>
  );
};

export default OrderDetail;

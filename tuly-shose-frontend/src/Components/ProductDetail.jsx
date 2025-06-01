import React, { useState } from "react";
import {
  Breadcrumb,
  Button,
  Rate,
  Row,
  Col,
  Radio,
  message,
  Card,
  Avatar,
  Typography,
  Divider,
} from "antd";
import styles from "../CSS/ProductDetail.module.css";
import { ThunderboltOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useInView } from "react-intersection-observer";

const { Title, Paragraph, Text } = Typography;

const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar:
      "https://storage.googleapis.com/a1aa/image/b4b52f6a-b8e5-4fc2-fd14-1eb9b9c84fc6.jpg",
    rating: 5,
    content:
      "Giày đẹp, chất lượng tốt, đi rất êm chân. Màu sắc giống hình, shop giao hàng nhanh.",
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar:
      "https://storage.googleapis.com/a1aa/image/b8242acc-de1f-45f7-5961-236ed092b0d4.jpg",
    rating: 4.5,
    content:
      "Mình rất thích kiểu dáng và màu sắc của đôi giày này. Size chuẩn, đi thoải mái.",
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar:
      "https://storage.googleapis.com/a1aa/image/f997f8f6-98ef-43f2-fa6f-7f842b3487dc.jpg",
    rating: 5,
    content:
      "Đôi giày rất đẹp, chất lượng tốt, giá cả hợp lý. Sẽ ủng hộ shop tiếp.",
  },
];

const relatedProducts = [
  {
    id: 1,
    name: "Nike Air Max 90 Trắng Đỏ",
    price: "1.450.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/1d4b5ac2-2721-4d9f-b490-d930af4f676a.jpg",
    link: "#",
  },
  {
    id: 2,
    name: "Nike Air Force 1 Đen Trắng",
    price: "1.300.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/a473356e-51db-4bb6-16ad-8f1be50aaa92.jpg",
    link: "#",
  },
  {
    id: 3,
    name: "Nike Blazer Mid Xám",
    price: "1.250.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/c077e1e6-f92f-4bf1-53b7-1b2c9d5b839e.jpg",
    link: "#",
  },
  {
    id: 4,
    name: "Nike React Infinity Run",
    price: "1.600.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/38afdc46-167d-4406-edf0-973fbcbd465a.jpg",
    link: "#",
  },
];

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(
    "https://storage.googleapis.com/a1aa/image/b94000a9-b76a-4b35-4976-a23cd3d29110.jpg"
  );

  // Lazy load các section chính
  const { ref: infoRef, inView: infoInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });
  const { ref: descRef, inView: descInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });
  const { ref: reviewsRef, inView: reviewsInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });
  const { ref: relatedRef, inView: relatedInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const colors = [
    /* giữ nguyên */
  ];

  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  const handleAddToCart = () => {
    if (!selectedColor) {
      message.error("Vui lòng chọn màu giày.");
      return;
    }
    if (!selectedSize) {
      message.error("Vui lòng chọn size giày.");
      return;
    }
    message.success(
      `Đã thêm giày màu ${selectedColor} size ${selectedSize} vào giỏ hàng!`
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 16 }}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="#">Trang chủ</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#">Sản phẩm</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Phần chính: ảnh + chọn màu size */}
      <div ref={infoRef}>
        {infoInView ? (
          <Row gutter={[32, 32]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <img
                src={mainImage}
                alt="Nike Air Force 1 Shadow"
                style={{ width: "100%", borderRadius: 8 }}
              />
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                }}
              >
                {colors.map((color) => (
                  <img
                    key={color.value}
                    src={color.image}
                    alt={color.label}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      cursor: "pointer",
                      border:
                        mainImage === color.image
                          ? "2px solid #1890ff"
                          : "1px solid #ddd",
                    }}
                    onClick={() => {
                      setMainImage(color.image);
                      setSelectedColor(color.value);
                    }}
                  />
                ))}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Title level={2}>Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11</Title>
              <Rate allowHalf defaultValue={4.5} disabled />
              <Text style={{ marginLeft: 8 }}>(45 đánh giá) | Đã bán 150+</Text>

              <div
                style={{
                  marginTop: 16,
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#ff4d4f",
                }}
              >
                1.350.000₫{" "}
                <del style={{ color: "#999", marginLeft: 12 }}>1.800.000₫</del>{" "}
                <span
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    marginLeft: 8,
                  }}
                >
                  Giảm 25%
                </span>
              </div>

              <div style={{ marginTop: 24 }}>
                <Title level={4}>Chọn màu</Title>
                <Radio.Group
                  options={colors.map((c) => ({ label: c.label, value: c.value }))}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    const selected = colors.find((c) => c.value === e.target.value);
                    if (selected) setMainImage(selected.image);
                  }}
                  value={selectedColor}
                  optionType="button"
                  buttonStyle="solid"
                />
              </div>

              <div style={{ marginTop: 24 }}>
                <Title level={4}>Chọn size</Title>
                <Radio.Group
                  options={sizes.map((s) => ({ label: s.toString(), value: s }))}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  value={selectedSize}
                  optionType="button"
                  buttonStyle="solid"
                />
              </div>

              <div className={styles.productActions}>
                <button className={styles.productButton}>
                  <ThunderboltOutlined />
                  Mua ngay
                </button>
                <button
                  className={`${styles.productButton} ${styles.cart}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCartOutlined />
                  Giỏ hàng
                </button>
              </div>

              <div style={{ marginTop: 32, color: "#555" }}>
                <Paragraph>
                  <b>Thương hiệu:</b> Nike
                </Paragraph>
                <Paragraph>
                  <b>Chất liệu:</b> Da tổng hợp cao cấp, đế cao su bền bỉ
                </Paragraph>
                <Paragraph>
                  <b>Màu sắc:</b> Trắng, nâu, xám
                </Paragraph>
                <Paragraph>
                  <b>Bảo hành:</b> 12 tháng
                </Paragraph>
                <Paragraph>
                  <b>Xuất xứ:</b> Việt Nam
                </Paragraph>
              </div>
            </Col>
          </Row>
        ) : (
          <div style={{ height: 600 }}></div> // giữ chỗ tránh nhảy layout
        )}
      </div>

      <Divider />

      {/* Phần mô tả sản phẩm */}
      <div ref={descRef}>
        {descInView ? (
          <section>
            <Title level={3}>Mô tả sản phẩm</Title>
            <Paragraph>
              Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11 là phiên bản giày sneaker
              thời trang với thiết kế độc đáo, phối màu trắng, nâu và xám hài hòa,
              phù hợp cho cả nam và nữ. Được làm từ chất liệu da tổng hợp cao cấp,
              đế cao su bền bỉ, mang lại sự thoải mái và độ bền vượt trội khi sử
              dụng hàng ngày.
            </Paragraph>
            <Paragraph>
              Đế giày được thiết kế với độ bám cao, chống trơn trượt hiệu quả. Form
              giày ôm chân, tạo cảm giác chắc chắn và thoải mái khi di chuyển. Đây
              là lựa chọn hoàn hảo cho những ai yêu thích phong cách streetwear năng
              động và cá tính.
            </Paragraph>
            <Paragraph>
              Sản phẩm được bảo hành 12 tháng và cam kết chính hãng 100%. Hãy nhanh
              tay đặt hàng để sở hữu đôi giày thời thượng này!
            </Paragraph>
          </section>
        ) : (
          <div style={{ height: 200 }}></div>
        )}
      </div>

      <Divider />

      {/* Phần đánh giá sản phẩm */}
      <div ref={reviewsRef}>
        {reviewsInView ? (
          <section>
            <Title level={3}>Đánh giá sản phẩm</Title>
            <Row gutter={[16, 16]}>
              {reviews.map(({ id, name, avatar, rating, content }) => (
                <Col xs={24} md={8} key={id}>
                  <Card>
                    <Card.Meta
                      avatar={<Avatar src={avatar} />}
                      title={name}
                      description={<Rate disabled defaultValue={rating} />}
                    />
                    <Paragraph style={{ marginTop: 12 }}>{content}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        ) : (
          <div style={{ height: 300 }}></div>
        )}
      </div>

      <Divider />

      {/* Phần sản phẩm liên quan */}
      <div ref={relatedRef}>
        {relatedInView ? (
          <section>
            <Title level={3}>Sản phẩm liên quan</Title>
            <Row gutter={[16, 16]}>
              {relatedProducts.map(({ id, name, price, image, link }) => (
                <Col xs={12} sm={8} md={6} key={id}>
                  <Card
                    hoverable
                    cover={
                      <img alt={name} src={image} style={{ borderRadius: 8 }} />
                    }
                    onClick={() => (window.location.href = link)}
                  >
                    <Card.Meta
                      title={name}
                      description={
                        <Text strong style={{ color: "#ff4d4f" }}>
                          {price}
                        </Text>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        ) : (
          <div style={{ height: 400 }}></div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
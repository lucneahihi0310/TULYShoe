import React from "react";
import { Card, Row, Col } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import styles from "../../CSS/HomePage.module.css";
import { useInView } from "react-intersection-observer";

const products = [
  {
    id: 1,
    name: "MLB Chunky Liner Strap Mono NY Quai Dân Xám REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/b0509297-b715-43cf-0ef3-f10379eee67d.jpg",
    oldPrice: "600.000₫",
    newPrice: "600.000₫",
  },
  {
    id: 2,
    name: "Nike Air Force 1 Kem Nâu REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/28d2232a-ff6b-4fd3-a1df-5c883c72d472.jpg",
    oldPrice: "600.000₫",
    newPrice: "550.000₫",
  },
  {
    id: 3,
    name: "Giày MLB LA DODGERS Trắng REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/ec92b2a5-ef6b-4466-a7a8-226a5d99165f.jpg",
    oldPrice: "600.000₫",
    newPrice: "580.000₫",
  },
  {
    id: 4,
    name: "Giày Adidas Forum 84 Trắng Đen REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/ce107e9c-33c6-4bda-ed22-1859985905b2.jpg",
    oldPrice: "600.000₫",
    newPrice: "600.000₫",
  },
  {
    id: 5,
    name: "Adidas Samba Đỏ Trắng Kẻ Đen MG De Lưới REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/8b5fd081-89c2-4be5-3e06-e1c84a3a0125.jpg",
    oldPrice: "500.000₫",
    newPrice: "500.000₫",
  },
  {
    id: 6,
    name: "Giày Nike SB Force Sĩ Xám Đỏ REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/cb752e94-ac8e-4e4f-ba9b-9881a6416173.jpg",
    oldPrice: "600.000₫",
    newPrice: "600.000₫",
  },
  {
    id: 7,
    name: "Jordan 1 Low Travis Scott Bên Rễ REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/dc5d64b3-0318-4e18-f295-11c54f7ddc53.jpg",
    oldPrice: "600.000₫",
    newPrice: "550.000₫",
  },
  {
    id: 8,
    name: "Giày Asics Court M2 Kem Xám REP 1:1",
    img: "https://storage.googleapis.com/a1aa/image/8e340fef-3931-4196-1e60-025e46780611.jpg",
    oldPrice: "550.000₫",
    newPrice: "550.000₫",
  },
];

const HomePage = () => {
  const { ref: productRef, inView: productInView } = useInView({
    triggerOnce: true,
    rootMargin: "100px",
  });

  const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: true,
    rootMargin: "100px",
  });

  return (
    <>
      <header
        className={styles["header-animate"]}
        style={{
          background:
            "linear-gradient(90deg, #4b5563 0%, #6b7280 50%, #d1d5db 100%)",
          height: "30rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          marginBottom: 0,
        }}
      >
        {/* header content */}
        <h1
          style={{
            fontWeight: 800,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "8rem",
            letterSpacing: "0.3em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          TULY
        </h1>
        <h2
          style={{
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "4rem",
            letterSpacing: "0.3em",
            margin: 0,
            marginTop: "0.25rem",
          }}
        >
          Shoe
        </h2>
        <p style={{ fontSize: "2rem", marginTop: "0.5rem", marginBottom: 0 }}>
          Step Into Style & Sophistication
        </p>
      </header>

      <section
        style={{
          backgroundColor: "white",
          padding: "1rem 0",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        HÀNG CAO CẤP
        <span
          className={styles["fire-text"]}
          style={{ fontWeight: 700, marginLeft: "0.25rem" }}
        >
          HOT NHẤT
        </span>
      </section>

      {/* Phần sản phẩm: chỉ render khi scroll đến */}
      <div ref={productRef} style={{ width: "80%", margin: "0 auto" }}>
        {productInView ? (
          <Row
            gutter={[16, 16]}
            justify="center"
            style={{ maxWidth: 1500, margin: "0 auto"}}
          >
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={6} lg={6}>
                <Card
                  hoverable
                  className={styles["custom-card"]}
                  bodyStyle={{ padding: "8px" }}
                  style={{
                    backgroundColor: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        backgroundColor: "#F5A89A",
                        color: "#FF6600",
                        fontSize: 15,
                        fontWeight: 600,
                        padding: "0 4px",
                        borderRadius: 2,
                        userSelect: "none",
                      }}
                    >
                      25%
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      marginTop: 4,
                      lineHeight: 1.2,
                      minHeight: "2.4rem",
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#9ca3af",
                      textDecoration: "line-through",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {product.oldPrice}
                  </p>
                  <p
                    style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#16a34a" }}
                  >
                    {product.newPrice}
                  </p>

                  <div className={styles["product-actions"]}>
                    <button className={styles["product-button"]}>
                      <ThunderboltOutlined /> Mua ngay
                    </button>
                    <button
                      className={`${styles["product-button"]} ${styles["cart"]}`}
                    >
                      <ShoppingCartOutlined /> Giỏ hàng
                    </button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ height: 600 }}></div> // giữ chỗ tránh nhảy layout
        )}
      </div>

      {/* Phần About: cũng tương tự */}
      <div ref={aboutRef}>
        {aboutInView ? (
          <Row
            justify="center"
            style={{
              marginTop: 40,
              backgroundColor: "#D9D9D9",
              padding: "2rem 0",
            }}
          >
            <Col span={24} style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: "#4b5563" }}>
                Tại sao chọn Tuly Shoe?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#6b7280",
                  maxWidth: 800,
                  margin: "0 auto",
                }}
              >
                Chúng tôi cung cấp những đôi giày replica chất lượng cao với thiết
                kế tinh tế và giá cả phải chăng. Mỗi sản phẩm đều được kiểm tra kỹ
                lưỡng để đảm bảo mang đến trải nghiệm tốt nhất cho khách hàng.
              </p>

              <p style={{ fontSize: 16, color: "#6b7280" }}>
                * Tất cả sản phẩm đều là hàng replica chất lượng cao, không phải
                hàng chính hãng.
              </p>
            </Col>
          </Row>
        ) : (
          <div style={{ height: 300 }}></div>
        )}
      </div>
    </>
  );
};

export default HomePage;
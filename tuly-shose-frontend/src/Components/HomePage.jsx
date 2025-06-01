import React from "react";
import { Card, Row, Col } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";

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
  return (
    <>
      {/* Thêm style tại đây */}
      <style>
        {`
          .product-actions {
            position: absolute;
            bottom: 8px;
            left: 8px;
            right: 8px;
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .ant-card:hover .product-actions {
            opacity: 1;
          }

          .product-button {
            flex: 1;
            background-color: #FF3300;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }

          .product-button.cart {
            background-color: #FF6600;
          }
            .product-button {
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.product-button::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(211, 211, 211, 0.5); /* màu xám nhạt + opacity */
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  border-radius: 4px;
  pointer-events: none; /* để không cản sự kiện click */
}

.product-button:hover::after {
  opacity: 1;
}

            .custom-card {
      transition: padding-bottom 0.3s ease;
    }
    .custom-card:hover {
      padding-bottom: 40px !important;
    }
    .custom-card:hover .product-actions {
      opacity: 1;
    }
      @keyframes headerFadeIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
    50% {
    opacity: 1;
    transform: scale(2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.header-animate {
  animation: headerFadeIn 0.8s ease-out forwards;
}
  @keyframes fireFlicker {
  0% {
    text-shadow: 0 0 2px #ff6a00, 0 0 4px #ff6a00, 0 0 6px #ff6a00, 0 0 8px #ff3c00;
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 3px #ffa200, 0 0 6px #ff6a00, 0 0 10px #ff3c00, 0 0 14px #ff0000;
    transform: scale(1.05);
  }
  100% {
    text-shadow: 0 0 2px #ff6a00, 0 0 4px #ff6a00, 0 0 6px #ff6a00, 0 0 8px #ff3c00;
    transform: scale(1);
  }
}

.fire-text {
  animation: fireFlicker 1s infinite ease-in-out;
  color: #dc2626; /* đỏ tươi */
}

        `}
      </style>
      <header
        className="header-animate"
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
          className="fire-text"
          style={{ fontWeight: 700, marginLeft: "0.25rem" }}
        >
          HOT NHẤT
        </span>
      </section>

      <Row
        gutter={[16, 16]}
        justify="center"
        style={{ maxWidth: 1500, margin: "0 auto", padding: "0 16px" }}
      >
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={6} lg={6}>
            <Card
              hoverable
              className="custom-card"
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
                  style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "1 / 1", // ảnh vuông, luôn full chiều rộng
                    objectFit: "cover", // hoặc "contain" nếu muốn không cắt hình
                    borderRadius: 4,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    backgroundColor: "#bbf7d0",
                    color: "#166534",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "0 4px",
                    borderRadius: 2,
                    userSelect: "none",
                  }}
                >
                  1:1
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
              <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                {product.newPrice}
              </p>

              {/* Buttons shown on hover */}
              <div className="product-actions">
                <button className="product-button">
                  <ThunderboltOutlined /> Mua ngay
                </button>
                <button className="product-button cart">
                  <ShoppingCartOutlined /> Giỏ hàng
                </button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
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
    </>
  );
};

export default HomePage;

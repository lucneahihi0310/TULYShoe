import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 64px"
      }}
    >
      <Row gutter={[32, 32]}>
        {/* Logo */}
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 16 }}>
            <img
              src="../../image/logo_trang.png"
              alt="Tuly Shoe"
              style={{
                height: 100,
                width: "auto",
                display: "block",
                marginBottom: 40,
              }}
            />
            <Text style={{ color: "#ccc", display: "block" }}>
              Phong cách đỉnh cao, chất lượng vượt trội.
            </Text>
          </div>
        </Col>

        {/* Thông tin liên hệ */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff" }}>
            Liên hệ
          </Title>
          <Text style={{ display: "block", color: "#ccc" }}>
            Hotline: 1900 1234
          </Text>
          <Text style={{ display: "block", color: "#ccc" }}>
            Email: support@tulyshoe.vn
          </Text>
          <Text style={{ display: "block", color: "#ccc" }}>
            Địa chỉ: 123 Đường Thời Trang, TP.HCM
          </Text>
          <div style={{ marginTop: 16 }}>
            <Text style={{ color: "#ccc" }}>Theo dõi chúng tôi trên:</Text>
            <Space size="large" style={{ marginLeft: 8 }}>
              <Link href="#" style={{ color: "white", fontSize: 20 }}>
                <i class="bi bi-facebook"></i>
              </Link>
              <Link href="#" style={{ color: "white", fontSize: 20 }}>
                <i class="bi bi-messenger"></i>
              </Link>
              <Link href="#" style={{ color: "white", fontSize: 20 }}>
                <i class="bi bi-twitter"></i>
              </Link>
              <Link href="#" style={{ color: "white", fontSize: 20 }}>
                <i class="bi bi-instagram"></i>
              </Link>
            </Space>
          </div>
        </Col>

        {/* Điều hướng nhanh */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff" }}>
            Danh mục
          </Title>
          <Space direction="vertical">
            <Link style={{ color: "#ccc" }} href="#">
              Nike
            </Link>
            <Link style={{ color: "#ccc" }} href="#">
              Adidas
            </Link>
            <Link style={{ color: "#ccc" }} href="#">
              Hãng khác
            </Link>
            <Link style={{ color: "#ccc" }} href="#">
              Bán chạy
            </Link>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.913201094446!2d105.52525639999996!3d21.01440870000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b4294f9b71f%3A0xa6159406faced446!2zVG_DoCBEZWx0YSAoxJDhuqFpIGjhu41jIEZQVCk!5e0!3m2!1svi!2s!4v1750295704444!5m2!1svi!2s"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ Google"
          ></iframe>
        </Col>
      </Row>
      <Row gutter={[32, 32]}>
        <Text style={{ color: "#ccc", textAlign: "center", width: "100%" }}>
          © {new Date().getFullYear()} TULY Shoe.
        </Text>
      </Row>
    </AntFooter>
  );
};

export default Footer;

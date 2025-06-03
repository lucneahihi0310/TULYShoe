import React from 'react'
import { Layout, Row, Col, Typography, Space } from 'antd'

const { Footer: AntFooter } = Layout
const { Title, Text, Link } = Typography

const Footer = () => {
  return (
    <AntFooter style={{ backgroundColor: '#000', color: '#fff', padding: '40px 64px', marginTop: 40 }}>
      <Row gutter={[32, 32]}>
        {/* Logo */}
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 16 }}>
            <img
              src="../image/logo_trang.png"
              alt="Tuly Shoe"
              style={{ height: 100, width: 'auto', display: 'block', marginBottom: 40 }}
            />
            <Text style={{ color: '#ccc', display: 'block' }}>
              Phong cách đỉnh cao, chất lượng vượt trội.
            </Text>
          </div>
        </Col>

        {/* Thông tin liên hệ */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>Liên hệ</Title>
          <Text style={{ display: 'block', color: '#ccc' }}>Hotline: 1900 1234</Text>
          <Text style={{ display: 'block', color: '#ccc' }}>Email: support@tulyshoe.vn</Text>
          <Text style={{ display: 'block', color: '#ccc' }}>Địa chỉ: 123 Đường Thời Trang, TP.HCM</Text>
        </Col>

        {/* Điều hướng nhanh */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>Danh mục</Title>
          <Space direction="vertical">
            <Link style={{ color: '#ccc' }} href="#">Nike</Link>
            <Link style={{ color: '#ccc' }} href="#">Adidas</Link>
            <Link style={{ color: '#ccc' }} href="#">Hãng khác</Link>
            <Link style={{ color: '#ccc' }} href="#">Bán chạy</Link>
          </Space>
        </Col>

        {/* Bản quyền */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>TULY SHOE</Title>
          <Text style={{ color: '#ccc' }}>
            © {new Date().getFullYear()} TULY Shoe. Đã đăng ký bản quyền.
          </Text>
        </Col>
      </Row>
    </AntFooter>
  )
}

export default Footer  
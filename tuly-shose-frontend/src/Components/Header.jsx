import React from 'react'
import { Layout, Menu, Row, Col, Typography, Space } from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'


const { Header: AntHeader } = Layout
const { Text } = Typography

const Header = () => {
  return (
    <>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: '#D9D9D9', // Tailwind gray-100
          color: '#9ca3af', // Tailwind gray-400
          fontSize: 10,
          fontStyle: 'italic',
          fontWeight: 400,
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 24,
          position: 'relative',
          padding: '0 16px',
        }}
      >
        <Text strong style={{ fontWeight: '700' }}>
          "Giày đẹp – Phong cách đỉnh!"
        </Text>
        <Text
          style={{
            position: 'absolute',
            right: 16,
            fontSize: 12,
            color: '#4b5563', // Tailwind gray-700
            fontStyle: 'normal',
            userSelect: 'none',
          }}
          className="top-bar-right-text"
        >
          Chào buổi sáng! Dương Văn Lực
        </Text>
      </div>

      {/* Main header */}
      <AntHeader
        style={{
          backgroundColor: 'white',
          padding: '8px 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)',
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="../image/logo_den.png"
            alt="Tuly Shoe logo with black shoe icon and text Tuly Shoe below it"
            style={{ height: 50, width: 'auto' }}
          />
        </div>

        {/* Menu */}
        <Menu
          mode="horizontal"
          selectable={false}
          style={{
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 14,
            borderBottom: 'none',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
          items={[
            { key: 'nike', label: 'NIKE' },
            { key: 'adidas', label: 'ADIDAS' },
            { key: 'other', label: 'HÃNG KHÁC' },
            { key: 'bestseller', label: 'BÁN CHẠY' },
          ]}
          overflowedIndicator={null}
        />

        {/* Icons */}
        <Space size="large" style={{ color: 'black', fontSize: 25 }}>
          <SearchOutlined style={{ cursor: 'pointer' }} aria-label="Search" />
          <ShoppingCartOutlined
            style={{ cursor: 'pointer' }}
            aria-label="Shopping cart"
          />
        </Space>
      </AntHeader>
    </>
  )
}

export default Header
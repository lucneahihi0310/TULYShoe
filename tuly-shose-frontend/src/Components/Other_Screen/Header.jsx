import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Space } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const slogans = [
    'Giày đẹp – Phong cách đỉnh!',
    'Phong cách bắt đầu từ đôi chân!',
    'TULY Shoes – Bước đi chất lượng!',
    'Thời trang từ từng bước chân!',
    'Mỗi bước đi là một phong cách!',
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  // Auto chuyển slogan
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Chuyển slogan thủ công khi click
  const handleClickSlogan = () => {
    setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
  };

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: '#D9D9D9',
          color: '#9ca3af',
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
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={handleClickSlogan}
        title="Nhấn để đổi slogan"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSloganIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute' }}
          >
            <Text strong style={{ fontWeight: '700' }}>
              {slogans[currentSloganIndex]}
            </Text>
          </motion.div>
        </AnimatePresence>

        <Text
          style={{
            position: 'absolute',
            right: 16,
            fontSize: 12,
            color: '#4b5563',
            fontStyle: 'normal',
            userSelect: 'none',
          }}
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
          borderBottom: '1px solid #e5e7eb',
          marginBottom: 20,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <img
            src="../../image/logo_den.png"
            alt="Tuly Shoe logo"
            style={{ height: 50, width: 'auto' }}
          />
        </div>

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

        <Space size="large" style={{ color: 'black', fontSize: 25 }}>
          <SearchOutlined style={{ cursor: 'pointer' }} />
          <ShoppingCartOutlined style={{ cursor: 'pointer' }} />
        </Space>
      </AntHeader>
    </>
  );
};

export default Header;

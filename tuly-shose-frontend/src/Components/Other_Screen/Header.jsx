import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Space,
  Dropdown,
  Button,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../API/AuthContext";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const slogans = [
    "Giày đẹp – Phong cách đỉnh!",
    "Phong cách bắt đầu từ đôi chân!",
    "TULY Shoes – Bước đi chất lượng!",
    "Thời trang từ từng bước chân!",
    "Mỗi bước đi là một phong cách!",
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClickSlogan = () => {
    setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 17) return "Chào buổi trưa";
    if (hour >= 17 && hour < 21) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <ProfileOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#D9D9D9",
          fontSize: 10,
          fontStyle: "italic",
          fontWeight: 400,
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 24,
          padding: "0 16px",
        }}
      >
        <div
          style={{
            flex: 1,
            cursor: "pointer",
            color: "#9ca3af",
            textAlign: "center",
            marginLeft: 68,
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
            >
              <Text strong style={{ fontWeight: "700" }}>
                {slogans[currentSloganIndex]}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ fontSize: 12 }}>
          {user ? (
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomRight"
              trigger={["hover"]}
            >
              <Text
                style={{
                  color: "#4b5563",
                  fontStyle: "normal",
                  cursor: "pointer",
                }}
              >
                {getGreeting()} {user.first_name + " " + user.last_name}!
              </Text>
            </Dropdown>
          ) : (
            <Button
              icon={<UserOutlined />}
              size="small"
              style={{
                backgroundColor: "#D9D9D9",
                borderColor: "#D9D9D9",
                fontWeight: 600,
                color: "#4b5563",
              }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>

      {/* Main header */}
      <AntHeader
        style={{
          backgroundColor: "white",
          padding: "8px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <img
            src="../../image/logo_den.png"
            alt="Tuly Shoe logo"
            style={{ height: 50, width: "auto", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>

        <Menu
          mode="horizontal"
          selectable={false}
          style={{
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 14,
            borderBottom: "none",
            flex: 1,
            justifyContent: "center",
            backgroundColor: "white",
          }}
          items={[
            { key: "nike", label: "NIKE" },
            { key: "adidas", label: "ADIDAS" },
            { key: "other", label: "HÃNG KHÁC" },
            { key: "bestseller", label: "BÁN CHẠY" },
          ]}
          onClick={({ key }) => {
            if (key === "other") {
              navigate("/products");
            }
          }}
          overflowedIndicator={null}
        />

        <Space size="large" style={{ color: "black", fontSize: 25 }}>
          <SearchOutlined style={{ cursor: "pointer" }} />
          <ShoppingCartOutlined
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/cart")}
          />
        </Space>
      </AntHeader>
    </div>
  );
};

export default Header;
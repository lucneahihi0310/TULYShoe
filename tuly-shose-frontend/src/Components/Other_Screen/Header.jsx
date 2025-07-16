import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Layout,
  Menu,
  Typography,
  Space,
  Dropdown,
  Button,
  Grid,
  Badge,
  Drawer,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../API/AuthContext";
import { fetchData } from "../API/ApiService";
import styles from "../../CSS/Header.module.css";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slogans = [
    "Giày đẹp – Phong cách đỉnh!",
    "Phong cách bắt đầu từ đôi chân!",
    "TULY Shoes – Bước đi chất lượng!",
    "Thời trang từ từng bước chân!",
    "Mỗi bước đi là một phong cách!",
  ];
  const location = useLocation();
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const userRole = user?.role;

  const screens = Grid.useBreakpoint();

  const navItems = [
    { key: "products", label: "SẢN PHẨM" },
    { key: "sale", label: "ĐANG SALE" },
    { key: "info", label: "THÔNG TIN" },
    { key: "instruct", label: "HƯỚNG DẪN" },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "products") {
      navigate("/products");
    } else if (key === "sale") {
      navigate("/productsbyonsale");
    } else if (key === "info") {
      navigate("/aboutus");
    } else if (key === "instruct") {
      navigate("/instruct");
    }

    setIsDrawerOpen(false);
  };

  const selectedKey = (() => {
    if (location.pathname.startsWith("/productsbyonsale")) return "sale";
    if (location.pathname.startsWith("/products")) return "products";
    if (location.pathname.startsWith("/aboutus")) return "info";
    if (location.pathname.startsWith("/instruct")) return "instruct";
    return "";
  })();

  const fetchCartCount = useCallback(async () => {
    if (user) {
      try {
        const data = await fetchData(
          `cartItem/customers/user/${user._id}`,
          true
        );
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const total = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  }, [user]);

  useEffect(() => {
    fetchCartCount();
    const handleCartUpdated = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, [fetchCartCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.dispatchEvent(
      new StorageEvent("storage", { key: "token", newValue: null })
    );
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <ProfileOutlined />,
      onClick: () => navigate("/profileUser"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "Chào buổi sáng";
    if (hour < 13) return "Chào buổi trưa";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div
          onClick={() => setCurrentSloganIndex((i) => (i + 1) % slogans.length)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSloganIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className={styles.slogan}
            >
              <Text strong>{slogans[currentSloganIndex]}</Text>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.greeting}>
          {user ? (
            <Dropdown menu={{ items: menuItems }} trigger={["hover"]}>
              <Text className={styles.greetingText}>
                {getGreeting()} {user.last_name}!
              </Text>
            </Dropdown>
          ) : (
            <Button
              icon={<UserOutlined />}
              size="small"
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>

      {/* Main header */}
      {userRole !== "staff" && userRole !== "manager" && (
        <AntHeader className={styles.mainHeader}>
          <div className={styles.logo} onClick={() => navigate("/")}>
            <img src="../../image/logo_den.png" alt="Logo" />
          </div>

          {screens.md ? (
            <Menu
              mode="horizontal"
              className={styles.menu}
              selectedKeys={[selectedKey]}
              selectable={false}
              items={navItems}
              onClick={handleMenuClick}
            />
          ) : (
            <MenuOutlined
              className={styles.menuIcon}
              onClick={() => setIsDrawerOpen(true)}
            />
          )}

          <Space size="large">
            <SearchOutlined
              className={styles.icon}
              onClick={() => navigate("/order-search")}
            />
            <Badge count={cartCount} showZero>
              <ShoppingCartOutlined
                className={styles.icon}
                onClick={() => navigate("/cart")}
              />
            </Badge>
          </Space>
        </AntHeader>
      )}
      <Drawer
        title="Danh mục"
        placement="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Menu
          mode="vertical"
          onClick={handleMenuClick}
          selectedKeys={[selectedKey]}
          items={[
            ...navItems,
            { type: "divider" },
            ...(!user
              ? [
                  {
                    key: "login",
                    label: "Đăng nhập",
                    icon: <UserOutlined />,
                    onClick: () => {
                      setIsDrawerOpen(false);
                      navigate("/login");
                    },
                  },
                ]
              : [
                  {
                    key: "profile",
                    label: "Thông tin cá nhân",
                    icon: <ProfileOutlined />,
                    onClick: () => {
                      setIsDrawerOpen(false);
                      navigate("/profile");
                    },
                  },
                  {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogoutOutlined />,
                    onClick: () => {
                      setIsDrawerOpen(false);
                      handleLogout();
                    },
                  },
                ]),
          ]}
        />
      </Drawer>
    </div>
  );
};

export default Header;

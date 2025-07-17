import React, { useState, useEffect, useContext } from "react";
import { Layout, Menu, Tabs } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import styles from "../../CSS/Profile.module.css";
import { AuthContext } from "../API/AuthContext";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [ordersList, setOrdersList] = useState([]);
  const [reviews, setReviews] = useState({});
  const { user } = useContext(AuthContext);

  const formatCurrency = (vnd) => {
    return vnd.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsPasswordModalVisible(false);
        setIsOrderModalVisible(false);
        setReviews({});
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={`${styles.appContainer} ${styles.fadeIn}`}>
      <Layout className={styles.layout}>
        <Sider
          width={192}
          className={styles.sider}
          breakpoint="md"
          collapsedWidth="0"
        >
          <Menu
            mode="vertical"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            className={styles.menu}
            items={[
              {
                key: "profile",
                icon: <UserOutlined />,
                label: "Thông Tin Cá Nhân",
              },
              {
                key: "orders",
                icon: <ShoppingCartOutlined />,
                label: "Đơn Hàng Đã Đặt",
              },
            ]}
          />
        </Sider>
        <Content className={styles.content}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "profile",
                label: "Thông Tin Cá Nhân",
                children: (
                  <ProfileSection
                    user={user}
                    avatar={avatar}
                    setAvatar={setAvatar}
                    setIsPasswordModalVisible={setIsPasswordModalVisible}
                    isPasswordModalVisible={isPasswordModalVisible}
                  />
                ),
              },
              {
                key: "orders",
                label: "Đơn Hàng Đã Đặt",
                children: (
                  <OrdersSection
                    user={user}
                    ordersList={ordersList}
                    setOrdersList={setOrdersList}
                    setIsOrderModalVisible={setIsOrderModalVisible}
                    isOrderModalVisible={isOrderModalVisible}
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    reviews={reviews}
                    setReviews={setReviews}
                    formatCurrency={formatCurrency}
                  />
                ),
              },
            ]}
          />
        </Content>
      </Layout>
    </div>
  );
};

export default Profile;
import React from "react";
import { Button, Result, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../CSS/OrderSuccess.module.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderCode = location.state?.order_code || new URLSearchParams(location.search).get("order_code") || sessionStorage.getItem("order_code");

  const handleViewOrder = () => {
    if (orderCode) {
      navigate(`/orderdetail/${orderCode}`);
      sessionStorage.removeItem("order_code");
    } else {
      message.error("Không tìm thấy mã đơn hàng.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.resultContainer}>
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Cảm ơn bạn đã mua sắm tại TULY Shoe. Đơn hàng của bạn sẽ được xử lý và giao trong thời gian sớm nhất."
          extra={[
            <Button key="home" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>,
            <Button key="orders" type="primary" onClick={handleViewOrder}>
              Xem đơn hàng
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default OrderSuccess;
import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "../../CSS/OrderSuccess.module.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.resultContainer}>
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Cảm ơn bạn đã mua sắm tại TULY Shoe. Đơn hàng của bạn sẽ được xử lý và giao trong thời gian sớm nhất."
          extra={[
            <Button  key="home" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>,
            <Button key="orders" onClick={() => navigate("/my-orders")}>
              Xem đơn hàng
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default OrderSuccess;

import React from "react";
import { Button, Result, message } from "antd";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "../../CSS/OrderSuccess.module.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderCodeFromState = location.state?.order_code;
  const orderCodeFromQuery = searchParams.get("order_code");
  const orderCodeFromSession = sessionStorage.getItem("order_code");

  // Ưu tiên lấy order_code theo thứ tự: state > query > session
  const orderCode =
    orderCodeFromState || orderCodeFromQuery || orderCodeFromSession;

  const handleViewOrder = () => {
    if (orderCode) {
      navigate(`/orderdetail/${orderCode}`); // Sử dụng route /orderdetail
      if (orderCodeFromSession) sessionStorage.removeItem("order_code"); // Xóa session nếu dùng
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
            orderCode ? (
              <Button key="orders" type="primary" onClick={handleViewOrder}>
                Xem đơn hàng
              </Button>
            ) : null,
          ]}
        />
      </div>
    </div>
  );
};

export default OrderSuccess;

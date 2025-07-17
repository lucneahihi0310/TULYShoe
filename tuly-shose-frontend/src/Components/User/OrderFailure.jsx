import React from "react";
import { Button, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../CSS/OrderFailure.module.css";

const OrderFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = {
    checksum_failed: "Lỗi xác minh giao dịch. Vui lòng liên hệ hỗ trợ.",
    server_error: "Lỗi máy chủ. Vui lòng thử lại sau.",
    default: "Giao dịch không thành công hoặc đã bị hủy.",
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.resultContainer}>
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle={errorMessage[error] || errorMessage.default}
          extra={[
            <Button key="retry" type="primary" onClick={() => navigate("/")}>
              Quay về trang chủ
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default OrderFailure;

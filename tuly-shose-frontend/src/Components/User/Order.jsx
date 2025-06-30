import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Checkbox,
  Radio,
  Button,
  Tooltip,
  Modal,
  message,
  InputNumber,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "../../CSS/Order.module.css";
import { AuthContext } from "../API/AuthContext";
import { useLocation } from "react-router-dom";

const Order = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [shippingFee, setShippingFee] = useState(0);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNote, setOrderNote] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    const normalized = userInfo.address?.toLowerCase() || "";
    if (normalized.includes("hà nội")) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [userInfo.address]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch("http://localhost:9999/account/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserInfo({
            fullName: `${data.first_name} ${data.last_name}`,
            phone: data.phone,
            email: data.email,
            address: data.address,
          });
          console.log(data);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };
    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.fromCart && location.state.orderItems) {
        const enrichedItems = await Promise.all(
          location.state.orderItems.map(async (item) => {
            try {
              const res = await fetch(
                `http://localhost:9999/productDetail/${item.pdetail_id}`
              );
              const data = await res.json();
              return {
                pdetail_id: item.pdetail_id,
                quantity: item.quantity,
                image: data.images[0],
                size_name: data.size_id?.size_name,
                color_code: data.color_id[0]?.color_code,
                productName: data.product_id?.productName,
                price_after_discount: data.price_after_discount,
              };
            } catch (err) {
              console.error("Lỗi lấy chi tiết sản phẩm:", err);
              return null;
            }
          })
        );

        setOrderItems(enrichedItems.filter(Boolean));
      } else if (location.state?.fromDetail && location.state.orderItems) {
        // Đã xử lý sẵn từ Detail
        const item = location.state.orderItems[0];
        const res = await fetch(
          `http://localhost:9999/productDetail/${item.pdetail_id}`
        );
        const data = await res.json();
        setOrderItems([
          {
            pdetail_id: item.pdetail_id,
            quantity: 1,
            image: data.images[0],
            size_name: data.size_id?.size_name,
            color_code: data.color_id[0]?.color_code,
            productName: data.product_id?.productName,
            price_after_discount: data.price_after_discount,
          },
        ]);
      }
    };

    fetchData();
  }, [location]);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price_after_discount,
    0
  );

  const estimatedDeliveryDate = () => {
    const date = new Date();
    const isHanoi = userInfo.address?.toLowerCase().includes("hà nội");
    date.setDate(date.getDate() + (isHanoi ? 3 : 5));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOrderSubmit = async () => {
    if (orderItems.length === 0) {
      return message.warning("Không có sản phẩm để đặt hàng.");
    }

    if (paymentMethod === "cod") {
      Modal.confirm({
        title: "Xác nhận đặt hàng",
        content: "Bạn có chắc chắn muốn đặt hàng với phương thức COD?",
        okText: "Xác nhận",
        icon: <QuestionCircleOutlined />,
        cancelButtonProps: { style: { display: "none" } },
        closable: true,
        async onOk() {
          try {
            const res = await fetch("http://localhost:9999/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  localStorage.getItem("token") ||
                  sessionStorage.getItem("token")
                    ? `Bearer ${
                        localStorage.getItem("token") ||
                        sessionStorage.getItem("token")
                      }`
                    : "",
              },
              body: JSON.stringify({
                user_id: user._id || null,
                orderItems: orderItems.map((item) => ({
                  pdetail_id: item.pdetail_id,
                  quantity: item.quantity,
                  price_after_discount: item.price_after_discount,
                  productName: item.productName,
                  size_name: item.size_name,
                })),
                userInfo,
                paymentMethod,
                orderNote,
                shippingFee,
              }),
            });

            const data = await res.json();
            if (res.ok) {
              message.success("Đặt hàng thành công!");
              window.dispatchEvent(new Event("cartUpdated"));

              if (!user) {
                localStorage.removeItem("guest_cart");
                sessionStorage.removeItem("guest_cart");
              }

              navigate("/order-success");
            } else {
              message.error(data.message || "Đặt hàng thất bại");
            }
          } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            message.error("Lỗi kết nối đến server.");
          }
        },
      });
    } else {
      Modal.confirm({
        title: "Xác nhận đặt hàng",
        content: "Bạn có chắc chắn muốn đặt hàng với phương thức VNPAY?",
        okText: "Xác nhận",
        icon: <QuestionCircleOutlined />,
        cancelButtonProps: { style: { display: "none" } }, 
        closable: true, 
        async onOk() {
          try {
            const res = await fetch("http://localhost:9999/vnpay/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user?._id || null,
                orderItems: orderItems.map((item) => ({
                  pdetail_id: item.pdetail_id,
                  quantity: item.quantity,
                  price_after_discount: item.price_after_discount,
                  productName: item.productName,
                  size_name: item.size_name,
                })),
                userInfo,
                shippingFee,
                amount: totalAmount,
                paymentMethod: "online",
              }),
            });

            const data = await res.json();

            if (res.ok && data.paymentUrl) {
              window.location.href = data.paymentUrl;
              window.dispatchEvent(new Event("cartUpdated"));
            } else {
              message.error("Không thể tạo liên kết thanh toán.");
            }
          } catch (err) {
            console.error("Lỗi khi gọi VNPay:", err);
            message.error("Lỗi kết nối đến VNPay.");
          }
        },
      });
    }
  };

  return (
    <main className={`${styles.main} ${styles.fadeIn}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Đặt hàng tại TULY Shoe</h2>
        <div className={styles.content}>
          <section className={styles.formSection}>
            <form className={styles.form}>
              <h3 className={styles.sectionTitle}>Thông tin giao hàng</h3>
              <Input
                placeholder="Họ tên"
                className={styles.input}
                value={userInfo.fullName}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />

              <Input
                placeholder="Số điện thoại"
                className={styles.input}
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
              />

              <Input
                placeholder="Email"
                className={styles.input}
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <Input
                placeholder="Địa chỉ"
                className={styles.input}
                value={userInfo.address}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, address: e.target.value }))
                }
              />

              <h3 className={styles.sectionTitle}>Ghi chú đơn hàng</h3>
              <Input.TextArea
                rows={3}
                className={styles.input}
                placeholder="Giao buổi sáng, gọi trước khi đến..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />

              <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={styles.radioGroup}
              >
                <Radio value="cod" className={styles.radio}>
                  Thanh toán khi giao hàng (COD)
                </Radio>
                <Radio value="online" className={styles.radio}>
                  Thanh toán trực tuyến
                </Radio>
              </Radio.Group>
            </form>
          </section>

          <aside className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>
            <div className={styles.summaryItems}>
              {orderItems.map((item, idx) => (
                <div className={styles.product} key={idx}>
                  <div className={styles.productInfo}>
                    <img src={item.image} className={styles.productImage} />
                    <div>
                      <p className={styles.productName}>{item.productName}</p>
                      <p className={styles.productDetail}>
                        Size: {item.size_name}
                      </p>
                      <div className={styles.colorDotWrapper}>
                        <span>Màu:</span>
                        <span
                          style={{
                            backgroundColor: item.color_code,
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            marginLeft: "6px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <p className={styles.productPriceLine}>
                        Giá: {item.price_after_discount.toLocaleString()} ₫
                      </p>
                      <div className={styles.productQtyWrapper}>
                        <span>Số lượng:</span>
                        <InputNumber
                          min={1}
                          max={99}
                          value={item.quantity}
                          disabled={!!location.state?.cartItems}
                          onChange={(val) => {
                            if (!location.state?.cartItems) {
                              setOrderItems((prev) =>
                                prev.map((itm, i) =>
                                  i === idx ? { ...itm, quantity: val } : itm
                                )
                              );
                            }
                          }}
                          className={styles.qtyInput}
                          size="small"
                          style={{ marginLeft: 8 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.productPrice}>
                    {(
                      item.price_after_discount * item.quantity
                    ).toLocaleString()}{" "}
                    ₫
                  </div>
                </div>
              ))}
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Đơn hàng</span>
                <span>{totalAmount.toLocaleString()} ₫</span>
              </div>
              <div className={styles.summaryRowSecondary}>
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()} ₫</span>
              </div>

              <div className={styles.summaryRowSecondary}>
                <span>Ngày giao dự kiến</span>
                <span>
                  {estimatedDeliveryDate()} (
                  {userInfo.address?.toLowerCase().includes("hà nội")
                    ? "3"
                    : "5"}{" "}
                  ngày)
                </span>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.total}>
              <span>TỔNG CỘNG</span>
              <span>{(totalAmount + shippingFee).toLocaleString()} ₫</span>
            </div>

            <Button className={styles.submitButton} onClick={handleOrderSubmit}>
              HOÀN TẤT ĐẶT HÀNG
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Order;

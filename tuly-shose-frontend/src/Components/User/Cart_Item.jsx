import React, { useEffect, useState, useContext } from "react";
import { Table, Button, InputNumber, Modal, notification } from "antd";
import { AuthContext } from "../API/AuthContext";
import styles from "../../CSS/CartItem.module.css";
import { useNavigate } from "react-router-dom";
import {
  fetchData,
  updateData,
  deleteData as deleteAPI,
} from "../API/ApiService";

notification.config({ placement: "bottomLeft" });

function CartItem() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await fetchData(
          `cartItem/customers/user/${user._id}`,
          true
        );
        const mapped = data.map((item) => ({
          _id: item._id,
          pdetail_id: item.pdetail_id,
          quantity: item.quantity,
          price_after_discount: item.pdetail_id.price_after_discount,
          image: item.pdetail_id.images[0],
          size_name: item.pdetail_id.size_id?.size_name,
          color_code: item.pdetail_id.color_id?.color_code,
          productName: item.pdetail_id.product_id?.productName,
          title: item.pdetail_id.product_id?.title,
          inventory_number: item.pdetail_id.inventory_number,
        }));
        setCartItems(mapped);
      } else {
        const guest = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        const details = await Promise.all(
          guest.map(async (item) => {
            try {
              const data = await fetchData(
                `productDetail/customers/${item.pdetail_id}`
              );
              return {
                _id: item.pdetail_id,
                pdetail_id: item.pdetail_id,
                quantity: item.quantity,
                price_after_discount: data.price_after_discount,
                image: data.images[0],
                size_name: data.size_id?.size_name,
                color_code: data.color_id?.color_code,
                productName: data.product_id?.productName,
                title: data.product_id?.title,
                inventory_number: data.inventory_number,
              };
            } catch (err) {
              console.error("Lỗi lấy chi tiết:", item.pdetail_id, err);
              return null;
            }
          })
        );
        setCartItems(details.filter(Boolean));
      }
    } catch (e) {
      console.error("Lỗi khi lấy giỏ hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const onQuantityChange = async (record, newQty) => {
    if (record.inventory_number === 0) {
      notification.error({
        message: "Sản phẩm đã hết hàng, không thể thay đổi số lượng!",
      });
      return;
    }
    if (newQty === 0) {
      setSelectedRecord(record);
      setIsModalVisible(true);
    } else {
      if (user) {
        await updateData(
          "/cartItem/customers",
          record._id,
          { quantity: newQty },
          true
        );
      } else {
        let guest = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        guest = guest.map((item) =>
          item.pdetail_id === record._id ? { ...item, quantity: newQty } : item
        );
        localStorage.setItem("guest_cart", JSON.stringify(guest));
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === record._id ? { ...item, quantity: newQty } : item
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
      notification.success({ message: "Cập nhật số lượng!" });
    }
  };

  const handleDelete = async () => {
    if (selectedRecord) {
      if (user) {
        await deleteAPI("/cartItem/customers", selectedRecord._id, true);
      } else {
        let guest = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        guest = guest.filter((item) => item.pdetail_id !== selectedRecord._id);
        localStorage.setItem("guest_cart", JSON.stringify(guest));
      }

      setCartItems((prev) =>
        prev.filter((item) => item._id !== selectedRecord._id)
      );
      window.dispatchEvent(new Event("cartUpdated"));
      notification.success({ message: "Đã xóa khỏi giỏ hàng!" });
      setIsModalVisible(false);
    }
  };

  const handleCheckout = () => {
    const outOfStockItems = cartItems.filter(
      (item) => item.inventory_number === 0
    );
    if (outOfStockItems.length > 0) {
      const outOfStockNames = outOfStockItems
        .map((item) => item.productName)
        .join(", ");
      notification.error({
        message: "Có sản phẩm hết hàng!",
        description: `Vui lòng xóa các sản phẩm hết hàng: ${outOfStockNames} trước khi thanh toán.`,
      });
      return;
    }
    navigate("/order", {
      state: {
        fromCart: true,
        orderItems: cartItems.map((item) => ({
          pdetail_id: item.pdetail_id._id || item.pdetail_id,
          quantity: item.quantity,
        })),
      },
    });
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "",
      key: "product",
      render: (record) => (
        <div
          className={`${styles.productContainer} ${
            record.inventory_number === 0 ? styles.outOfStock : ""
          }`}
        >
          <div className={styles.imageWrapper}>
            <img
              src={record.image}
              alt={record.productName}
              className={styles.productImage}
            />
            {record.inventory_number === 0 && (
              <div className={styles.outOfStockBadge}>Hết hàng</div>
            )}
          </div>
          <div>
            <h3 className={styles.productName}>{record.productName}</h3>
            <p className={styles.productDescription}>{record.title}</p>
            <p className={styles.productSize}>Size: {record.size_name}</p>
            <div className={styles.colorWrapper}>
              <span className={styles.colorLabel}>Màu:</span>
              <span
                className={styles.colorDot}
                style={{ backgroundColor: record.color_code }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price_after_discount",
      key: "price",
      align: "center",
      render: (value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (qty, record) => (
        <InputNumber
          min={0}
          value={qty}
          className={
            record.inventory_number === 0
              ? styles.quantityInputDisabled
              : styles.quantityInput
          }
          onChange={(val) => onQuantityChange(record, val)}
          disabled={record.inventory_number === 0}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      align: "center",
      render: (_, rec) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(rec.price_after_discount * rec.quantity),
    },
    {
      title: "Xóa",
      key: "remove",
      align: "center",
      render: (_, rec) => (
        <Button
          type="text"
          icon={<i className={`fa-solid fa-trash ${styles.removeIcon}`} />}
          onClick={() => {
            setSelectedRecord(rec);
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price_after_discount * i.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  return (
    <main className={`${styles.main} ${styles.fadeIn}`}>
      <h2 className={styles.title}>Giỏ hàng của bạn</h2>
      <div className={styles.cartContainer}>
        <section className={styles.cartSection}>
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={false}
            className={styles.cartTable}
            rowClassName={styles.tableRow}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", color: "#999" }}>
                  <i
                    className="bi bi-database-fill-slash"
                    style={{
                      fontSize: "40px",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  />
                  <div>Không có sản phẩm trong giỏ hàng</div>
                </div>
              ),
            }}
          />
        </section>
        <aside className={styles.orderSummary}>
          <h3 className={styles.summaryTitle}>Tổng cộng giỏ hàng</h3>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span>Tạm tính</span>
              <span>
                {subtotal.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>Phí Ship (tạm tính)</span>
              <span>
                {shipping.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.total}>
              <span>Tổng</span>
              <span>
                {total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
          <Button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Thanh toán
          </Button>
        </aside>
      </div>

      <Modal
        title="Xóa sản phẩm?"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            danger
            style={{ width: "100%" }}
            onClick={handleDelete}
          >
            Xóa
          </Button>,
        ]}
        closable
        centered
        className={styles.customModal}
      >
        <p>
          Bạn có muốn xóa "<strong>{selectedRecord?.productName}</strong>" khỏi
          giỏ hàng?
        </p>
      </Modal>
    </main>
  );
}

export default CartItem;

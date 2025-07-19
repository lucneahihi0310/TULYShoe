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
          pdetail_id: item.pdetail_id._id || item.pdetail_id,
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
      notification.error({
        message: "Lỗi tải giỏ hàng",
        description: "Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    const handleCartUpdate = () => {
      console.log("Sự kiện cartUpdated được kích hoạt");
      fetchCartItems();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user]);

  const onQuantityChange = async (record, newQty) => {
    if (newQty === null || newQty === undefined) {
      console.log("Số lượng không hợp lệ, bỏ qua:", newQty);
      return;
    }

    if (record.inventory_number === 0) {
      notification.error({
        message: "Sản phẩm đã hết hàng!",
        description: `Sản phẩm "${record.productName}" hiện không còn trong kho.`,
        placement: "bottomLeft",
      });
      return;
    }

    if (newQty > record.inventory_number) {
      notification.error({
        message: "Số lượng vượt quá tồn kho!",
        description: `Sản phẩm "${record.productName}" chỉ còn ${record.inventory_number} sản phẩm trong kho.`,
        placement: "bottomLeft",
      });
      return;
    }

    if (newQty === 0) {
      setSelectedRecord(record);
      setIsModalVisible(true);
      return;
    }

    try {
      // Cập nhật state cục bộ trước để cải thiện UX
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === record._id ? { ...item, quantity: newQty } : item
        )
      );

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
          item.pdetail_id === record.pdetail_id
            ? { ...item, quantity: newQty }
            : item
        );
        localStorage.setItem("guest_cart", JSON.stringify(guest));
      }

      // Không kích hoạt cartUpdated để tránh gọi lại fetchCartItems
      notification.success({ message: "Cập nhật số lượng thành công!" });
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      // Khôi phục state nếu API thất bại
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === record._id
            ? { ...item, quantity: record.quantity }
            : item
        )
      );
      notification.error({
        message: "Lỗi cập nhật số lượng",
        description: error.message || "Vui lòng thử lại.",
      });
      // Gọi lại fetchCartItems để đồng bộ nếu có lỗi
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleDelete = async () => {
    if (selectedRecord) {
      try {
        if (user) {
          await deleteAPI("/cartItem/customers", selectedRecord._id, true);
        } else {
          let guest = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          guest = guest.filter(
            (item) => item.pdetail_id !== selectedRecord.pdetail_id
          );
          localStorage.setItem("guest_cart", JSON.stringify(guest));
        }

        setCartItems((prev) =>
          prev.filter((item) => item._id !== selectedRecord._id)
        );
        window.dispatchEvent(new Event("cartUpdated"));
        notification.success({ message: "Đã xóa khỏi giỏ hàng!" });
        setIsModalVisible(false);
      } catch (error) {
        notification.error({
          message: "Lỗi xóa sản phẩm",
          description: error.message || "Vui lòng thử lại.",
        });
      }
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
        placement: "bottomLeft",
      });
      return;
    }

    const overStockItems = cartItems.filter(
      (item) => item.quantity > item.inventory_number
    );
    if (overStockItems.length > 0) {
      const overStockNames = overStockItems
        .map(
          (item) =>
            `${item.productName} (yêu cầu: ${item.quantity}, kho: ${item.inventory_number})`
        )
        .join(", ");
      notification.error({
        message: "Số lượng vượt quá tồn kho!",
        description: `Vui lòng điều chỉnh số lượng cho: ${overStockNames}.`,
        placement: "bottomLeft",
      });
      return;
    }

    navigate("/order", {
      state: {
        fromCart: true,
        orderItems: cartItems.map((item) => ({
          pdetail_id: item.pdetail_id,
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
          onClick={() => navigate(`/products/${record.pdetail_id}`)}
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
          max={record.inventory_number}
          className={
            record.inventory_number === 0
              ? styles.quantityInputDisabled
              : styles.quantityInput
          }
          onChange={(val) => onQuantityChange(record, val)}
          disabled={record.inventory_number === 0}
          onPressEnter={(e) => e.preventDefault()}
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

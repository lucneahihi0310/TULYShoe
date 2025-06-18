import React from "react";
import {
  Button,
  InputNumber,
  Input,
  Select,
  Typography,
  Row,
  Col,
  Divider,
  Carousel,
} from "antd";
import { HeartOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "../../CSS/CartItem.module.css";

const { Title, Text } = Typography;

const CartItem = ({ image, title, price, size, quantity, total, inStock }) => (
  <div className={styles.cartItem}>
    <img src={image} alt={title} className={styles.itemImage} />
    <div className={styles.itemDetails}>
      <Text strong className={styles.itemTitle}>
        {title}
      </Text>
      <Text type="secondary" className={styles.itemPrice}>
        Giá: {price}
      </Text>
      <div className={styles.itemOptions}>
        <div>
          <Text strong>Size</Text>
          <Select defaultValue={size} className={styles.select}>
            <Select.Option value={size}>{size}</Select.Option>
          </Select>
        </div>
        <div>
          <Text strong>Số lượng</Text>
          <InputNumber
            min={1}
            max={99}
            value={quantity}
            // onChange={setQuantity}
            className={styles.inputNumber}
          />
        </div>
      </div>
    </div>
    <div className={styles.itemActions}>
      <Text strong className={styles.itemTotal}>
        {total}
      </Text>
      <Text className={styles.inStock}>{inStock}</Text>
      <Button
        icon={<DeleteOutlined />}
        className={styles.actionButton}
        danger
      />
    </div>
  </div>
);

const CartPage = () => {
  const suggestedItems = [
    {
      image:
        "https://storage.googleapis.com/a1aa/image/0cebac6f-6e3b-4eba-3d70-6f295c9a4b84.jpg",
      title: "Die-cut Insoles - Ananas Ortholite 7mm RF White Asparagus",
      price: "69.000 VND",
    },
    {
      image:
        "https://storage.googleapis.com/a1aa/image/beee7d8a-8d4d-4d06-371c-851df362953b.jpg",
      title: "Crew Socks - Ananas Typo Snow White",
      price: "95.000 VND",
    },
  ];

  const cartItems = [
    {
      image:
        "https://storage.googleapis.com/a1aa/image/0cebac6f-6e3b-4eba-3d70-6f295c9a4b84.jpg",
      title: "Die-cut Insoles - Ananas Ortholite 7mm RF - White Asparagus",
      price: "69.000 VND",
      size: "S",
      quantity: 10,
      total: "690.000 VND",
      inStock: "Còn hàng",
    },
    {
      image:
        "https://storage.googleapis.com/a1aa/image/5205b619-72b1-44d0-a969-8104e3895e09.jpg",
      title: "Vintas Vivu - Low Top - Warm Sand",
      price: "620.000 VND",
      size: "36.5",
      quantity: 2,
      total: "1.240.000 VND",
      inStock: "Còn hàng",
    },
  ];

  return (
    <div className={styles.container}>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          {/* Suggested Items */}
          <section className={styles.section}>
            <Title level={5} className={styles.sectionTitle}>
              BẠN CÓ CẦN THÊM?
            </Title>
            <Carousel arrows>
              {suggestedItems.map((item, index) => (
                <div key={index} className={styles.suggestedItem}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.suggestedImage}
                  />
                  <div className={styles.suggestedDetails}>
                    <Text strong className={styles.suggestedTitle}>
                      {item.title}
                    </Text>
                    <Text className={styles.suggestedPrice}>{item.price}</Text>
                    <Button type="primary" className={styles.addButton}>
                      THÊM
                    </Button>
                  </div>
                </div>
              ))}
            </Carousel>
          </section>

          {/* Cart Items */}
          <section
            style={{ borderBottom: "1px solid #000" }}
            className={styles.section}
          >
            <Title level={5} className={styles.sectionTitle}>
              GIỎ HÀNG
            </Title>
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <CartItem {...item} />
                {index < cartItems.length - 1 && (
                  <Divider dashed className={styles.customdivider} />
                )}
              </React.Fragment>
            ))}
          </section>
          <div className={styles.cartActions}>
            <Button danger className={styles.actionButton}>
              XÓA HẾT
            </Button>
            <Button className={styles.actionButton}>QUAY LẠI MUA HÀNG</Button>
          </div>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <section className={styles.orderSummary}>
            <Title level={5} className={styles.sectionTitle}>
              ĐƠN HÀNG
            </Title>
            <div className={styles.promoSection}>
              <Text strong className={styles.promoLabel}>
                NHẬP MÃ KHUYẾN MÃI
              </Text>
              <div className={styles.promoInput}>
                <Input placeholder="Mã khuyến mãi" />
                <Button type="primary">ÁP DỤNG</Button>
              </div>
            </div>
            <Divider dashed />
            <div className={styles.summaryItem}>
              <Text>Đơn hàng</Text>
              <Text>1.930.000 VND</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text type="secondary">Giảm</Text>
              <Text type="secondary">0 VND</Text>
            </div>
            <Divider dashed />
            <div className={styles.summaryTotal}>
              <Text strong>TẠM TÍNH</Text>
              <Text strong>1.930.000 VND</Text>
            </div>
            <Button type="primary" block className={styles.checkoutButton}>
              TIẾP TỤC THANH TOÁN
            </Button>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;

import React from 'react';
import { Form, Input, Select, Checkbox, Button, Typography, Row, Col, Divider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from '../../CSS/Order.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

// Sample cart data (replace with actual cart data from your app)
const cart = [
  {
    id: 1,
    name: 'Die-cut Insoles - Ananas Ortholite 7mm RF - White Asparagus',
    size: 'S',
    price: 69000,
    quantity: 10,
  },
  {
    id: 2,
    name: 'Vintas Vivu - Low Top - Warm Sand',
    size: '36.5',
    price: 620000,
    quantity: 2,
  },
];

function Order() {
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const shippingFee = 0;
  const paymentFee = 0;
  const total = subtotal - discount + shippingFee + paymentFee;

  // Format price to VND
  const formatPrice = (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className={styles.container}>
      <Row gutter={[32, 16]}>
        {/* Left form section */}
        <Col xs={24} md={14}>
          <Form layout="vertical" className={styles.form}>
            {/* Delivery Information */}
            <div className={styles.section}>
              <Title level={5} className={styles.sectionTitle}>
                THÔNG TIN GIAO HÀNG
              </Title>
              <Form.Item>
                <Input placeholder="HỌ TÊN" size="large" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Số điện thoại" size="large" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Email" size="large" type="email" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Địa chỉ" size="large" />
              </Form.Item>
              <Form.Item>
                <Select placeholder="Tỉnh/ Thành Phố" size="large">
                  <Option value="">Tỉnh/ Thành Phố</Option>
                </Select>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item>
                    <Select placeholder="Quận/ Huyện" size="large">
                      <Option value="">Quận/ Huyện</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Select placeholder="Phường/ Xã" size="large">
                      <Option value="">Phường/ Xã</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Checkbox>
                  Cập nhật các thông tin mới nhất về chương trình từ Ananas
                </Checkbox>
              </Form.Item>
            </div>

            {/* Delivery Method */}
            <div className={styles.section}>
              <Title level={5} className={styles.sectionTitle}>
                PHƯƠNG THỨC GIAO HÀNG
              </Title>
              <Form.Item>
                <Checkbox defaultChecked>
                  <span className={styles.checkboxLabel}>
                    Tốc độ tiêu chuẩn (từ 2 - 5 ngày làm việc)
                    <QuestionCircleOutlined className={styles.infoIcon} title="Thông tin" />
                  </span>
                  <span className={styles.price}>0 VNĐ</span>
                </Checkbox>
              </Form.Item>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <Title level={5} className={styles.sectionTitle}>
                PHƯƠNG THỨC THANH TOÁN
              </Title>
              <Form.Item>
                <Checkbox defaultChecked>
                  <span className={styles.checkboxLabel}>
                    Thanh toán trực tiếp khi giao hàng
                    <QuestionCircleOutlined className={styles.infoIcon} title="Thông tin" />
                  </span>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox>
                  <span className={styles.checkboxLabel}>
                    Thanh toán bằng Thẻ quốc tế / Thẻ nội địa / QR Code
                    <QuestionCircleOutlined className={styles.infoIcon} title="Thông tin" />
                  </span>
                </Checkbox>
              </Form.Item>
            </div>
          </Form>
        </Col>

        {/* Right order summary */}
        <Col xs={24} md={10}>
          <div className={styles.orderSummary}>
            <Title level={5} className={styles.sectionTitle}>
              ĐƠN HÀNG
            </Title>
            {cart.map((item) => (
              <React.Fragment key={item.id}>
                <div className={styles.orderItem}>
                  <div>
                    <Text strong>{item.name}</Text>
                    <div className={styles.itemDetail}>Size: {item.size}</div>
                  </div>
                  <Text className={styles.itemPrice}>{formatPrice(item.price)}</Text>
                </div>
                <Text className={styles.quantity}>x {item.quantity}</Text>
              </React.Fragment>
            ))}
            <Divider className={styles.divider} />
            <div className={styles.summaryRow}>
              <Text strong>Đơn hàng</Text>
              <Text strong>{formatPrice(subtotal)}</Text>
            </div>
            <div className={styles.summaryRow}>
              <Text strong>Giảm</Text>
              <Text strong>{formatPrice(-discount)}</Text>
            </div>
            <div className={styles.summaryRow}>
              <Text strong>Phí vận chuyển</Text>
              <Text strong>{formatPrice(shippingFee)}</Text>
            </div>
            <div className={styles.summaryRow}>
              <Text strong>Phí thanh toán</Text>
              <Text strong>{formatPrice(paymentFee)}</Text>
            </div>
            <Divider className={styles.divider} />
            <div className={styles.totalRow}>
              <Text strong>TỔNG CỘNG</Text>
              <Text strong className={styles.totalPrice}>{formatPrice(total)}</Text>
            </div>
            <Button type="primary" size="large" className={styles.submitButton}>
              HOÀN TẤT ĐẶT HÀNG
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Order;
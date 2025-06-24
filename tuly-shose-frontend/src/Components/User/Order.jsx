import React from 'react';
import { Input, Select, Checkbox, Radio, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from '../../CSS/Order.module.css';

const { Option } = Select;

function Order() {
  return (
    <main className={`${styles.main} ${styles.fadeIn}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Đặt hàng tại TULY Shoe</h2>
        <div className={styles.content}>
          {/* Order Form */}
          <section className={styles.formSection}>
            <form className={styles.form}>
              <div>
                <h3 className={styles.sectionTitle}>Thông tin giao hàng</h3>
                <Input
                  placeholder="HỌ TÊN"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Số điện thoại"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Email"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Địa chỉ"
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <Select
                  placeholder="Tỉnh/ Thành Phố"
                  className={styles.select}
                  aria-label="Tỉnh/ Thành Phố"
                  required
                >
                  <Option value="" disabled>Tỉnh/ Thành Phố</Option>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="TP Hồ Chí Minh">TP Hồ Chí Minh</Option>
                  <Option value="Đà Nẵng">Đà Nẵng</Option>
                  <Option value="Hải Phòng">Hải Phòng</Option>
                </Select>
              </div>
              <div className={styles.selectGroup}>
                <Select
                  placeholder="Quận/ Huyện"
                  className={styles.select}
                  aria-label="Quận/ Huyện"
                  required
                >
                  <Option value="" disabled>Quận/ Huyện</Option>
                  <Option value="Quận 1">Quận 1</Option>
                  <Option value="Quận 3">Quận 3</Option>
                  <Option value="Quận 5">Quận 5</Option>
                  <Option value="Quận 10">Quận 10</Option>
                </Select>
                <Select
                  placeholder="Phường/ Xã"
                  className={styles.select}
                  aria-label="Phường/ Xã"
                  required
                >
                  <Option value="" disabled>Phường/ Xã</Option>
                  <Option value="Phường Bến Nghé">Phường Bến Nghé</Option>
                  <Option value="Phường Võ Thị Sáu">Phường Võ Thị Sáu</Option>
                  <Option value="Phường 12">Phường 12</Option>
                  <Option value="Phường 15">Phường 15</Option>
                </Select>
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Phương thức giao hàng</h3>
                <Checkbox
                  defaultChecked
                  className={styles.checkbox}
                >
                  Tốc độ tiêu chuẩn (từ 2 - 5 ngày làm việc)
                  <Tooltip title="Giao hàng trong vòng 2 đến 5 ngày làm việc">
                    <QuestionCircleOutlined className={styles.tooltipIcon} />
                  </Tooltip>
                  <span className={styles.price}>0 VNĐ</span>
                </Checkbox>
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
                <Radio.Group name="payment-method" className={styles.radioGroup}>
                  <Radio value="cod" className={styles.radio}>
                    Thanh toán trực tiếp khi giao hàng
                    <Tooltip title="Thanh toán khi nhận hàng">
                      <QuestionCircleOutlined className={styles.tooltipIcon} />
                    </Tooltip>
                  </Radio>
                  <Radio value="online" className={styles.radio}>
                    Thanh toán trực tuyến
                    <Tooltip title="Thanh toán qua cổng trực tuyến">
                      <QuestionCircleOutlined className={styles.tooltipIcon} />
                    </Tooltip>
                  </Radio>
                </Radio.Group>
              </div>
            </form>
          </section>

          {/* Order Summary */}
          <aside className={styles.orderSummary} aria-label="Order summary">
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryItems}>
              {/* Product 1 */}
              <div className={styles.product}>
                <div className={styles.productInfo}>
                  <img
                    alt="Die-cut Insoles - Ananas Ortholite 7mm RF - White Asparagus product image"
                    className={styles.productImage}
                    src="https://storage.googleapis.com/a1aa/image/48395c39-3135-4324-539c-fec50ad1d323.jpg"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                  />
                  <div>
                    <p className={styles.productName}>
                      Die-cut Insoles - Ananas Ortholite 7mm RF - White Asparagus
                    </p>
                    <p className={styles.productDetail}>Size: S</p>
                    <p className={styles.productQuantity}>x 10</p>
                  </div>
                </div>
                <div className={styles.productPrice}>69.000 ₫</div>
              </div>
              {/* Product 2 */}
              <div className={styles.product}>
                <div className={styles.productInfo}>
                  <img
                    alt="Vintas Vivu - Low Top - Warm Sand product image"
                    className={styles.productImage}
                    src="https://storage.googleapis.com/a1aa/image/ffd3f636-496f-4687-5163-cb372a2185d7.jpg"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                  />
                  <div>
                    <p className={styles.productName}>
                      Vintas Vivu - Low Top - Warm Sand
                    </p>
                    <p className={styles.productDetail}>Size: 36.5</p>
                    <p className={styles.productQuantity}>x 2</p>
                  </div>
                </div>
                <div className={styles.productPrice}>620.000 ₫</div>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Đơn hàng</span>
                <span>1.930.000 ₫</span>
              </div>
              <div className={styles.summaryRowSecondary}>
                <span>Giảm</span>
                <span>-0 ₫</span>
              </div>
              <div className={styles.summaryRowSecondary}>
                <span>Phí vận chuyển</span>
                <span>0 ₫</span>
              </div>
              <div className={styles.summaryRowSecondary}>
                <span>Phí thanh toán</span>
                <span>0 ₫</span>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.total}>
              <span>TỔNG CỘNG</span>
              <span>1.930.000 ₫</span>
            </div>
            <Button
              className={styles.submitButton}
              aria-label="Complete order"
            >
              HOÀN TẤT ĐẶT HÀNG
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Order;
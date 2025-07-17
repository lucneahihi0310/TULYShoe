import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Spin,
  notification,
} from "antd";
import { AuthContext } from "../API/AuthContext";
import { fetchData, postData } from "../API/ApiService";
import styles from "../../CSS/HomePage.module.css";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [bestSellers, setBestSellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [form] = Form.useForm();
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Xử lý hiệu ứng fade cho các slide
    const fadeSlides = document.querySelectorAll(`.${styles.fadeSlide}`);
    fadeSlides.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(styles.show);
      }, index * 300);
    });

    // Lấy sản phẩm bán chạy
    const fetchBestSellers = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchData(
          "/products/customers/listproducts?sortBy=sold-desc&limit=4"
        );
        setBestSellers(data.data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    // Lấy đánh giá 5 sao ngẫu nhiên
    const fetchTestimonials = async () => {
      setLoadingReviews(true);
      try {
        const data = await fetchData(
          "/reviews/customers/random?rating=5&limit=3"
        );
        setTestimonials(data);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    // Gọi các hàm bất đồng bộ
    fetchBestSellers();
    fetchTestimonials();
  }, []);

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddToCart = async (product) => {
    const cartItem = {
      pdetail_id: product.detail._id,
      quantity: 1,
    };

    const notifyAddSuccess = () => {
      notification.success({
        message: "Đã thêm vào giỏ hàng!",
        description: `Sản phẩm "${product.productName}" đã được thêm.`,
        placement: "bottomLeft",
        duration: 2,
      });
    };

    const notifyStockError = () => {
      notification.error({
        message: "Không thể thêm vào giỏ hàng",
        description: `Sản phẩm "${product.productName}" đã đạt số lượng tối đa trong kho (${product.detail.inventory_number}).`,
        placement: "bottomLeft",
        duration: 3,
      });
    };

    try {
      if (user) {
        // Fetch current cart items for the user
        const cartData = await fetchData(
          `cartItem/customers/user/${user._id}`,
          true
        );
        const existingItem = cartData.find(
          (item) => item.pdetail_id._id === cartItem.pdetail_id
        );
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (
          currentQuantity + cartItem.quantity >
          product.detail.inventory_number
        ) {
          notifyStockError();
          return;
        }

        await postData("/cartItem/customers", {
          ...cartItem,
          user_id: user._id,
        });
        notifyAddSuccess();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]"
        );
        const existingIndex = guestCart.findIndex(
          (item) => item.pdetail_id === cartItem.pdetail_id
        );
        const currentQuantity =
          existingIndex >= 0 ? guestCart[existingIndex].quantity : 0;

        if (
          currentQuantity + cartItem.quantity >
          product.detail.inventory_number
        ) {
          notifyStockError();
          return;
        }

        if (existingIndex >= 0) {
          guestCart[existingIndex].quantity += 1;
        } else {
          guestCart.push(cartItem);
        }

        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        window.dispatchEvent(new Event("cartUpdated"));
        notifyAddSuccess();
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng (user):", err);
      notification.error({
        message: "Thêm giỏ hàng thất bại!",
        description: err.message || "Vui lòng thử lại sau.",
        placement: "bottomLeft",
      });
    }
  };

  const handleSupportSubmit = async (values) => {
    setLoadingSupport(true);
    try {
      // Kiểm tra thời gian chờ trước khi gửi
      const email = values.email;
      const response = await fetchData(
        `/support/check-cooldown?email=${encodeURIComponent(email)}`
      );
      if (response.cooldown) {
        setTimeLeft(response.minutesLeft);
        notification.warning({
          message: "Yêu cầu hỗ trợ bị hạn chế",
          description: `Bạn vừa gửi yêu cầu hỗ trợ. Vui lòng đợi ${response.minutesLeft} phút trước khi gửi lại.`,
          placement: "bottomRight",
          duration: 3,
        });
        setLoadingSupport(false);
        return;
      }

      // Gửi yêu cầu hỗ trợ nếu không có thời gian chờ
      const submitResponse = await postData("/support/submit", values);
      setTimeLeft(30); // Đặt lại thời gian chờ
      notification.success({
        message: "Gửi yêu cầu thành công!",
        description: submitResponse.message,
        placement: "bottomRight",
        duration: 3,
      });
      form.resetFields();
      setTimeLeft(null); // Xóa thông báo thời gian chờ sau khi gửi thành công
    } catch (err) {
      notification.error({
        message: "Lỗi khi gửi yêu cầu",
        description:
          err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        placement: "bottomRight",
        duration: 3,
      });
    } finally {
      setLoadingSupport(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section
        className={`${styles.heroSection} ${styles.fadeSlide} ${styles.delay2}`}
      >
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Bước vào thế giới sang trọng
                <br />
                cùng <span className={styles.brandHighlight}>TULY Shoe</span>
              </h1>
              <p className={styles.heroDescription}>
                Khám phá những đôi giày chất lượng cao được chế tác theo phong
                cách, sự thoải mái và thanh lịch. Nâng tầm vẻ ngoài của bạn với
                bộ sưu tập độc quyền của chúng tôi.
              </p>
              <Button
                type="primary"
                onClick={() => navigate("/products")}
                className={styles.shopButton}
              >
                Mua Ngay
              </Button>
            </div>
            <div className={styles.heroImageContainer}>
              <img
                src="https://duongvanluc2002.sirv.com/assets_task_01jz1qebawfxd93jd33dcfxgq5_1751331118_img_0.webp"
                alt="Luxury leather shoe with sleek design on a clean white background, showcasing premium craftsmanship and elegant style"
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
        <svg
          className={styles.heroWave}
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 120L1440 0V120H0Z" fill="#f9fafb" />
        </svg>
      </section>

      {/* Best-Selling Products Section */}
      <section
        id="collections"
        className={`${styles.collectionsSection} ${styles.fadeSlide} ${styles.delay3}`}
      >
        <h2 className={styles.sectionTitle}>Sản Phẩm Bán Chạy</h2>
        {loadingProducts ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} className={styles.flexRow}>
            {bestSellers.length === 0 ? (
              <Paragraph>Không tìm thấy sản phẩm nào.</Paragraph>
            ) : (
              bestSellers.map((product) => {
                const hasDiscount = product.detail?.discount_percent > 0;
                const isOutOfStock = product.detail?.inventory_number === 0;

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    key={product._id}
                    className={styles.sameHeightCol}
                  >
                    <Card
                      hoverable
                      className={styles.productCard}
                      onClick={() =>
                        navigate(`/products/${product.detail._id}`)
                      }
                      cover={
                        <div className={styles.productImageContainer}>
                          <img
                            alt={product.productName}
                            src={
                              product.detail?.images?.[0] ||
                              "/placeholder-image.jpg"
                            }
                            className={`${styles.productImage}`}
                            style={{
                              filter: isOutOfStock ? "grayscale(50%)" : "none",
                            }}
                          />
                          {isOutOfStock && (
                            <div className={styles.outOfStockOverlay}>
                              Hết hàng
                            </div>
                          )}
                        </div>
                      }
                    >
                      {hasDiscount && (
                        <Tag color="red" className={styles.discountTag}>
                          -{product.detail.discount_percent}%
                        </Tag>
                      )}
                      <Card.Meta
                        title={
                          <span className={styles.productName}>
                            {product.productName}
                          </span>
                        }
                        description={
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className={styles.productDescription}
                          >
                            {product.title}
                          </Paragraph>
                        }
                      />
                      <div className={styles.priceAndCartContainer}>
                        <div className={styles.priceContainer}>
                          <span
                            className={styles.originalPrice}
                            style={{
                              visibility: hasDiscount ? "visible" : "hidden",
                            }}
                          >
                            {formatVND(product.price)}
                          </span>
                          <span className={styles.currentPrice}>
                            {hasDiscount
                              ? formatVND(product.detail?.price_after_discount)
                              : formatVND(product.price)}
                          </span>
                        </div>
                        <Button
                          icon={<i className="bi bi-bag-heart" />}
                          className={
                            isOutOfStock
                              ? styles.addToCartDisabled
                              : styles.addToCart
                          }
                          onClick={(e) => {
                            if (!isOutOfStock) {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }
                          }}
                          disabled={isOutOfStock}
                          aria-label={`Add ${product.productName} to cart`}
                        />
                      </div>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        )}
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className={`${styles.aboutSection} ${styles.fadeSlide} ${styles.delay4}`}
      >
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImageContainer}>
              <img
                src="https://storage.googleapis.com/a1aa/image/105137f2-6723-433a-1634-828f7e73bcf0.jpg"
                alt="Artisan crafting luxury shoes in a workshop with wooden tools and leather materials, highlighting traditional craftsmanship"
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>TULY Shoe</h2>
              <p className={styles.aboutDescription}>
                Tại TULY Shoe, chúng tôi tin rằng mỗi bước chân của bạn đều phải
                là một tuyên ngôn về phong cách và sự tự tin. Giày của chúng tôi
                được chế tác bằng những vật liệu tốt nhất và tỉ mỉ đến từng chi
                tiết, kết hợp xu hướng hiện đại với sự thanh lịch vượt thời
                gian.
              </p>
              <p className={styles.aboutDescription}>
                Từ giày da cổ điển đến giày thể thao giản dị năng động, bộ sưu
                tập của chúng tôi được thiết kế để đáp ứng nhu cầu của mọi khách
                hàng. Trải nghiệm sự thoải mái và sang trọng vô song với TULY
                Shoe.
              </p>
              <Button
                type="primary"
                onClick={() => navigate("/products")}
                className={styles.shopButton}
              >
                Khám Phá Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`${styles.testimonialsSection} ${styles.fadeSlide} ${styles.delay4}`}
      >
        <h2 className={styles.sectionTitle}>Khách Hàng Của Chúng Tôi Nói Gì</h2>
        {loadingReviews ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.testimonialsGrid}>
            {testimonials.length === 0 ? (
              <Paragraph>Không có đánh giá nào để hiển thị.</Paragraph>
            ) : (
              testimonials.map((item, index) => (
                <div key={index} className={styles.testimonialItem}>
                  <img
                    src={
                      item.user_id?.avatar_image ||
                      "https://duongvanluc2002.sirv.com/hinh-ve-la-co-viet-nam_021823685.jpg"
                    }
                    alt={`Avatar of ${item.user_id?.first_name} ${item.user_id?.last_name}`}
                    className={styles.testimonialImage}
                  />
                  <p className={styles.testimonialComment}>
                    "{item.review_content}"
                  </p>
                  <h3 className={styles.testimonialName}>
                    {item.user_id?.first_name} {item.user_id?.last_name}
                  </h3>
                  <span className={styles.testimonialRole}>
                    Người mua đã xác minh
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`${styles.contactSection} ${styles.fadeSlide} ${styles.delay4}`}
      >
        <div className={styles.contactContainer}>
          <h2 style={{ color: "white" }} className={styles.sectionTitle}>
            Bạn Cần TULY Shoe Hỗ Trợ
          </h2>
          <Form
            form={form}
            className={styles.contactForm}
            layout="vertical"
            onFinish={handleSupportSubmit}
          >
            <Form.Item
              label="Họ và Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input
                placeholder="Họ và tên của bạn"
                className={styles.formInput}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Vui lòng nhập email hợp lệ!" },
              ]}
            >
              <Input
                placeholder="you@example.com"
                className={styles.formInput}
                onChange={(e) =>
                  form.setFieldsValue({ email: e.target.value.toLowerCase() })
                }
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^0\d{9}$/,
                  message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!",
                },
              ]}
            >
              <Input
                placeholder="0xxxxxxxxx"
                className={styles.formInput}
                maxLength={10}
              />
            </Form.Item>
            <Form.Item
              label="Nội dung yêu cầu"
              name="message"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <Input.TextArea
                placeholder="Viết nội dung yêu cầu của bạn..."
                rows={5}
                className={styles.formTextArea}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.submitButton}
                loading={loadingSupport}
                disabled={loadingSupport || timeLeft}
              >
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

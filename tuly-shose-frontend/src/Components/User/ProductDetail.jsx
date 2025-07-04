import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Rate,
  Typography,
  Carousel,
  Card,
  Space,
  Tag,
  Spin,
  Modal,
  notification,
} from "antd";
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import styles from "../../CSS/ProductDetail.module.css";
import { AuthContext } from "../API/AuthContext";
import { fetchData, postData } from "../API/ApiService";
const { Title, Paragraph, Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const imageContainerRef = useRef(null);
  const { user } = useContext(AuthContext);

  const [productDetail, setProductDetail] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);

        const resDetail = await fetchData(`productDetail/customers/${id}`);
        setProductDetail(resDetail);
        setMainImage(resDetail.images[0]);
        console.log("resDetail:", resDetail);
        console.log("resDetail._id:", resDetail._id);
        const resVariants = await fetchData(
          `productDetail/customers/product/${resDetail.product_id._id}`
        );
        setVariants(resVariants);

        const resReviews = await fetchData(`reviews/customers/detail/${resDetail._id}`);
        setReviews(resReviews);

        const resRelated = await fetchData(`productDetail/customers/related/${id}`);
        setRelated(resRelated);

        setSelectedColor(resDetail.color_id._id);
        setSelectedSize(resDetail.size_id._id);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu ProductDetail:", err);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchDataAsync();
  }, [id]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleColorClick = async (colorId) => {
    setSelectedColor(colorId);
    const match = variants.find(
      (v) => v.color_id._id === colorId && v.size_id._id === selectedSize
    );
    if (match) {
      navigate(`/products/${match._id}`);
    }
  };
  const handleBuyNow = () => {
    const orderItem = {
      pdetail_id: productDetail._id,
      quantity: 1,
    };

    navigate("/order", {
      state: {
        fromDetail: true,
        orderItems: [orderItem],
      },
    });
  };
  const handleSizeClick = async (sizeId) => {
    setSelectedSize(sizeId);
    const match = variants.find(
      (v) => v.size_id._id === sizeId && v.color_id[0]._id === selectedColor
    );
    if (match) {
      navigate(`/products/${match._id}`);
    }
  };

  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transform: "scale(2)",
        transformOrigin: `${xPercent}% ${yPercent}%`,
      });
    }
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center center" });
  };

  const handleAddToCart = async () => {
    const cartItem = {
      pdetail_id: productDetail._id,
      quantity: 1,
    };

    const notifyAddSuccess = () => {
      notification.success({
        message: "Đã thêm vào giỏ hàng!",
        description: `Sản phẩm "${productDetail.product_id.productName}" đã được thêm.`,
        placement: "bottomLeft",
        duration: 2,
      });
    };

    if (user) {
      try {
        await postData("/cartItem/customers", { ...cartItem, user_id: user._id });
        window.dispatchEvent(new Event("cartUpdated"));
        notifyAddSuccess();
      } catch (err) {
        console.error("Lỗi khi thêm vào giỏ hàng (user):", err);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const existingIndex = guestCart.findIndex(
        (item) => item.pdetail_id === cartItem.pdetail_id
      );

      if (existingIndex >= 0) {
        guestCart[existingIndex].quantity += 1;
      } else {
        guestCart.push(cartItem);
      }
      window.dispatchEvent(new Event("cartUpdated"));
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      notifyAddSuccess();
    }
  };

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddRelatedToCart = async (prod) => {
    const cartItem = {
      pdetail_id: prod._id,
      quantity: 1,
    };

    const notifyAddSuccess = () => {
      notification.success({
        message: "Đã thêm vào giỏ hàng!",
        description: `Sản phẩm "${prod.product_id.productName}" đã được thêm.`,
        placement: "bottomLeft",
        duration: 2,
      });
    };

    try {
      if (user && user._id) {
        await postData("/cartItem/customers", { ...cartItem, user_id: user._id });
        window.dispatchEvent(new Event("cartUpdated"));
        notifyAddSuccess();
      } else {
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]"
        );
        const existingIndex = guestCart.findIndex(
          (item) => item.pdetail_id === cartItem.pdetail_id
        );

        if (existingIndex >= 0) {
          guestCart[existingIndex].quantity += 1;
        } else {
          guestCart.push(cartItem);
        }
        window.dispatchEvent(new Event("cartUpdated"));
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        notifyAddSuccess();
      }
    } catch (err) {
      console.error("Lỗi thêm sản phẩm liên quan vào giỏ hàng:", err);
      notification.error({
        message: "Thêm giỏ hàng thất bại!",
        description: err.message || "Vui lòng thử lại sau.",
        placement: "bottomLeft",
      });
    }
  };

  const handlePrev = () => carouselRef.current?.prev();
  const handleNext = () => carouselRef.current?.next();

  if (loading || !productDetail || !productDetail.product_id) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" tip="Đang tải dữ liệu sản phẩm..." />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isVisible ? styles.fadeIn : ""}`}>
      <Row gutter={32} className={styles.main}>
        <Col xs={24} lg={12}>
          <div
            className={styles.imageContainer}
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage}
              className={styles.mainImage}
              style={zoomStyle}
              alt="main product"
            />
          </div>
          <div className={styles.thumbnails}>
            {productDetail.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className={styles.thumbnail}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </Col>

        <Col xs={24} lg={12} className={styles.productInfo}>
          <Title level={3}>{productDetail.product_id.productName}</Title>
          <Space align="center" className={styles.rating}>
            <Rate
              allowHalf
              value={
                reviews.reduce((total, review) => total + review.rating, 0) /
                reviews.length
              }
              disabled
            />
            <Text>({reviews.length} đánh giá)</Text>
            <Text>| Đã bán {productDetail.sold_number}</Text>
            <Text>
              | {productDetail.product_detail_status.productdetail_status_name}
            </Text>
          </Space>

          <div className={styles.price}>
            {productDetail.discount_id?.percent_discount > 0 ? (
              <>
                <Text className={styles.salePrice}>
                  {formatVND(productDetail.price_after_discount)}
                </Text>
                <Text delete className={styles.originalPrice}>
                  {formatVND(productDetail.product_id.price)}
                </Text>
                <Tag color="orange">
                  Giảm {productDetail.discount_id.percent_discount}%
                </Tag>
              </>
            ) : (
              <Text className={styles.salePrice}>
                {formatVND(productDetail.product_id.price)}
              </Text>
            )}
          </div>

          <div className={styles.selection}>
            <Text strong>Chọn màu</Text>
            <div className={styles.colorOptions}>
              {[
                ...new Map(
                  variants.map((v) => [v.color_id._id, v.color_id])
                ).values(),
              ].map((color) => (
                <div
                  key={color._id}
                  className={`${styles.colorButton} ${
                    selectedColor === color._id ? styles.colorSelected : ""
                  }`}
                  style={{ backgroundColor: color.color_code }}
                  title={color.color_name}
                  onClick={() => handleColorClick(color._id)}
                />
              ))}
            </div>
          </div>

          <div className={styles.selection}>
            <div className={styles.selectHeader}>
              <Text strong className={styles.selectTitle}>
                Chọn size
              </Text>
              <Button
                type="link"
                size="small"
                className={styles.guideBtn}
                onClick={() => setIsSizeGuideVisible(true)}
              >
                HD chọn size
              </Button>
            </div>

            <div className={styles.sizeOptions}>
              {[
                ...new Map(
                  variants.map((v) => [v.size_id._id, v.size_id])
                ).values(),
              ].map((size) => (
                <Button
                  key={size._id}
                  className={`${styles.sizeButton} ${
                    selectedSize === size._id ? styles.sizeSelected : ""
                  }`}
                  onClick={() => handleSizeClick(size._id)}
                >
                  {size.size_name}
                </Button>
              ))}
            </div>

            <Modal
              open={isSizeGuideVisible}
              onCancel={() => setIsSizeGuideVisible(false)}
              footer={null}
              centered
              width={800}
            >
              <img
                src="https://duongvanluc2002.sirv.com/1.jpeg"
                alt="Hướng dẫn chọn size"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Modal>
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              size="large"
              className={styles.buyButton}
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              className={styles.cartButton}
              onClick={handleAddToCart}
            >
              Giỏ hàng
            </Button>
          </div>

          <div className={styles.details}>
            <Paragraph>
              <Text strong>Thương hiệu:</Text>{" "}
              {productDetail.product_id.brand_id?.brand_name}
            </Paragraph>
            <Paragraph>
              <Text strong>Chất liệu:</Text>{" "}
              {productDetail.product_id.material_id?.material_name}
            </Paragraph>
            <Paragraph>
              <Text strong>Kiểu dáng:</Text>{" "}
              {productDetail.product_id.form_id?.form_name}
            </Paragraph>
            <Paragraph>
              <Text strong>Thể loại:</Text>{" "}
              {productDetail.product_id.categories_id?.category_name}
            </Paragraph>
            <Paragraph>
              <Text strong>Giới tính:</Text>{" "}
              {productDetail.product_id.gender_id?.gender_name}
            </Paragraph>
          </div>
        </Col>
      </Row>

      <div className={styles.description}>
        <Title level={3} className={styles.titleBorder}>
          Mô tả sản phẩm
        </Title>
        <Paragraph>{productDetail.product_id.description}</Paragraph>
      </div>

      <div className={styles.reviews}>
        <Title level={3} className={styles.titleBorder}>
          Đánh giá sản phẩm
        </Title>

        {reviews.length === 0 ? (
          <Paragraph style={{ padding: "12px 0", color: "#888" }}>
            Chưa có đánh giá nào cho sản phẩm này.
          </Paragraph>
        ) : (
          <>
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r) => (
              <Card key={r._id} className={styles.reviewCard}>
                <div className={styles.review}>
                  <img
                    src={r.user_id?.avatar_image}
                    className={styles.avatar}
                  />
                  <div>
                    <Text strong>
                      {r.user_id?.first_name} {r.user_id?.last_name}
                    </Text>
                    <div>
                      <Rate
                        value={r.rating}
                        allowHalf
                        disabled
                        className={styles.reviewRating}
                      />
                    </div>
                    <Paragraph>{r.review_content}</Paragraph>
                  </div>
                </div>

                {r.replies.length > 0 &&
                  r.replies.map((rep) => (
                    <div key={rep._id} className={styles.reply}>
                      <img
                        src={rep.replier_id?.avatar_image}
                        className={styles.replyAvatar}
                      />
                      <div className={styles.replyContent}>
                        <Text strong>
                          {rep.replier_id?.first_name}{" "}
                          {rep.replier_id?.last_name}:
                        </Text>{" "}
                        {rep.reply_content}
                      </div>
                    </div>
                  ))}
              </Card>
            ))}

            {reviews.length > 3 && (
              <div className={styles.toggleReview}>
                <Button
                  type="link"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Ẩn bớt" : "Xem thêm đánh giá"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {related.length > 0 && (
        <div className={styles.relatedProducts}>
          <Title level={3} className={styles.titleBorder}>
            Sản phẩm liên quan
          </Title>
          <div className={styles.carouselWrapper}>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrev}
              className={`${styles.carouselNav} ${styles.prev}`}
            />
            <Carousel
              ref={carouselRef}
              dots={false}
              slidesToShow={3}
              slidesToScroll={1}
              className={styles.carousel}
            >
              {related.map((prod) => (
                <div
                  key={prod._id}
                  className={styles.carouselItem}
                  onClick={() => navigate(`/products/${prod._id}`)}
                >
                  <div className={styles.sameHeightWrapper}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={prod.images[0]}
                          alt={prod.product_id.productName}
                          className={styles.relatedImage}
                        />
                      }
                      className={styles.relatedCard}
                    >
                      {prod.discount_id.percent_discount > 0 && (
                        <Tag color="orange" className={styles.discountTag}>
                          -{prod.discount_id.percent_discount}%
                        </Tag>
                      )}
                      <Card.Meta
                        title={prod.product_id.productName}
                        description={
                          <>
                            <Paragraph ellipsis={{ rows: 2 }}>
                              {prod.product_id.description}
                            </Paragraph>
                            <div className={styles.priceContainer}>
                              <div className={styles.priceRow}>
                                <div className={styles.priceColumn}>
                                  {prod.discount_id.percent_discount > 0 ? (
                                    <>
                                      <Text
                                        className={styles.originalPrice}
                                        delete
                                      >
                                        {formatVND(prod.product_id.price)}
                                      </Text>
                                      <Text className={styles.salePrice}>
                                        {formatVND(prod.price_after_discount)}
                                      </Text>
                                    </>
                                  ) : (
                                    <Text className={styles.salePrice}>
                                      {formatVND(prod.product_id.price)}
                                    </Text>
                                  )}
                                </div>

                                <Button
                                  type="text"
                                  className={styles.cartIconButton}
                                  icon={<ShoppingCartOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddRelatedToCart(prod);
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        }
                      />
                    </Card>
                  </div>
                </div>
              ))}
            </Carousel>
            <Button
              icon={<RightOutlined />}
              onClick={handleNext}
              className={`${styles.carouselNav} ${styles.next}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;

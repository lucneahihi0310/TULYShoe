import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Rate,
  Typography,
  Card,
  Space,
  Tag,
  Spin,
  Modal,
  Image,
  notification,
  InputNumber,
  Tooltip,
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
  const imageContainerRef = useRef(null);
  const thumbnailScrollRef = useRef(null);
  const relatedScrollRef = useRef(null);
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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
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
        setSelectedColor(resDetail.color_id._id);
        setSelectedSize(resDetail.size_id._id);
        const resVariants = await fetchData(
          `productDetail/customers/product/full/${resDetail.product_id._id}`
        );
        setVariants(resVariants);
        const resReviews = await fetchData(
          `reviews/customers/detail/${resDetail._id}`
        );
        console.log("Reviews data:", JSON.stringify(resReviews, null, 2)); // Debug
        setReviews(resReviews);
        const resRelated = await fetchData(
          `productDetail/customers/related/${id}`
        );
        setRelated(resRelated);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu ProductDetail:", err);
        notification.error({
          message: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
          placement: "bottomLeft",
        });
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchDataAsync();
  }, [id]);

  useEffect(() => {
    if (productDetail?._id) {
      const fetchReviews = async () => {
        try {
          const resReviews = await fetchData(
            `reviews/customers/detail/${productDetail._id}`
          );
          console.log("Reviews data:", JSON.stringify(resReviews, null, 2)); // Debug
          setReviews(resReviews);
        } catch (err) {
          console.error("Lỗi khi tải đánh giá:", err);
        }
      };
      fetchReviews();
    }
  }, [productDetail?._id]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleColorClick = (colorId) => {
    setIsVariantLoading(true);
    setSelectedColor(colorId);
    setSelectedSize(null);
    const match = variants.find((v) => v.color_id._id === colorId);
    if (match) {
      setProductDetail(match);
      setMainImage(match.images[0]);
      window.history.pushState({}, "", `/products/${match._id}`);
    } else {
      notification.error({
        message: "Không tìm thấy biến thể",
        description: "Không có sản phẩm nào phù hợp với màu đã chọn.",
        placement: "bottomLeft",
      });
    }
    setIsVariantLoading(false);
  };

  const handleSizeClick = (sizeId) => {
    setIsVariantLoading(true);
    setSelectedSize(sizeId);
    const match = variants.find(
      (v) => v.color_id._id === selectedColor && v.size_id._id === sizeId
    );
    if (match) {
      setProductDetail(match);
      setMainImage(match.images[0]);
      window.history.pushState({}, "", `/products/${match._id}`);
    } else {
      notification.error({
        message: "Không tìm thấy biến thể",
        description: "Không có sản phẩm nào phù hợp với kích thước đã chọn.",
        placement: "bottomLeft",
      });
    }
    setIsVariantLoading(false);
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
    if (!productDetail) return;

    if (!selectedColor || !selectedSize) {
      notification.error({
        message: "Chưa chọn đủ thông tin",
        description:
          "Vui lòng chọn cả màu sắc và kích thước trước khi thêm vào giỏ hàng.",
        placement: "bottomLeft",
        duration: 3,
      });
      return;
    }

    const cartItem = {
      pdetail_id: productDetail._id,
      quantity: quantity,
    };

    const notifyAddSuccess = () => {
      notification.success({
        message: "Đã thêm vào giỏ hàng!",
        description: `Sản phẩm "${productDetail.product_id.productName}" (x${quantity}) đã được thêm.`,
        placement: "bottomLeft",
        duration: 2,
      });
    };

    const notifyStockError = () => {
      notification.error({
        message: "Không thể thêm vào giỏ hàng",
        description: `Sản phẩm "${productDetail.product_id.productName}" đã đạt số lượng tối đa trong kho (${productDetail.inventory_number}).`,
        placement: "bottomLeft",
        duration: 3,
      });
    };

    try {
      if (user && user._id) {
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
          productDetail.inventory_number
        ) {
          notifyStockError();
          return;
        }

        await postData("/cartItem/customers", {
          ...cartItem,
          user_id: user._id,
        });
        window.dispatchEvent(new Event("cartUpdated"));
        notifyAddSuccess();
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
          productDetail.inventory_number
        ) {
          notifyStockError();
          return;
        }

        if (existingIndex >= 0) {
          guestCart[existingIndex].quantity += quantity;
        } else {
          guestCart.push(cartItem);
        }
        window.dispatchEvent(new Event("cartUpdated"));
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        notifyAddSuccess();
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      notification.error({
        message: "Thêm giỏ hàng thất bại!",
        description: err.message || "Vui lòng thử lại sau.",
        placement: "bottomLeft",
      });
    }
  };

  const handleBuyNow = () => {
    if (!productDetail) return;

    if (!selectedColor || !selectedSize) {
      notification.error({
        message: "Chưa chọn đủ thông tin",
        description:
          "Vui lòng chọn cả màu sắc và kích thước trước khi mua ngay.",
        placement: "bottomLeft",
        duration: 3,
      });
      return;
    }

    if (quantity > productDetail.inventory_number) {
      notification.error({
        message: "Số lượng vượt quá tồn kho",
        description: `Sản phẩm "${productDetail.product_id.productName}" chỉ còn ${productDetail.inventory_number} sản phẩm trong kho.`,
        placement: "bottomLeft",
        duration: 3,
      });
      return;
    }

    const orderItem = {
      pdetail_id: productDetail._id,
      quantity: quantity,
    };

    navigate("/order", {
      state: {
        fromDetail: true,
        orderItems: [orderItem],
      },
    });
  };

  const handleAddRelatedToCart = async (prod) => {
    if (prod.inventory_number === 0) return;

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

    const notifyStockError = () => {
      notification.error({
        message: "Không thể thêm vào giỏ hàng",
        description: `Sản phẩm "${prod.product_id.productName}" đã đạt số lượng tối đa trong kho (${prod.inventory_number}).`,
        placement: "bottomLeft",
        duration: 3,
      });
    };

    try {
      if (user && user._id) {
        const cartData = await fetchData(
          `cartItem/customers/user/${user._id}`,
          true
        );
        const existingItem = cartData.find(
          (item) => item.pdetail_id._id === cartItem.pdetail_id
        );
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity + cartItem.quantity > prod.inventory_number) {
          notifyStockError();
          return;
        }

        await postData("/cartItem/customers", {
          ...cartItem,
          user_id: user._id,
        });
        window.dispatchEvent(new Event("cartUpdated"));
        notifyAddSuccess();
      } else {
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]"
        );
        const existingIndex = guestCart.findIndex(
          (item) => item.pdetail_id === cartItem.pdetail_id
        );
        const currentQuantity =
          existingIndex >= 0 ? guestCart[existingIndex].quantity : 0;

        if (currentQuantity + cartItem.quantity > prod.inventory_number) {
          notifyStockError();
          return;
        }

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

  const handleThumbnailScroll = (direction) => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({
        left: direction === "left" ? -100 : 100,
        behavior: "smooth",
      });
    }
  };

  const handleRelatedScroll = (direction) => {
    if (relatedScrollRef.current) {
      relatedScrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const availableSizes = useMemo(
    () => [
      ...new Map(
        variants
          .filter((v) => v.color_id._id === selectedColor)
          .map((v) => [v.size_id._id, v.size_id])
      ).values(),
    ],
    [variants, selectedColor]
  );

  if (loading || !productDetail || !productDetail.product_id) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" tip="Đang tải dữ liệu sản phẩm..." />
      </div>
    );
  }

  const isOutOfStock = productDetail.inventory_number === 0;
  const hasDiscount = productDetail.discount_id?.percent_discount > 0;

  return (
    <div className={`${styles.container} ${isVisible ? styles.fadeIn : ""}`}>
      {isVariantLoading && (
        <div className={styles.variantLoading}>
          <Spin tip="Đang cập nhật dữ liệu..." />
        </div>
      )}
      <Row gutter={32} className={styles.main}>
        <Col xs={24} lg={12}>
          <div
            className={styles.imageContainer}
            ref={imageContainerRef}
            onMouseMove={isOutOfStock ? null : handleMouseMove}
            onMouseLeave={isOutOfStock ? null : handleMouseLeave}
          >
            <img
              src={mainImage || "path/to/placeholder-image.jpg"}
              loading="lazy"
              className={styles.mainImage}
              style={{
                ...zoomStyle,
                filter: isOutOfStock ? "grayscale(50%)" : "none",
              }}
              alt="main product"
              onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
            />
            {isOutOfStock && (
              <div className={styles.outOfStockOverlay}>Hết hàng</div>
            )}
          </div>
          <div
            style={{
              justifyContent: "center",
            }}
            className={styles.thumbnailWrapper}
          >
            <button
              className={`${styles.arrowButton} ${styles.leftArrow}`}
              onClick={() => handleThumbnailScroll("left")}
              disabled={productDetail.images.length <= 3}
            >
              <LeftOutlined />
            </button>
            <div className={styles.thumbnailScroll} ref={thumbnailScrollRef}>
              {productDetail.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  loading="lazy"
                  className={styles.thumbnail}
                  onClick={() => setMainImage(img)}
                  alt={`thumbnail-${i}`}
                  onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
                />
              ))}
            </div>
            <button
              className={`${styles.arrowButton} ${styles.rightArrow}`}
              onClick={() => handleThumbnailScroll("right")}
              disabled={productDetail.images.length <= 3}
            >
              <RightOutlined />
            </button>
          </div>
        </Col>

        <Col xs={24} lg={12} className={styles.productInfo}>
          <Title level={3}>{productDetail.product_id.productName}</Title>
          <Space align="center" className={styles.rating}>
            <Rate
              allowHalf
              value={
                reviews.reduce((total, review) => total + review.rating, 0) /
                (reviews.length || 1)
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
            {hasDiscount ? (
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
                <Tooltip key={color._id} title={color.color_name}>
                  <div
                    className={`${styles.colorButton} ${
                      selectedColor === color._id ? styles.colorSelected : ""
                    }`}
                    style={{ backgroundColor: color.color_code }}
                    onClick={() => handleColorClick(color._id)}
                  />
                </Tooltip>
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
              {availableSizes.map((size) => (
                <Tooltip key={size._id} title={`Kích thước: ${size.size_name}`}>
                  <Button
                    className={`${styles.sizeButton} ${
                      selectedSize === size._id ? styles.sizeSelected : ""
                    }`}
                    onClick={() => handleSizeClick(size._id)}
                    disabled={isVariantLoading}
                  >
                    {size.size_name}
                  </Button>
                </Tooltip>
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

          <div className={styles.selection}>
            <Text strong>Số lượng</Text>
            <div
              className={`${styles.quantitySelector} ${styles.whiteNumberInput}`}
            >
              <InputNumber
                min={1}
                max={productDetail.inventory_number}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                className={styles.quantityInput}
                disabled={isOutOfStock || isVariantLoading}
              />
              <Text type="secondary" style={{ marginLeft: "12px" }}>
                {isOutOfStock
                  ? "Hết hàng"
                  : `Còn ${productDetail.inventory_number} sản phẩm`}
              </Text>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              size="large"
              className={
                isOutOfStock || isVariantLoading
                  ? styles.buyButtonDisabled
                  : styles.buyButton
              }
              onClick={isOutOfStock || isVariantLoading ? null : handleBuyNow}
              disabled={isOutOfStock || isVariantLoading}
            >
              Mua ngay
            </Button>
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              className={
                isOutOfStock || isVariantLoading
                  ? styles.cartButtonDisabled
                  : styles.cartButton
              }
              onClick={
                isOutOfStock || isVariantLoading ? null : handleAddToCart
              }
              disabled={isOutOfStock || isVariantLoading}
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
                    src={r.user_id?.avatar_image || "path/to/placeholder-image.jpg"}
                    loading="lazy"
                    className={styles.avatar}
                    alt="user"
                    onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
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

                    {r.images && r.images.length > 0 && (
                      <div className={styles.imagePreview}>
                        {r.images.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            loading="lazy"
                            width={80}
                            height={80}
                            style={{ borderRadius: 4 }}
                            alt={`review-image-${i}`}
                            onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
                          />
                        ))}
                      </div>
                    )}

                    <Paragraph
                      type="secondary"
                      style={{ fontSize: "13px", fontStyle: "italic" }}
                    >
                      Đánh giá lúc: {new Date(r.review_date).toLocaleString("vi-VN")}
                    </Paragraph>
                  </div>
                </div>

                {r.replies && r.replies.reply_content && (
                  <div className={styles.reply}>
                    <img
                      src={r.replies.replier_id?.avatar_image || "path/to/placeholder-image.jpg"}
                      loading="lazy"
                      className={styles.replyAvatar}
                      alt="reply user"
                      onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
                    />
                    <div className={styles.replyContent}>
                      <Text strong>
                        {r.replies.replier_id?.first_name || "Ẩn danh"} {r.replies.replier_id?.last_name || ""}:
                      </Text>{" "}
                      {r.replies.reply_content}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          fontStyle: "italic",
                        }}
                      >
                        Phản hồi lúc: {new Date(r.replies.reply_date).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                )}
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
          <div className={styles.relatedWrapper}>
            <button
              className={`${styles.arrowButton} ${styles.leftArrow}`}
              onClick={() => handleRelatedScroll("left")}
              disabled={related.length <= 4}
            >
              <LeftOutlined />
            </button>
            <div className={styles.scrollContainer} ref={relatedScrollRef}>
              {related.map((prod) => (
                <div
                  key={prod._id}
                  className={styles.scrollItem}
                  onClick={() => navigate(`/products/${prod._id}`)}
                >
                  <div style={{ position: "relative" }}>
                    {prod.discount_id?.percent_discount > 0 && (
                      <Tag color="orange" className={styles.discountTag}>
                        -{prod.discount_id.percent_discount}%
                      </Tag>
                    )}
                    <Card
                      hoverable
                      className={`${styles.relatedCard} ${styles.sameHeightWrapper}`}
                      cover={
                        <div className={styles.imageWrapper}>
                          <img
                            src={
                              prod.images[0] || "path/to/placeholder-image.jpg"
                            }
                            loading="lazy"
                            alt={prod.product_id.productName}
                            className={styles.relatedImage}
                            style={{
                              filter:
                                prod.inventory_number === 0
                                  ? "grayscale(50%)"
                                  : "none",
                            }}
                            onError={(e) =>
                              (e.target.src = "path/to/placeholder-image.jpg")
                            }
                          />
                          {prod.inventory_number === 0 && (
                            <div className={styles.outOfStockOverlay}>
                              Hết hàng
                            </div>
                          )}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={prod.product_id.productName}
                        description={
                          <>
                            <Paragraph
                              style={{ minHeight: "40px" }}
                              ellipsis={{ rows: 2 }}
                            >
                              {prod.product_id.title}
                            </Paragraph>
                            <div className={styles.priceContainer}>
                              <div className={styles.priceRow}>
                                <div className={styles.priceColumn}>
                                  {prod.discount_id?.percent_discount > 0 ? (
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
                                    <>
                                      <Text
                                        className={styles.originalPrice}
                                        style={{
                                          visibility: hasDiscount
                                            ? "visible"
                                            : "hidden",
                                        }}
                                        delete
                                      >
                                        {formatVND(prod.product_id.price)}
                                      </Text>
                                      <Text className={styles.salePrice}>
                                        {formatVND(prod.product_id.price)}
                                      </Text>
                                    </>
                                  )}
                                </div>
                                <Button
                                  type="text"
                                  className={
                                    prod.inventory_number === 0
                                      ? styles.cartButtonDisabled
                                      : styles.cartIconButton
                                  }
                                  icon={<ShoppingCartOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddRelatedToCart(prod);
                                  }}
                                  disabled={prod.inventory_number === 0}
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
            </div>
            <button
              className={`${styles.arrowButton} ${styles.rightArrow}`}
              onClick={() => handleRelatedScroll("right")}
              disabled={related.length <= 4}
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
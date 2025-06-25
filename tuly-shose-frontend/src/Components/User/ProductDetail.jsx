import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Rate, Typography, Carousel, Card, Breadcrumb, Space, Tag } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from '../../CSS/ProductDetail.module.css';

const { Title, Paragraph, Text } = Typography;

// Mock data for product and related products
const product = {
  id: 1,
  name: 'Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11',
  price: 1350000,
  originalPrice: 1800000,
  discount: 25,
  rating: 4.5,
  reviews: 45,
  sold: 150,
  images: [
    {
      src: 'https://storage.googleapis.com/a1aa/image/755a521d-3b37-4920-dbd8-09d366639257.jpg',
      alt: 'Nike Air Force 1 Shadow white brown gray shoe worn on foot, side view on street background',
    },
    {
      src: 'https://storage.googleapis.com/a1aa/image/81ac97a5-b7e7-4163-f044-5cff7470b45e.jpg',
      alt: 'Side view of Nike Air Force 1 Shadow white brown gray shoe on white background',
    },
    {
      src: 'https://storage.googleapis.com/a1aa/image/a23ae346-db78-4539-9fcd-0e8e61238ce5.jpg',
      alt: 'Top view of Nike Air Force 1 Shadow white brown gray shoe on white background',
    },
    {
      src: 'https://storage.googleapis.com/a1aa/image/77cd1bbf-af3c-48ca-00c7-71147cef810d.jpg',
      alt: 'Back view of Nike Air Force 1 Shadow white brown gray shoe on white background',
    },
    {
      src: 'https://storage.googleapis.com/a1aa/image/98019822-c16f-4d46-450b-98697d82a45c.jpg',
      alt: 'Side view of Nike Air Force 1 Shadow brown gray white shoe on white background',
    },
  ],
  colors: [
    { name: 'Trắng Nâu Xám', value: 'trang-nau-xam', gradient: 'linear-gradient(135deg, #FFFFFF 40%, #7B6F5B 40%, #7B6F5B 70%, #6B6B6B 70%)' },
    { name: 'Trắng Đỏ Đen', value: 'trang-do-den', gradient: 'linear-gradient(135deg, #FFFFFF 40%, #D32F2F 40%, #D32F2F 70%, #000000 70%)' },
    { name: 'Đen Trắng', value: 'den-trang', gradient: 'linear-gradient(135deg, #000000 40%, #FFFFFF 40%, #FFFFFF 70%, #000000 70%)' },
    { name: 'Xám Trắng', value: 'xam-trang', gradient: 'linear-gradient(135deg, #6B6B6B 40%, #FFFFFF 40%, #FFFFFF 70%, #6B6B6B 70%)' },
  ],
  sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  brand: 'Nike',
  material: 'Da tổng hợp cao cấp, đế cao su bền bỉ',
  colorSwatches: ['#FFFFFF', '#7B6F5B', '#6B6B6B'],
  warranty: '12 tháng',
  origin: 'Việt Nam',
  description: [
    'Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11 là phiên bản giày sneaker thời trang với thiết kế độc đáo, phối màu trắng, nâu và xám hài hòa, phù hợp cho cả nam và nữ. Được làm từ chất liệu da tổng hợp cao cấp, đế cao su bền bỉ, mang lại sự thoải mái và độ bền vượt trội khi sử dụng hàng ngày.',
    'Đế giày được thiết kế với độ bám cao, chống trơn trượt hiệu quả. Form giày ôm chân, tạo cảm giác chắc chắn và thoải mái khi di chuyển. Đây là lựa chọn hoàn hảo cho những ai yêu thích phong cách streetwear năng động và cá tính.',
    'Sản phẩm được bảo hành 12 tháng và cam kết chính hãng 100%. Hãy nhanh tay đặt hàng để sở hữu đôi giày thời thượng này!',
  ],
};

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://storage.googleapis.com/a1aa/image/a9a89d02-df5d-41e0-2e0e-33e85eb5314b.jpg',
    rating: 4.5,
    comment: 'Giày đẹp, chất lượng tốt, đi rất êm chân. Màu sắc hài hòa, shop giao hàng nhanh.',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://storage.googleapis.com/a1aa/image/c1e53cc1-013b-4056-725e-7818d58cf7c6.jpg',
    rating: 4.5,
    comment: 'Mình rất thích kiểu dáng và màu sắc của đôi giày này. Size chuẩn, đi thoải mái.',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://storage.googleapis.com/a1aa/image/b72c5efb-c1d3-4099-6054-7e1654f98740.jpg',
    rating: 4.5,
    comment: 'Đôi giày rất đẹp, chất lượng tốt, giá cả hợp lý. Sẽ ủng hộ shop tiếp.',
  },
];

const relatedProducts = [
  {
    id: 1,
    name: 'Nike Air Max 90 Trắng Đỏ',
    image: 'https://storage.googleapis.com/a1aa/image/297f3a97-1667-462a-1094-b9ad21917b17.jpg',
    alt: 'Nike Air Max 90 white red shoe side view on white background',
    originalPrice: 1700000,
    salePrice: 1450000,
    discount: 15,
    colors: ['trang-do-den'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 2,
    name: 'Nike Air Force 1 Đèn Trắng',
    image: 'https://storage.googleapis.com/a1aa/image/7e36ada3-58af-449e-9b90-f84495c507a7.jpg',
    alt: 'Nike Air Force 1 with glowing sole white shoe side view on black background',
    originalPrice: 1450000,
    salePrice: 1300000,
    discount: 10,
    colors: ['trang-nau-xam'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 3,
    name: 'Nike Blazer Mid Xám',
    image: 'https://storage.googleapis.com/a1aa/image/19b79bee-f876-4099-aeca-36dcec3fc959.jpg',
    alt: 'Nike Blazer Mid gray shoe side view on white background',
    originalPrice: 1420000,
    salePrice: 1250000,
    discount: 12,
    colors: ['xam-trang'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 4,
    name: 'Nike React Infinity Run',
    image: 'https://storage.googleapis.com/a1aa/image/0658e151-cd85-4110-4f19-fb6573b89500.jpg',
    alt: 'Nike React Infinity Run blue shoe side view on white background',
    originalPrice: 1730000,
    salePrice: 1600000,
    discount: 8,
    colors: ['xam-trang'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
];

function ProductDetail() {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(relatedProducts);
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center center' });
  const carouselRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Handle thumbnail click
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  // Handle color selection
  const handleColorClick = (colorValue) => {
    setSelectedColor(selectedColor === colorValue ? null : colorValue);
  };

  // Handle size selection
  const handleSizeClick = (size) => {
    setSelectedSize(selectedSize === size ? null : size);
  };

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      setZoomStyle({
        transform: 'scale(2)',
        transformOrigin: `${xPercent}% ${yPercent}%`,
      });
    }
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center',
    });
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    console.log(`Added ${product.name} to cart`);
    // Implement cart functionality here (e.g., dispatch to a cart context or API call)
  };

  // Filter related products
  useEffect(() => {
    const filtered = relatedProducts.filter((prod) => {
      const colorMatch = selectedColor ? prod.colors.includes(selectedColor) : true;
      const sizeMatch = selectedSize ? prod.sizes.includes(selectedSize) : true;
      return colorMatch && sizeMatch;
    });
    setFilteredProducts(filtered);

    // Update main product based on filters
    if (filtered.length > 0 && (selectedColor || selectedSize)) {
      setMainImage({ src: filtered[0].image, alt: filtered[0].alt });
      // In a real app, update product details via API or state
    }
  }, [selectedColor, selectedSize]);

  // Carousel navigation
  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item href="#">Sản phẩm</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>
      </header>

      {/* Main Content */}
      <Row gutter={32} className={styles.main}>
        {/* Images */}
        <Col xs={24} lg={12}>
          <div
            className={styles.imageContainer}
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className={styles.mainImage}
              style={zoomStyle}
            />
          </div>
          <div className={styles.thumbnails}>
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`${styles.thumbnail} ${mainImage.src === image.src ? styles.thumbnailSelected : ''}`}
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </Col>

        {/* Product Info */}
        <Col xs={24} lg={12} className={styles.productInfo}>
          <Title level={3}>{product.name}</Title>
          <Space align="center" className={styles.rating}>
            <Rate allowHalf value={product.rating} disabled />
            <Text>({product.reviews} đánh giá)</Text>
            <Text>| Đã bán {product.sold}+</Text>
          </Space>
          <div className={styles.price}>
            <Text className={styles.salePrice}>{product.price.toLocaleString()}₫</Text>
            <Text delete className={styles.originalPrice}>{product.originalPrice.toLocaleString()}₫</Text>
            <Tag color="orange">Giảm {product.discount}%</Tag>
          </div>

          {/* Color Selection */}
          <div className={styles.selection}>
            <Text strong>Chọn màu</Text>
            <div className={styles.colorOptions}>
              {product.colors.map((color) => (
                <div
                  key={color.value}
                  className={`${styles.colorButton} ${selectedColor === color.value ? styles.colorSelected : ''}`}
                  style={{ background: color.gradient }}
                  onClick={() => handleColorClick(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className={styles.selection}>
            <Text strong>Chọn size</Text>
            <div className={styles.sizeOptions}>
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeSelected : ''}`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button type="primary" icon={<ThunderboltOutlined />} size="large" className={styles.buyButton}>
              Mua ngay
            </Button>
            <Button icon={<ShoppingCartOutlined />} size="large" className={styles.cartButton}>
              Giỏ hàng
            </Button>
          </div>

          {/* Product Details */}
          <div className={styles.details}>
            <Paragraph><Text strong>Thương hiệu:</Text> {product.brand}</Paragraph>
            <Paragraph><Text strong>Chất liệu:</Text> {product.material}</Paragraph>
            <Paragraph>
              <Text strong>Màu sắc:</Text>
              {product.colorSwatches.map((color, index) => (
                <span key={index} className={styles.colorSwatch} style={{ backgroundColor: color }} />
              ))}
            </Paragraph>
            <Paragraph><Text strong>Bảo hành:</Text> {product.warranty}</Paragraph>
            <Paragraph><Text strong>Xuất xứ:</Text> {product.origin}</Paragraph>
          </div>
        </Col>
      </Row>

      {/* Product Description */}
      <div className={styles.description}>
        <Title className={styles.titleBorder} level={3}>Mô tả sản phẩm</Title>
        {product.description.map((para, index) => (
          <Paragraph key={index}>{para}</Paragraph>
        ))}
      </div>

      {/* Reviews */}
      <div className={styles.reviews}>
        <Title className={styles.titleBorder} level={3}>Đánh giá sản phẩm</Title>
        {reviews.map((review) => (
          <Card key={review.id} className={styles.reviewCard}>
            <div className={styles.review}>
              <img src={review.avatar} alt={`Avatar of ${review.name}`} className={styles.avatar} />
              <div>
                <Text strong>{review.name}</Text>
                <Rate allowHalf value={review.rating} disabled className={styles.reviewRating} />
                <Paragraph>{review.comment}</Paragraph>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Related Products */}
      <div className={styles.relatedProducts}>
        <Title className={styles.titleBorder} level={3}>Sản phẩm liên quan</Title>
        <div className={styles.carouselWrapper}>
          <Button
            icon={<LeftOutlined />}
            onClick={handlePrev}
            className={`${styles.carouselNav} ${styles.prev}`}
          />
          <Carousel ref={carouselRef} dots={false} slidesToShow={3} slidesToScroll={1} className={styles.carousel}>
            {filteredProducts.map((prod) => (
              <div key={prod.id} className={styles.carouselItem}>
                <Card
                  cover={<img src={prod.image} alt={prod.alt} className={styles.relatedImage} />}
                  className={styles.relatedCard}
                >
                  <Tag color="orange" className={styles.discountTag}>-{prod.discount}%</Tag>
                  <Card.Meta
                    title={prod.name}
                    description={
                      <div className={styles.priceContainer}>
                        <Text delete>{prod.originalPrice.toLocaleString()}₫</Text>
                        <div className={styles.priceRow}>
                          <Text strong className={styles.salePrice}>{prod.salePrice.toLocaleString()}₫</Text>
                          <Button
                            type="text"
                            className={styles.cartIconButton}
                            onClick={() => handleAddToCart(prod)}
                            icon={<i className="bi bi-bag-heart"></i>}
                          />
                        </div>
                      </div>
                    }
                  />
                </Card>
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
    </div>
  );
}

export default ProductDetail;
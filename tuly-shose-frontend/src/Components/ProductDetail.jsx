import React, { useState } from 'react';
import { Button, Card, Col, Row, Rate, message, Typography, Image, Select, Tag } from 'antd';

const { Title, Text } = Typography;

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState("Trắng Nâu Xám");
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("https://storage.googleapis.com/a1aa/image/b94000a9-b76a-4b35-4976-a23cd3d29110.jpg");

  const changeImage = (src) => {
    setMainImage(src);
  };

  const handleColorSelect = (color, imgSrc) => {
    setSelectedColor(color);
    changeImage(imgSrc);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      message.error('Vui lòng chọn màu và size giày.');
      return;
    }
    message.success(`Đã thêm giày màu ${selectedColor} size ${selectedSize} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      message.error('Vui lòng chọn màu và size giày.');
      return;
    }
    message.success(`Bạn đã chọn mua ngay giày màu ${selectedColor} size ${selectedSize}.`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Row gutter={16}>
        {/* Left: Product Images */}
        <Col md={12}>
          <Image
            alt="Nike Air Force 1 Shadow trắng nâu xám"
            src={mainImage}
            style={{ borderRadius: '8px' }}
            preview={false}
          />
          <div className="flex space-x-3 overflow-x-auto mt-4">
            {[
              {
                src: "https://storage.googleapis.com/a1aa/image/b94000a9-b76a-4b35-4976-a23cd3d29110.jpg",
                alt: "Ảnh nhỏ 1"
              },
              {
                src: "https://storage.googleapis.com/a1aa/image/2528badf-1c96-4176-c6a0-6f4ec803b844.jpg",
                alt: "Ảnh nhỏ 2"
              },
              {
                src: "https://storage.googleapis.com/a1aa/image/031830c6-0db4-40a3-ab3a-ba06aaa95435.jpg",
                alt: "Ảnh nhỏ 3"
              },
              {
                src: "https://storage.googleapis.com/a1aa/image/555d8c65-56c2-42e5-a5bf-d0a88b8a95ef.jpg",
                alt: "Ảnh nhỏ 4"
              }
            ].map((image, index) => (
              <Button key={index} onClick={() => changeImage(image.src)} style={{ border: 'none', padding: 0 }}>
                <Image
                  alt={image.alt}
                  src={image.src}
                  width={80}
                  style={{ borderRadius: '8px', marginRight: '8px' }}
                />
              </Button>
            ))}
          </div>
        </Col>
        {/* Right: Product Info */}
        <Col md={12}>
          <Title level={2}>Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11</Title>
          <div className="flex items-center">
            <Rate disabled defaultValue={4.5} />
            <Text className="ml-2">(45 đánh giá)</Text>
            <Text className="ml-2">| Đã bán 150+</Text>
          </div>
          <div className="mt-4">
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>1.350.000₫</Text>
            <Text className="ml-3" style={{ textDecoration: 'line-through', color: 'gray' }}>1.800.000₫</Text>
            <Tag color="red" className="ml-3">Giảm 25%</Tag>
          </div>
          <div className="mt-6">
            <Text strong>Chọn màu:</Text>
            <div className="flex space-x-2 mt-2">
              {[
                { color: "Trắng Nâu Xám", imgSrc: "https://storage.googleapis.com/a1aa/image/b94000a9-b76a-4b35-4976-a23cd3d29110.jpg" },
                { color: "Trắng Đỏ Đen", imgSrc: "https://storage.googleapis.com/a1aa/image/1d4b5ac2-2721-4d9f-b490-d930af4f676a.jpg" },
                { color: "Đen Trắng", imgSrc: "https://storage.googleapis.com/a1aa/image/a473356e-51db-4bb6-16ad-8f1be50aaa92.jpg" },
                { color: "Xám Trắng", imgSrc: "https://storage.googleapis.com/a1aa/image/c077e1e6-f92f-4bf1-53b7-1b2c9d5b839e.jpg" }
              ].map((item) => (
                <Button
                  key={item.color}
                  onClick={() => handleColorSelect(item.color, item.imgSrc)}
                  style={{
                    background: selectedColor === item.color ? '#1890ff' : '#f0f0f0',
                    color: selectedColor === item.color ? 'white' : 'black',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    border: 'none'
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Text strong>Chọn size:</Text>
            <Select
              className="mt-2"
              placeholder="Chọn size"
              onChange={handleSizeSelect}
              style={{ width: '100%' }}
            >
              {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map(size => (
                <Select.Option key={size} value={size}>{size}</Select.Option>
              ))}
            </Select>
          </div>
          <div className="mt-6">
            <Button type="primary" onClick={handleAddToCart} style={{ width: '48%', marginRight: '4%' }}>
              Thêm vào giỏ hàng
            </Button>
            <Button type="danger" onClick={handleBuyNow} style={{ width: '48%' }}>
              Mua ngay
            </Button>
          </div>
          <div className="mt-6">
            <Text strong>Thương hiệu:</Text> Nike
            <br />
            <Text strong>Chất liệu:</Text> Da tổng hợp cao cấp, đế cao su bền bỉ
            <br />
            <Text strong>Màu sắc:</Text> Trắng, nâu, xám
            <br />
            <Text strong>Bảo hành:</Text> 12 tháng
            <br />
            <Text strong>Xuất xứ:</Text> Việt Nam
          </div>
        </Col>
      </Row>
      {/* Product Description & Details */}
      <section className="mt-12">
        <Title level={3}>Mô tả sản phẩm</Title>
        <Text>
          Nike Air Force 1 Shadow Trắng Nâu Xám Rep 11 là phiên bản giày sneaker thời trang với thiết kế độc đáo, phối màu trắng, nâu và xám hài hòa, phù hợp cho cả nam và nữ. Được làm từ chất liệu da tổng hợp cao cấp, đế cao su bền bỉ, mang lại sự thoải mái và độ bền vượt trội khi sử dụng hàng ngày.
        </Text>
        <br />
        <Text>
          Đế giày được thiết kế với độ bám cao, chống trơn trượt hiệu quả. Form giày ôm chân, tạo cảm giác chắc chắn và thoải mái khi di chuyển. Đây là lựa chọn hoàn hảo cho những ai yêu thích phong cách streetwear năng động và cá tính.
        </Text>
        <br />
        <Text>
          Sản phẩm được bảo hành 12 tháng và cam kết chính hãng 100%. Hãy nhanh tay đặt hàng để sở hữu đôi giày thời thượng này!
        </Text>
      </section>
      {/* Reviews Section */}
      <section className="mt-12">
        <Title level={3}>Đánh giá sản phẩm</Title>
        <div>
          {[
            {
              name: "Nguyễn Văn A",
              rating: 5,
              comment: "Giày đẹp, chất lượng tốt, đi rất êm chân. Màu sắc giống hình, shop giao hàng nhanh.",
              imgSrc: "https://storage.googleapis.com/a1aa/image/b4b52f6a-b8e5-4fc2-fd14-1eb9b9c84fc6.jpg"
            },
            {
              name: "Trần Thị B",
              rating: 4,
              comment: "Mình rất thích kiểu dáng và màu sắc của đôi giày này. Size chuẩn, đi thoải mái.",
              imgSrc: "https://storage.googleapis.com/a1aa/image/b8242acc-de1f-45f7-5961-236ed092b0d4.jpg"
            },
            {
              name: "Lê Văn C",
              rating: 5,
              comment: "Đôi giày rất đẹp, chất lượng tốt, giá cả hợp lý. Sẽ ủng hộ shop tiếp.",
              imgSrc: "https://storage.googleapis.com/a1aa/image/f997f8f6-98ef-43f2-fa6f-7f842b3487dc.jpg"
            }
          ].map((review, index) => (
            <Card key={index} style={{ marginBottom: '16px' }}>
              <Row>
                <Col span={4}>
                  <Image
                    alt={`Ảnh đại diện khách hàng ${index + 1}`}
                    src={review.imgSrc}
                    width={48}
                    style={{ borderRadius: '50%' }}
                  />
                </Col>
                <Col span={20}>
                  <Text strong>{review.name}</Text>
                  <Rate disabled defaultValue={review.rating} />
                  <p>{review.comment}</p>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </section>
      {/* Related Products */}
      <section className="mt-12">
        <Title level={3}>Sản phẩm liên quan</Title>
        <Row gutter={16}>
          {[
            {
              name: "Nike Air Max 90 Trắng Đỏ",
              price: "1.450.000₫",
              imgSrc: "https://storage.googleapis.com/a1aa/image/1d4b5ac2-2721-4d9f-b490-d930af4f676a.jpg"
            },
            {
              name: "Nike Air Force 1 Đen Trắng",
              price: "1.300.000₫",
              imgSrc: "https://storage.googleapis.com/a1aa/image/a473356e-51db-4bb6-16ad-8f1be50aaa92.jpg"
            },
            {
              name: "Nike Blazer Mid Xám",
              price: "1.250.000₫",
              imgSrc: "https://storage.googleapis.com/a1aa/image/c077e1e6-f92f-4bf1-53b7-1b2c9d5b839e.jpg"
            },
            {
              name: "Nike React Infinity Run",
              price: "1.600.000₫",
              imgSrc: "https://storage.googleapis.com/a1aa/image/38afdc46-167d-4406-edf0-973fbcbd465a.jpg"
            }
          ].map((product, index) => (
            <Col key={index} span={6}>
              <Card hoverable>
                <Image
                  alt={product.name}
                  src={product.imgSrc}
                  style={{ borderRadius: '8px' }}
                />
                <Title level={4}>{product.name}</Title>
                <Text strong>{product.price}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
};

export default ProductDetail;

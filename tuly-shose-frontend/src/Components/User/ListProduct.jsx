import React, { useRef, useState, useEffect } from "react";
import {
  Breadcrumb,
  Menu,
  Select,
  Button,
  Card,
  Pagination,
  Row,
  Col,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ThunderboltOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import styles from "../CSS/ListProduct.module.css"; // Adjust the path as necessary

const { Option } = Select;

const products = [
  {
    id: 1,
    name: "Giày thể thao nam Nike Air Max",
    newPrice: "1.500.000₫",
    oldPrice: "1.800.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/3c4c1585-708b-493e-90d3-df9109889830.jpg",
    alt: "Giày thể thao nam Nike Air Max màu trắng xanh, thiết kế hiện đại, đế cao su êm ái",
    link: "/san-pham/giay-the-thao-nam-nike-air-max",
  },
  {
    id: 2,
    name: "Giày đá bóng Adidas Predator",
    newPrice: "1.200.000₫",
    oldPrice: "1.500.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/5a252150-7d7f-4024-3ca4-e4ce280cf78a.jpg",
    alt: "Giày đá bóng Adidas Predator màu đen đỏ, thiết kế ôm chân, đế giày có gai chống trượt",
    link: "/san-pham/giay-da-bong-adidas-predator",
  },
  {
    id: 3,
    name: "Giày lười Puma Speed Cat",
    newPrice: "950.000₫",
    oldPrice: "1.200.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/e97d7cb8-2010-4824-9d8b-88bc9541454b.jpg",
    alt: "Giày lười Puma Speed Cat màu xám đen, thiết kế đơn giản, chất liệu da tổng hợp cao cấp",
    link: "/san-pham/giay-luoi-puma-speed-cat",
  },
  {
    id: 4,
    name: "Giày tây da bò Converse",
    newPrice: "1.800.000₫",
    oldPrice: "2.100.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/410fe2e2-0fb4-4859-ee38-e32147155c15.jpg",
    alt: "Giày tây da bò Converse màu nâu đậm, thiết kế cổ điển, đế cao su chống trượt",
    link: "/san-pham/giay-tay-da-bo-converse",
  },
  {
    id: 5,
    name: "Giày thể thao nam Reebok Classic",
    newPrice: "1.350.000₫",
    oldPrice: "1.600.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/4b3fb163-e5ec-4b1d-6d12-02dbe0ba1452.jpg",
    alt: "Giày thể thao nam Reebok Classic màu trắng đỏ, thiết kế retro, đế cao su bền bỉ",
    link: "/san-pham/giay-the-thao-nam-reebok-classic",
  },
  {
    id: 6,
    name: "Giày đá bóng Nike Mercurial",
    newPrice: "1.700.000₫",
    oldPrice: "2.000.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/3c8ce39b-b73f-434d-df50-92b64d616ad7.jpg",
    alt: "Giày đá bóng Nike Mercurial màu vàng đen, thiết kế ôm sát, đế giày có gai chống trượt",
    link: "/san-pham/giay-da-bong-nike-mercurial",
  },
  {
    id: 7,
    name: "Giày lười Vans Classic Slip-On",
    newPrice: "850.000₫",
    oldPrice: "1.000.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/23a35aad-98a6-43ea-6e43-36a1cbd31040.jpg",
    alt: "Giày lười Vans Classic Slip-On màu đen trắng, thiết kế đơn giản, chất liệu vải canvas",
    link: "/san-pham/giay-luoi-vans-classic-slip-on",
  },
  {
    id: 8,
    name: "Giày thể thao Under Armour HOVR",
    newPrice: "1.600.000₫",
    oldPrice: "1.900.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/6982ba59-96d3-4a04-7273-002822329715.jpg",
    alt: "Giày thể thao Under Armour HOVR màu xanh dương trắng, thiết kế hiện đại, đế êm ái",
    link: "/san-pham/giay-the-thao-under-armour-hovr",
  },
  {
    id: 9,
    name: "Giày da bò New Balance 574",
    newPrice: "1.400.000₫",
    oldPrice: "1.700.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/31f5283b-b20c-46d2-685f-f7fdf3115ecc.jpg",
    alt: "Giày da bò New Balance 574 màu nâu sáng, thiết kế cổ điển, đế cao su bền bỉ",
    link: "/san-pham/giay-da-bo-new-balance-574",
  },
  {
    id: 10,
    name: "Giày thể thao Balenciaga Speed",
    newPrice: "7.500.000₫",
    oldPrice: "8.000.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/92a5ca07-4b0e-4bf4-bb06-e2a6e9fb52ff.jpg",
    alt: "Giày thể thao Balenciaga Speed màu đen trắng, thiết kế thời thượng, đế cao su dày",
    link: "/san-pham/giay-the-thao-balenciaga-speed",
  },
  {
    id: 11,
    name: "Giày da bò Clarks Desert",
    newPrice: "2.200.000₫",
    oldPrice: "2.500.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/0ff5d27a-cfd5-4187-07a0-76045270f209.jpg",
    alt: "Giày da bò Clarks Desert màu nâu đỏ, thiết kế cổ điển, đế cao su chống trượt",
    link: "/san-pham/giay-da-bo-clarks-desert",
  },
  {
    id: 12,
    name: "Giày thể thao Asics Gel Kayano",
    newPrice: "1.900.000₫",
    oldPrice: "2.200.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/a7f9b812-ea33-4c8e-26fb-b950f5822dfd.jpg",
    alt: "Giày thể thao Asics Gel Kayano màu xanh lá đậm trắng, thiết kế hỗ trợ chạy bộ, đế êm ái",
    link: "/san-pham/giay-the-thao-asics-gel-kayano",
  },
  {
    id: 13,
    name: "Giày da bò Timberland Classic",
    newPrice: "2.800.000₫",
    oldPrice: "3.100.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/7316de53-a448-40fb-8845-ec1baa7aee1c.jpg",
    alt: "Giày da bò Timberland Classic màu vàng nâu, thiết kế bền chắc, đế cao su chống trượt",
    link: "/san-pham/giay-da-bo-timberland-classic",
  },
  {
    id: 14,
    name: "Giày thể thao Nike React Infinity",
    newPrice: "1.750.000₫",
    oldPrice: "2.000.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/acee5c09-4743-4299-a1d2-1b39d3c0f79e.jpg",
    alt: "Giày thể thao Nike React Infinity màu trắng xanh dương, thiết kế hỗ trợ chạy bộ, đế êm ái",
    link: "/san-pham/giay-the-thao-nike-react-infinity",
  },
  {
    id: 15,
    name: "Giày lười Converse Chuck Taylor",
    newPrice: "900.000₫",
    oldPrice: "1.100.000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/1a12cff7-9b32-4f13-c096-4fb2e00379a0.jpg",
    alt: "Giày lười Converse Chuck Taylor màu trắng đen, thiết kế cổ điển, chất liệu vải canvas",
    link: "/san-pham/giay-luoi-converse-chuck-taylor",
  },
];

const ListProduct = () => {
  const productRef = useRef(null);
  const [productInView, setProductInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setProductInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (productRef.current) {
      observer.observe(productRef.current);
    }
    return () => {
      if (productRef.current) {
        observer.unobserve(productRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.maxW7xl}>
      {/* Breadcrumb */}
      <Breadcrumb
        separator="/"
        className={`${styles.textGray600} ${styles.mb4}`}
      >
        <Breadcrumb.Item>
          <a href="/" className={styles.linkHover}>
            Trang chủ
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a
            href="/danh-muc/giay-nam"
            className={`${styles.textBlue600} ${styles.fontSemibold}`}
          >
            Giày Nam
          </a>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${styles.gap4} ${styles.pb8}`}>
        {/* Sidebar Filters */}
        <aside
          className={`${styles.sidebar} ${styles.bgWhite} ${styles.roundedMd} ${styles.shadow} ${styles.p4}`}
        >
          <h2
            className={`${styles.textLg} ${styles.fontSemibold} ${styles.mb4} ${styles.borderB} ${styles.borderGray200} ${styles.pb2}`}
          >
            Bộ lọc
          </h2>
          {/* Category Filter */}
          <section className={styles.mb4}>
            <h3
              className={`${styles.fontSemibold} ${styles.mb2} ${styles.textGray700}`}
            >
              Danh mục
            </h3>
            <Menu
              selectedKeys={["giay-nam"]}
              mode="vertical"
              className={styles.border0}
            >
              <Menu.Item key="giay-nam">
                <a
                  href="/danh-muc/giay-nam"
                  className={`${styles.textBlue600} ${styles.fontSemibold}`}
                >
                  Giày Nam
                </a>
              </Menu.Item>
              <Menu.Item key="giay-nu">
                <a href="/danh-muc/giay-nu" className={styles.linkHover}>
                  Giày Nữ
                </a>
              </Menu.Item>
              <Menu.Item key="phu-kien">
                <a href="/danh-muc/phu-kien" className={styles.linkHover}>
                  Phụ Kiện
                </a>
              </Menu.Item>
            </Menu>
          </section>
          {/* Price Filter */}
          <section className={styles.mb4}>
            <h3
              className={`${styles.fontSemibold} ${styles.mb2} ${styles.textGray700}`}
            >
              Giá
            </h3>
            <Menu mode="vertical" className={styles.border0}>
              <Menu.Item key="price-1">
                <a href="?price=0-500000" className={styles.linkHover}>
                  Dưới 500.000₫
                </a>
              </Menu.Item>
              <Menu.Item key="price-2">
                <a href="?price=500000-1000000" className={styles.linkHover}>
                  500.000₫ - 1.000.000₫
                </a>
              </Menu.Item>
              <Menu.Item key="price-3">
                <a href="?price=1000000-2000000" className={styles.linkHover}>
                  1.000.000₫ - 2.000.000₫
                </a>
              </Menu.Item>
              <Menu.Item key="price-4">
                <a href="?price=2000000-5000000" className={styles.linkHover}>
                  2.000.000₫ - 5.000.000₫
                </a>
              </Menu.Item>
              <Menu.Item key="price-5">
                <a href="?price=5000000" className={styles.linkHover}>
                  Trên 5.000.000₫
                </a>
              </Menu.Item>
            </Menu>
          </section>
          {/* Brand Filter */}
          <section className={styles.mb4}>
            <h3
              className={`${styles.fontSemibold} ${styles.mb2} ${styles.textGray700}`}
            >
              Thương hiệu
            </h3>
            <div className={styles.maxH48}>
              <Menu mode="vertical" className={styles.border0}>
                {[
                  "nike",
                  "adidas",
                  "puma",
                  "reebok",
                  "converse",
                  "vans",
                  "under-armour",
                  "asics",
                  "new-balance",
                  "balenciaga",
                ].map((brand) => (
                  <Menu.Item key={brand}>
                    <a href={`?brand=${brand}`} className={styles.linkHover}>
                      {brand.charAt(0).toUpperCase() +
                        brand.slice(1).replace("-", " ")}
                    </a>
                  </Menu.Item>
                ))}
              </Menu>
            </div>
          </section>
          {/* Size Filter */}
          <section>
            <h3
              className={`${styles.fontSemibold} ${styles.mb2} ${styles.textGray700}`}
            >
              Kích cỡ
            </h3>
            <div className={`${styles.flex} ${styles.flexWrap} ${styles.gap2}`}>
              {["38", "39", "40", "41", "42", "43", "44"].map((size) => (
                <a
                  key={size}
                  href={`?size=${size}`}
                  className={`${styles.border} ${styles.borderGray300} ${styles.rounded} ${styles.px3} ${styles.py1} ${styles.textGray600} ${styles.sizeLinkHover}`}
                >
                  {size}
                </a>
              ))}
            </div>
          </section>
        </aside>

        {/* Product List */}
        <section className={styles.flex1}>
          <div
            className={`${styles.flex} ${styles.flexCol} ${styles.mdFlexRow} ${styles.itemsCenter} ${styles.justifyBetween} ${styles.mb4}`}
          >
            <h1
              className={`${styles.textXl} ${styles.fontBold} ${styles.textGray800} ${styles.mb4} ${styles.mdMb0}`}
            >
              Giày Nam
            </h1>
            <div
              className={`${styles.flex} ${styles.itemsCenter} ${styles.spaceX3} ${styles.textGray600}`}
            >
              <span className={styles.sortLabel}>Sắp xếp theo:</span>
              <Select
                defaultValue="default"
                className={styles.sortSelect}
                aria-label="Sắp xếp sản phẩm"
              >
                <Option value="default">Mặc định</Option>
                <Option value="price-asc">Giá tăng dần</Option>
                <Option value="price-desc">Giá giảm dần</Option>
                <Option value="newest">Mới nhất</Option>
                <Option value="popular">Phổ biến</Option>
              </Select>
            </div>
          </div>

          <div ref={productRef}>
            {productInView ? (
              <Row
                gutter={[8, 8]}
                justify="start"
                className={styles.productRow}
              >
                {products.map((product) => (
                  <Col key={product.id} xs={12} sm={8} md={6} lg={6}>
                    <Card
                      hoverable
                      className={styles.customCard}
                      style={{
                        backgroundColor: "white",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      cover={
                        <div style={{ position: "relative" }}>
                          <a href={product.link}>
                            <img
                              src={product.image}
                              alt={product.alt}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "auto",
                                aspectRatio: "1 / 1",
                                objectFit: "cover",
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                              }}
                            />
                          </a>
                          <span
                            style={{
                              position: "absolute",
                              top: 4,
                              left: 4,
                              backgroundColor: "#bbf7d0",
                              color: "#166534",
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "0 4px",
                              borderRadius: 2,
                              userSelect: "none",
                            }}
                          >
                            1:1
                          </span>
                        </div>
                      }
                    >
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          marginTop: 4,
                          lineHeight: 1.2,
                          minHeight: "2.4rem",
                        }}
                      >
                        <a href={product.link} className={styles.linkHover}>
                          {product.name}
                        </a>
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "#9ca3af",
                          textDecoration: "line-through",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {product.oldPrice}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          margin: 0,
                          color: "#16a34a",
                        }}
                      >
                        {product.newPrice}
                      </p>
                      <div className={styles.productActions}>
                        <button className={styles.productButton}>
                          <ThunderboltOutlined /> Mua ngay
                        </button>
                        <button
                          className={`${styles.productButton} ${styles.cart}`}
                        >
                          <ShoppingCartOutlined /> Giỏ hàng
                        </button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={styles.placeholder}></div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            defaultCurrent={1}
            total={50}
            showSizeChanger={false}
            className={`${styles.mt8} ${styles.flex} ${styles.justifyCenter}`}
            prevIcon={<LeftOutlined />}
            nextIcon={<RightOutlined />}
          />
        </section>
      </div>
    </div>
  );
};

export default ListProduct;

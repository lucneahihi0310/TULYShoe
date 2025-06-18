import React from "react";
import {
  Layout,
  Breadcrumb,
  Select,
  Checkbox,
  Radio,
  Button,
  Card,
  Pagination,
} from "antd";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import styles from "../../CSS/ListProduct.module.css";
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;
const { Option } = Select;

const products = [
  {
    id: 1,
    name: "Giày Nam Trắng Thể Thao",
    description: "Phong cách hiện đại, thoáng khí",
    originalPrice: "1,350,000₫",
    discountedPrice: "1,200,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/3c4c1585-708b-493e-90d3-df9109889830.jpg",
    tag: "New",
    tagColor: "blue",
  },
  {
    id: 2,
    name: "Giày Nữ Đỏ Sành Điệu",
    description: "Thanh lịch, chất liệu da bóng mượt",
    originalPrice: "1,500,000₫",
    discountedPrice: "1,200,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/5a252150-7d7f-4024-3ca4-e4ce280cf78a.jpg",
    tag: "Sale",
    tagColor: "red",
  },
  {
    id: 3,
    name: "Giày Nam Đen Đường Phố",
    description: "Năng động, đế cao su chống trượt",
    originalPrice: "1,500,000₫",
    discountedPrice: "1,350,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/e97d7cb8-2010-4824-9d8b-88bc9541454b.jpg",
    tag: "New",
    tagColor: "blue",
  },
  {
    id: 4,
    name: "Giày Nữ Trắng Thanh Lịch",
    description: "Tối giản, chất liệu vải canvas mềm mại",
    originalPrice: "1,300,000₫",
    discountedPrice: "1,100,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/410fe2e2-0fb4-4859-ee38-e32147155c15.jpg",
    tag: "New",
    tagColor: "blue",
  },
  {
    id: 5,
    name: "Giày Nam Xám Thể Thao",
    description: "Ôm chân, đế cao su đàn hồi",
    originalPrice: "1,400,000₫",
    discountedPrice: "1,250,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/4b3fb163-e5ec-4b1d-6d12-02dbe0ba1452.jpg",
    tag: "Sale",
    tagColor: "red",
  },
  {
    id: 6,
    name: "Giày Nữ Hồng Phấn",
    description: "Nhẹ nhàng, vải lưới thoáng khí",
    originalPrice: "1,300,000₫",
    discountedPrice: "1,150,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/3c8ce39b-b73f-434d-df50-92b64d616ad7.jpg",
    tag: "New",
    tagColor: "blue",
  },
  {
    id: 7,
    name: "Giày Nam Xanh Đậm",
    description: "Năng động, đế cao su chống trượt",
    originalPrice: "1,450,000₫",
    discountedPrice: "1,300,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/23a35aad-98a6-43ea-6e43-36a1cbd31040.jpg",
    tag: "Sale",
    tagColor: "red",
  },
  {
    id: 8,
    name: "Giày Nữ Đen Tối Giản",
    description: "Thanh lịch, da tổng hợp mềm mại",
    originalPrice: "1,350,000₫",
    discountedPrice: "1,180,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/6982ba59-96d3-4a04-7273-002822329715.jpg",
    tag: "New",
    tagColor: "blue",
  },
  {
    id: 9,
    name: "Giày Nam Trắng Đơn Giản",
    description: "Tối giản, vải canvas bền bỉ",
    originalPrice: "1,250,000₫",
    discountedPrice: "1,100,000₫",
    image:
      "https://storage.googleapis.com/a1aa/image/31f5283b-b20c-46d2-685f-f7fdf3115ecc.jpg",
    tag: "New",
    tagColor: "blue",
  },
];

function ListProduct() {
  const navigate = useNavigate();
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <a href="#">Trang chủ</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="#">Sản phẩm</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Giày Nam & Nữ</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.header}>
          <h1 className={styles.title}>Giày Nam & Nữ</h1>
          <Select defaultValue="default" className={styles.sortSelect}>
            <Option value="default">Mặc định</Option>
            <Option value="price-asc">Giá: Thấp đến Cao</Option>
            <Option value="price-desc">Giá: Cao đến Thấp</Option>
            <Option value="newest">Mới nhất</Option>
          </Select>
        </div>
        <div className={styles.mainContent}>
          <Sider className={styles.sider} width={250}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Giới tính</h3>
              <Checkbox.Group defaultValue={["men", "women"]}>
                <Checkbox value="men">Nam</Checkbox>
                <Checkbox value="women">Nữ</Checkbox>
              </Checkbox.Group>
            </div>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Loại giày</h3>
              <Checkbox.Group>
                <Checkbox value="sneakers">Sneakers</Checkbox>
                <Checkbox value="running">Running</Checkbox>
                <Checkbox value="casual">Casual</Checkbox>
                <Checkbox value="formal">Formal</Checkbox>
                <Checkbox value="sandals">Sandals</Checkbox>
                <Checkbox value="pattas">Pattas</Checkbox>
              </Checkbox.Group>
            </div>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Màu sắc</h3>
              <Checkbox.Group>
                <Checkbox value="white">Trắng</Checkbox>
                <Checkbox value="black">Đen</Checkbox>
                <Checkbox value="red">Đỏ</Checkbox>
                <Checkbox value="blue">Xanh dương</Checkbox>
                <Checkbox value="gray">Xám</Checkbox>
                <Checkbox value="pink">Hồng</Checkbox>
                <Checkbox value="brown">Nâu</Checkbox>
                <Checkbox value="yellow">Vàng</Checkbox>
              </Checkbox.Group>
            </div>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Giá</h3>
              <Radio.Group>
                <Radio value="0-500k">Dưới 500,000₫</Radio>
                <Radio value="500k-1m">500,000₫ - 1,000,000₫</Radio>
                <Radio value="1m-2m">1,000,000₫ - 2,000,000₫</Radio>
                <Radio value="2m+">Trên 2,000,000₫</Radio>
              </Radio.Group>
            </div>
            <Button type="primary" block className={styles.applyButton}>
              Áp dụng bộ lọc
            </Button>
          </Sider>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <Link
                to={"/products/:id"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  key={product.id}
                  className={styles.productCard}
                  cover={
                    <div className={styles.imageContainer}>
                      <img
                        alt={product.name}
                        src={product.image}
                        className={styles.productImage}
                      />
                      <span
                        className={`${styles.tag} ${
                          product.tagColor === "red"
                            ? styles.tagRed
                            : styles.tagBlue
                        }`}
                      >
                        {product.tag}
                      </span>
                    </div>
                  }
                >
                  <h2 className={styles.productName} title={product.name}>
                    <a href="#">{product.name}</a>
                  </h2>
                  <p
                    className={styles.productDescription}
                    title={product.description}
                  >
                    {product.description}
                  </p>
                  <div className={styles.priceContainer}>
                    <span className={styles.originalPrice}>
                      {product.originalPrice}
                    </span>
                  </div>
                  <div className={styles.priceAndCart}>
                    <span className={styles.discountedPrice}>
                      {product.discountedPrice}
                    </span>
                    <Button
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      className={styles.cartButton}
                      onClick={(e) => {
                        e.preventDefault(); // Ngăn Link kích hoạt
                        e.stopPropagation(); // Ngăn nổi bọt
                        navigate("/cart"); // Chuyển hướng sang /cart
                      }}
                      aria-label={`Thêm ${product.name} vào giỏ hàng`}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <Pagination
          defaultCurrent={1}
          total={50}
          className={styles.pagination}
          showSizeChanger={false}
        />
      </Content>
    </Layout>
  );
}

export default ListProduct;

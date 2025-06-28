import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Pagination,
  Button,
  Typography,
  Tag,
  Spin,
  notification,
} from "antd";
import styles from "../../CSS/ListProduct.module.css";
import { AuthContext } from "../API/AuthContext";

const { Option } = Select;
const { Title, Paragraph } = Typography;
function ListProduct() {
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    material: "",
    gender: "",
    search: "",
    sortBy: "default",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    materials: [],
    genders: [],
  });

  const limit = 12;

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const fetchFilters = async () => {
    const res = await fetch("http://localhost:9999/api/filters");
    const data = await res.json();
    setFilterOptions({
      categories: data.categories,
      brands: data.brands,
      materials: data.materials,
      genders: data.genders,
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...filters,
      page: pagination.currentPage,
      limit,
    });
    const res = await fetch(
      `http://localhost:9999/products/listproducts?${params.toString()}`
    );
    const data = await res.json();
    setProducts(data.data);
    setPagination((prev) => ({
      ...prev,
      totalPages: data.pagination.totalPages,
    }));
    setLoading(false);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === undefined ? "" : value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

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

    if (user) {
      // Đã đăng nhập
      try {
        const res = await fetch("http://localhost:9999/cartItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cartItem, user_id: user._id }),
        });

        if (res.ok) {
          notifyAddSuccess();
        } else {
          console.error("Thêm thất bại:", await res.json());
        }
      } catch (err) {
        console.error("Lỗi khi thêm vào giỏ hàng:", err);
      }
    } else {
      // Guest
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const existingIndex = guestCart.findIndex(
        (item) => item.pdetail_id === cartItem.pdetail_id
      );

      if (existingIndex >= 0) {
        guestCart[existingIndex].quantity += 1;
      } else {
        guestCart.push(cartItem);
      }

      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      notifyAddSuccess();
    }
  };

  return (
    <main className={`${styles.main} ${isVisible ? styles.fadeIn : ""}`}>
      <section className={styles.hero}>
        <Title level={1}>
          Discover Sneakers at{" "}
          <span className={styles.highlight}>TULY Shoe</span>
        </Title>
        <Paragraph>
          Find your perfect pair of sneakers from our stylish collection.
        </Paragraph>
      </section>

      <section className={styles.filterSection}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Select
              placeholder="Category"
              value={filters.category || undefined}
              onChange={(val) => handleFilterChange("category", val)}
              style={{ width: "100%" }}
              allowClear
            >
              {filterOptions.categories.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.category_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Brand"
              value={filters.brand || undefined}
              onChange={(val) => handleFilterChange("brand", val)}
              style={{ width: "100%" }}
              allowClear
            >
              {filterOptions.brands.map((b) => (
                <Option key={b._id} value={b._id}>
                  {b.brand_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Material"
              value={filters.material || undefined}
              onChange={(val) => handleFilterChange("material", val)}
              style={{ width: "100%" }}
              allowClear
            >
              {filterOptions.materials.map((m) => (
                <Option key={m._id} value={m._id}>
                  {m.material_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Gender"
              value={filters.gender || undefined}
              onChange={(val) => handleFilterChange("gender", val)}
              style={{ width: "100%" }}
              allowClear
            >
              {filterOptions.genders.map((g) => (
                <Option key={g._id} value={g._id}>
                  {g.gender_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              value={filters.sortBy}
              onChange={(val) => handleFilterChange("sortBy", val)}
              style={{ width: "100%" }}
            >
              <Option value="default">Mặc định</Option>
              <Option value="price-asc">Giá tăng dần</Option>
              <Option value="price-desc">Giá giảm dần</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Input
              placeholder="Tìm kiếm"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </Col>
        </Row>
      </section>

      <section className={styles.productGrid}>
        {loading ? (
          <Spin />
        ) : (
          <Row gutter={[16, 16]}>
            {products.length === 0 ? (
              <Paragraph>Không tìm thấy sản phẩm nào.</Paragraph>
            ) : (
              products.map((product) => {
                const hasDiscount = product.detail?.discount_percent > 0;

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.productName}
                          src={product.detail?.images?.[0]}
                          className={styles.productImage}
                        />
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
                          <>
                            <Paragraph ellipsis={{ rows: 2 }}>
                              {product.description}
                            </Paragraph>
                            <div className={styles.priceAndCartContainer}>
                              <div className={styles.priceContainer}>
                                <span
                                  className={styles.originalPrice}
                                  style={{
                                    visibility: hasDiscount
                                      ? "visible"
                                      : "hidden",
                                  }}
                                >
                                  {formatVND(product.price)}
                                </span>
                                <span className={styles.currentPrice}>
                                  {hasDiscount
                                    ? formatVND(
                                        product.detail?.price_after_discount
                                      )
                                    : formatVND(product.price)}
                                </span>
                              </div>

                              <Button
                                icon={<i className="bi bi-bag-heart" />}
                                className={styles.addToCart}
                                onClick={() => handleAddToCart(product)}
                                aria-label={`Add ${product.productName} to cart`}
                              />
                            </div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        )}
      </section>

      <section className={styles.pagination}>
        <Pagination
          current={pagination.currentPage}
          total={pagination.totalPages * limit}
          pageSize={limit}
          onChange={(page) =>
            setPagination((prev) => ({ ...prev, currentPage: page }))
          }
          showSizeChanger={false}
        />
      </section>
    </main>
  );
}

export default ListProduct;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { fetchData, postData } from "../API/ApiService";
const { Option } = Select;
const { Title, Paragraph } = Typography;

function ListProduct() {
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    material: "",
    gender: "",
    search: "",
    sortBy: "",
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
    try {
      const data = await fetchData("/api/filters/customers");
      setFilterOptions({
        categories: data.categories,
        brands: data.brands,
        materials: data.materials,
        genders: data.genders,
      });
    } catch (err) {
      console.error("Lỗi khi lấy bộ lọc:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        sortBy: filters.sortBy || "default",
        page: pagination.currentPage,
        limit,
      });

      const data = await fetchData(
        `/products/customers/listproducts?${params.toString()}`
      );
      setProducts(data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination.totalPages,
      }));
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
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

  const checkCartQuantity = (product, quantityToAdd) => {
    const cart = user
      ? JSON.parse(localStorage.getItem("user_cart") || "[]")
      : JSON.parse(localStorage.getItem("guest_cart") || "[]");
    const existingItem = cart.find(
      (item) => item.pdetail_id === product.detail._id
    );
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    return currentQuantity + quantityToAdd <= product.detail.inventory_number;
  };

  const handleAddToCart = async (product) => {
    if (product.detail.inventory_number === 0) {
      notification.error({
        message: "Sản phẩm đã hết hàng!",
        description: `Sản phẩm "${product.productName}" hiện không còn trong kho.`,
        placement: "bottomLeft",
        duration: 2,
      });
      return;
    }

    if (!checkCartQuantity(product, 1)) {
      notification.error({
        message: "Không thể thêm vào giỏ hàng!",
        description: `Sản phẩm "${product.productName}" đã đạt giới hạn số lượng trong kho (${product.detail.inventory_number}).`,
        placement: "bottomLeft",
        duration: 2,
      });
      return;
    }

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
      try {
        await postData("/cartItem/customers", {
          ...cartItem,
          user_id: user._id,
        });
        notifyAddSuccess();
        window.dispatchEvent(new Event("cartUpdated"));
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

      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      window.dispatchEvent(new Event("cartUpdated"));
      notifyAddSuccess();
    }
  };

  return (
    <main className={`${styles.main} ${isVisible ? styles.fadeIn : ""}`}>
      <section className={styles.hero}>
        <Title level={1}>
          Khám phá phong cách của bạn tại{" "}
          <span className={styles.highlight}>TULY Shoe</span>
        </Title>
        <Paragraph>
          Tìm đôi giày hoàn hảo của bạn từ bộ sưu tập thời trang của chúng tôi.
        </Paragraph>
      </section>

      <section className={styles.filterSection}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Select
              placeholder="Thể loại"
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
              placeholder="Thương hiệu"
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
              placeholder="Chất liệu"
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
              placeholder="Giới tính"
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
              placeholder="Sắp xếp"
              value={filters.sortBy || undefined}
              onChange={(val) => handleFilterChange("sortBy", val)}
              style={{ width: "100%" }}
              allowClear
            >
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
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} className={styles.flexRow}>
            {products.length === 0 ? (
              <Paragraph>Không tìm thấy sản phẩm nào.</Paragraph>
            ) : (
              products.map((product) => {
                const hasDiscount = product.detail?.discount_percent > 0;
                const isOutOfStock = product.detail?.inventory_number === 0;

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    key={product._id}
                    className={styles.sameHeightCol}
                  >
                    <Card
                      hoverable
                      className={`${styles.productCard} ${styles.sameHeightCard}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      onClick={() =>
                        navigate(`/products/${product.detail._id}`)
                      }
                      cover={
                        <div style={{ position: "relative" }}>
                          <img
                            alt={product.productName}
                            src={
                              product.detail?.images?.[0] ||
                              "/placeholder-image.jpg"
                            }
                            className={styles.productImage}
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

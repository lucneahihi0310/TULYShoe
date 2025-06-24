import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Input, Pagination, Button, Tag, Typography } from 'antd';
import styles from '../../CSS/ListProduct.module.css';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const products = [
  {
    id: 1,
    name: 'Shadow Runner',
    description: 'Sleek black sneaker with white sole, perfect for everyday wear.',
    price: 120,
    originalPrice: 150,
    color: 'black',
    category: 'sneaker',
    style: 'low-top',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/08e8502a-a81d-4c62-4ad6-21fd99a20d0b.jpg',
    alt: 'Black sneaker with white sole, modern design, side view',
  },
  {
    id: 2,
    name: 'Urban Grey',
    description: 'Modern gray sneaker with black accents, designed for urban explorers.',
    price: 135,
    originalPrice: 135,
    color: 'gray',
    category: 'sneaker',
    style: 'low-top',
    gender: 'unisex',
    image: 'https://storage.googleapis.com/a1aa/image/afe687bb-6e90-48c1-38d4-810d6134c818.jpg',
    alt: 'Gray sneaker with black accents, stylish and comfortable, side angle',
  },
  {
    id: 3,
    name: 'Crimson Flash',
    description: 'Matte black sneaker with striking red details for a bold statement.',
    price: 150,
    originalPrice: 180,
    color: 'red',
    category: 'running',
    style: 'low-top',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/cf16b0d9-61b8-412f-f585-2241dd135ff2.jpg',
    alt: 'Matte black sneaker with red details, sporty and aggressive design, side view',
  },
  {
    id: 4,
    name: 'Silver Glide',
    description: 'Light gray sneaker with white sole, perfect for a clean, minimal look.',
    price: 110,
    originalPrice: 130,
    color: 'gray',
    category: 'casual',
    style: 'low-top',
    gender: 'women',
    image: 'https://storage.googleapis.com/a1aa/image/2b8aa964-14e6-4656-b2dc-0d99ab240c64.jpg',
    alt: 'Light gray sneaker with white sole, clean and minimalistic design, side angle',
  },
  {
    id: 5,
    name: 'Gold Luxe',
    description: 'Black sneaker with subtle gold details for a luxurious touch.',
    price: 180,
    originalPrice: 200,
    color: 'gold',
    category: 'sneaker',
    style: 'low-top',
    gender: 'unisex',
    image: 'https://storage.googleapis.com/a1aa/image/a8932f0c-221b-4bb9-a2b0-5c236257fa4c.jpg',
    alt: 'Black sneaker with gold details, luxurious and elegant design, side view',
  },
  {
    id: 6,
    name: 'Monochrome High',
    description: 'Classic black and white high top sneaker with modern comfort features.',
    price: 140,
    originalPrice: 140,
    color: 'black',
    category: 'basketball',
    style: 'high-top',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/b061802d-0d3c-4563-8a04-abf29a7c4a07.jpg',
    alt: 'Black and white high top sneaker, classic style with modern comfort, side angle',
  },
  {
    id: 7,
    name: 'Neon Pulse',
    description: 'Dark gray sneaker with neon blue accents for a futuristic sporty look.',
    price: 155,
    originalPrice: 170,
    color: 'blue',
    category: 'running',
    style: 'low-top',
    gender: 'unisex',
    image: 'https://storage.googleapis.com/a1aa/image/f67d4ee1-d9d7-43e8-665a-2e5e20bde699.jpg',
    alt: 'Dark gray sneaker with neon blue accents, futuristic and sporty design, side view',
  },
  {
    id: 8,
    name: 'Phantom Chunk',
    description: 'Matte black sneaker with thick white sole for a bold chunky style.',
    price: 165,
    originalPrice: 190,
    color: 'black',
    category: 'sneaker',
    style: 'chunky',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/d8a4e8c6-4490-4bba-34b6-4a95f50cbf64.jpg',
    alt: 'Matte black sneaker with thick white sole, bold and chunky design, side angle',
  },
  {
    id: 9,
    name: 'Solar Spark',
    description: 'Light gray sneaker with bright orange details for an energetic vibe.',
    price: 130,
    originalPrice: 150,
    color: 'orange',
    category: 'casual',
    style: 'low-top',
    gender: 'women',
    image: 'https://storage.googleapis.com/a1aa/image/8030ec3d-51ac-4d00-5846-cf50dac90f72.jpg',
    alt: 'Light gray sneaker with bright orange details, energetic and stylish design, side view',
  },
  {
    id: 10,
    name: 'Silver Streak',
    description: 'Black sneaker with silver stripes for an elegant sporty look.',
    price: 145,
    originalPrice: 160,
    color: 'silver',
    category: 'basketball',
    style: 'high-top',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/fea3b087-6f82-4fea-62f4-c83d2fee6480.jpg',
    alt: 'Black sneaker with silver stripes, elegant and sporty design, side angle',
  },
  {
    id: 11,
    name: 'Yellow Flash',
    description: 'Dark gray sneaker with bright yellow accents for a bold sporty style.',
    price: 150,
    originalPrice: 180,
    color: 'yellow',
    category: 'running',
    style: 'low-top',
    gender: 'unisex',
    image: 'https://storage.googleapis.com/a1aa/image/0a63a3dc-751e-46a4-2a9e-f666bb2ffa57.jpg',
    alt: 'Dark gray sneaker with yellow accents, bold and sporty design, side view',
  },
  {
    id: 12,
    name: 'Blue Neon',
    description: 'Black sneaker with subtle blue glow accents for a futuristic look.',
    price: 160,
    originalPrice: 160,
    color: 'blue',
    category: 'sneaker',
    style: 'low-top',
    gender: 'men',
    image: 'https://storage.googleapis.com/a1aa/image/139a7f35-3eab-4a21-b36f-16e2644c96c9.jpg',
    alt: 'Black sneaker with subtle blue glow accents, futuristic and sleek design, side angle',
  },
  {
    id: 13,
    name: 'Purple Haze',
    description: 'Light gray sneaker with purple details for a stylish modern look.',
    price: 140,
    originalPrice: 155,
    color: 'purple',
    category: 'casual',
    style: 'slip-on',
    gender: 'women',
    image: 'https://storage.googleapis.com/a1aa/image/46e444f0-4a1d-4f11-dac5-0005c2794a96.jpg',
    alt: 'Light gray sneaker with purple details, stylish and modern design, side view',
  },
  {
    id: 14,
    name: 'Emerald Edge',
    description: 'Matte black sneaker with green accents for a sporty fresh style.',
    price: 155,
    originalPrice: 180,
    color: 'green',
    category: 'sneaker',
    style: 'low-top',
    gender: 'unisex',
    image: 'https://storage.googleapis.com/a1aa/image/d413e537-e506-46f4-af74-2b2a6946e56f.jpg',
    alt: 'Matte black sneaker with green accents, sporty and fresh design, side angle',
  },
];

const productsPerPage = 8;

function ListProduct() {
  const [filteredProducts, setFilteredProducts] = useState([...products]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState({
    price: 'all',
    category: 'all',
    style: 'all',
    color: 'all',
    gender: 'all',
    sortBy: 'default',
    search: '',
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filterAndSearch = () => {
    let filtered = [...products];

    // Price filter
    if (filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Style filter
    if (filters.style !== 'all') {
      filtered = filtered.filter(product => product.style === filters.style);
    }

    // Color filter (treat silver/gold as interchangeable)
    if (filters.color !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.color === 'silver' && product.color === 'gold') return true;
        if (filters.color === 'gold' && product.color === 'silver') return true;
        return product.color === filters.color;
      });
    }

    // Gender filter
    if (filters.gender !== 'all') {
      filtered = filtered.filter(product => product.gender === filters.gender);
    }

    // Search filter
    if (filters.search) {
      const searchValue = filters.search.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue)
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - b.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterAndSearch();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  return (
    <main className={`${styles.main} ${isVisible ? styles.fadeIn : ''}`}>
      <section className={`${styles.hero} ${styles.fadeIn}`}>
        <Title level={1} className={styles.heroTitle}>
          Discover the Latest Sneakers at <span className={styles.highlight}>TULY Shoe</span>
        </Title>
        <Paragraph className={styles.heroDescription}>
          Step up your style with our exclusive collection of premium sneakers. Designed for comfort, crafted for style.
        </Paragraph>
      </section>

      <section className={`${styles.filterSection} ${styles.fadeIn}`}>
        <Row gutter={[16, 16]} className={styles.filterRow}>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Price Range</label>
              <Select
                value={filters.price}
                onChange={value => handleFilterChange('price', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="all">All Prices</Option>
                <Option value="0-100">$0 - $100</Option>
                <Option value="101-130">$101 - $130</Option>
                <Option value="131-160">$131 - $160</Option>
                <Option value="161-200">$161 - $200</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Category</label>
              <Select
                value={filters.category}
                onChange={value => handleFilterChange('category', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="all">All Categories</Option>
                <Option value="sneaker">Sneaker</Option>
                <Option value="running">Running</Option>
                <Option value="basketball">Basketball</Option>
                <Option value="casual">Casual</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Style</label>
              <Select
                value={filters.style}
                onChange={value => handleFilterChange('style', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="all">All Styles</Option>
                <Option value="low-top">Low Top</Option>
                <Option value="high-top">High Top</Option>
                <Option value="slip-on">Slip On</Option>
                <Option value="chunky">Chunky</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Color</label>
              <Select
                value={filters.color}
                onChange={value => handleFilterChange('color', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="all">All Colors</Option>
                <Option value="black">Black</Option>
                <Option value="gray">Gray</Option>
                <Option value="white">White</Option>
                <Option value="red">Red</Option>
                <Option value="blue">Blue</Option>
                <Option value="yellow">Yellow</Option>
                <Option value="green">Green</Option>
                <Option value="purple">Purple</Option>
                <Option value="gold">Gold</Option>
                <Option value="orange">Orange</Option>
                <Option value="silver">Silver</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Gender</label>
              <Select
                value={filters.gender}
                onChange={value => handleFilterChange('gender', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="all">All Genders</Option>
                <Option value="men">Men</Option>
                <Option value="women">Women</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <div className={styles.filterItem}>
              <label className={styles.filterLabel}>Sort By</label>
              <Select
                value={filters.sortBy}
                onChange={value => handleFilterChange('sortBy', value)}
                className={styles.select}
                popupClassName={styles.dropdown}
              >
                <Option value="default">Default</Option>
                <Option value="price-asc">Price: Low to High</Option>
                <Option value="price-desc">Price: High to Low</Option>
                <Option value="name-asc">Name: A to Z</Option>
                <Option value="name-desc">Name: Z to A</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </section>

      <section className={`${styles.searchSection} ${styles.fadeIn}`}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search sneakers..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </Col>
          <Col xs={24} md={16}>
            <span className={styles.resultsCount}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
          </Col>
        </Row>
      </section>

      <section className={`${styles.productGrid} ${styles.fadeIn}`}>
        {productsToShow.length === 0 ? (
          <Paragraph className={styles.noProducts}>No products found.</Paragraph>
        ) : (
          <Row gutter={[16, 16]} className={styles.productRow}>
            {productsToShow.map((product, index) => {
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={<img alt={product.alt} src={product.image} className={styles.productImage} />}
                    className={`${styles.productCard} ${styles.fadeIn}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    {discountPercent > 0 && (
                      <Tag color="purple" className={styles.discountTag}>
                        -{discountPercent}%
                      </Tag>
                    )}
                    <Card.Meta
                      title={<span className={styles.productName}>{product.name}</span>}
                      description={
                        <div className={styles.productInfo}>
                          <Paragraph ellipsis={{ rows: 2 }} className={styles.productDescription}>
                            {product.description}
                          </Paragraph>
                          <div className={styles.priceAndCartContainer}>
                            <div className={styles.priceContainer}>
                              {discountPercent > 0 && (
                                <span className={styles.originalPrice}>
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className={styles.currentPrice}>${product.price.toFixed(2)}</span>
                            </div>
                            <Button
                              icon={<i className="bi bi-bag-heart"></i>}
                              className={styles.addToCart}
                              aria-label={`Add ${product.name} to cart`}
                            />
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </section>

      <section className={`${styles.pagination} ${styles.fadeIn}`}>
        <Pagination
          current={currentPage}
          total={filteredProducts.length}
          pageSize={productsPerPage}
          onChange={page => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          showSizeChanger={false}
        />
      </section>
    </main>
  );
}

export default ListProduct;
import React, { useEffect, useState } from 'react';
import { Table, Button, InputNumber } from 'antd';
import styles from '../../CSS/CartItem.module.css';

const cartData = [
  {
    key: '1',
    product: {
      name: 'Black Runner Sneakers',
      description: "Men's Running Shoe",
      size: '42',
      image: 'https://storage.googleapis.com/a1aa/image/91177bfd-d842-4f47-4d6b-4100b356cb39.jpg',
    },
    price: 120.00,
    quantity: 2,
    total: 240.00,
  },
  {
    key: '2',
    product: {
      name: 'Gray Slip-On Casuals',
      description: 'Unisex Casual Shoe',
      size: '39',
      image: 'https://storage.googleapis.com/a1aa/image/b2a6dc4e-2448-4bbb-f90e-b856b310d8cc.jpg',
    },
    price: 85.00,
    quantity: 1,
    total: 85.00,
  },
  {
    key: '3',
    product: {
      name: 'White High-Top Sneakers',
      description: "Men's Basketball Shoe",
      size: '44',
      image: 'https://storage.googleapis.com/a1aa/image/7fafa32f-4080-43e1-364d-fb07d3b1ccb9.jpg',
    },
    price: 150.00,
    quantity: 1,
    total: 150.00,
  },
  {
    key: '4',
    product: {
      name: 'Black Leather Loafers',
      description: "Men's Formal Shoe",
      size: '43',
      image: 'https://storage.googleapis.com/a1aa/image/c1809157-e43e-4a05-1ff1-05abb9a73dd9.jpg',
    },
    price: 180.00,
    quantity: 1,
    total: 180.00,
  },
  {
    key: '5',
    product: {
      name: 'White Canvas Slip-Ons',
      description: 'Unisex Casual Shoe',
      size: '40',
      image: 'https://storage.googleapis.com/a1aa/image/8434eade-2ea2-429b-99dc-0aa9fc314921.jpg',
    },
    price: 75.00,
    quantity: 3,
    total: 225.00,
  },
];

const columns = [
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    render: (product) => (
      <div className={styles.productContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
        <div>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.productSize}>Size: {product.size}</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'center',
    render: (price) => `$${price.toFixed(2)}`,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    render: (quantity, record) => (
      <InputNumber
        min={1}
        defaultValue={quantity}
        className={styles.quantityInput}
        aria-label={`Quantity for ${record.product.name}`}
      />
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
    render: (total) => `$${total.toFixed(2)}`,
  },
  {
    title: 'Remove',
    key: 'remove',
    align: 'center',
    render: (_, record) => (
      <Button
        type="text"
        icon={<i className={`fas fa-trash-alt ${styles.removeIcon}`}></i>}
        aria-label={`Remove ${record.product.name} from cart`}
      />
    ),
  },
];

const CartItem = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className={`${styles.main} ${isVisible ? styles.fadeIn : ''}`}>
      <h2 className={styles.title}>Your Cart</h2>
      <div className={styles.cartContainer}>
        <section className={styles.cartSection}>
          <Table
            dataSource={cartData}
            columns={columns}
            pagination={false}
            className={styles.cartTable}
            rowClassName={styles.tableRow}
          />
        </section>
        <aside className={styles.orderSummary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>$880.00</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Shipping</span>
              <span>$25.00</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Tax (8%)</span>
              <span>$70.40</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.total}>
              <span>Total</span>
              <span>$975.40</span>
            </div>
          </div>
          <Button
            className={styles.checkoutButton}
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </main>
  );
};

export default CartItem;
import React, { useState } from 'react';
import { Table, Input, Select, Space, Typography, Button, Modal, Descriptions, Image } from 'antd';

const { Option } = Select;
const { Search } = Input;
const { Text, Title } = Typography;

const ProductList = () => {
  const brands = [
    { _id: '60a4c8b2f9a2d3c4e5f6a811', name: 'Nike' },
    { _id: '60a4c8b2f9a2d3c4e5f6a814', name: 'Converse' },
  ];

  const rawProducts = [
    {
      _id: '60a4c8b2f9a2d3c4e5f6a801',
      productName: 'Giày thể thao Nike Air',
      description: 'Giày thể thao thời trang, thoáng khí, phù hợp cho mọi hoạt động thể thao và di chuyển hàng ngày.',
      price: 1500000,
      brand_id: '60a4c8b2f9a2d3c4e5f6a811',
    },
    {
      _id: '60a4c8b2f9a2d3c4e5f6a804',
      productName: 'Giày bệt Converse',
      description: 'Giày bệt phong cách trẻ trung, phù hợp với học sinh, sinh viên và người đi làm yêu thích sự thoải mái.',
      price: 800000,
      brand_id: '60a4c8b2f9a2d3c4e5f6a814',
    },
  ];

  const products = rawProducts.map(product => ({
    ...product,
    brandName: brands.find(b => b._id === product.brand_id)?.name || 'Không rõ',
    image: 'https://via.placeholder.com/100',
  }));

  const [searchText, setSearchText] = useState('');
  const [brandFilter, setBrandFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.productName.toLowerCase().includes(searchText.toLowerCase());
    const matchBrand = brandFilter ? product.brand_id === brandFilter : true;
    return matchSearch && matchBrand;
  });

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: image => (
        <img
          src={image}
          alt="product"
          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: price => (
        <Text strong style={{ color: '#e53935' }}>
          {price.toLocaleString('vi-VN')}₫
        </Text>
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
      filters: brands.map(b => ({ text: b.name, value: b._id })),
      onFilter: (value, record) => record.brand_id === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Danh sách sản phẩm</Title>
      <Space style={{ marginBottom: 16 }} size="middle" wrap>
        <Search
          placeholder="Tìm kiếm tên sản phẩm"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Select
          allowClear
          placeholder="Lọc theo thương hiệu"
          style={{ width: 200 }}
          onChange={value => setBrandFilter(value)}
        >
          {brands.map(brand => (
            <Option key={brand._id} value={brand._id}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredProducts}
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        title="Chi tiết sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedProduct && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên sản phẩm">
              {selectedProduct.productName}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh">
              <Image
                width={150}
                src={selectedProduct.image}
                alt="Ảnh sản phẩm"
              />
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {selectedProduct.description}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              <Text strong style={{ color: '#e53935' }}>
                {selectedProduct.price.toLocaleString('vi-VN')}₫
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {selectedProduct.brandName}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;

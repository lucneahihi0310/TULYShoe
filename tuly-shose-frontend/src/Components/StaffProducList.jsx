import React, { useState } from 'react';
import { Table } from 'antd';

const ProductList = () => {
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

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <img
          src={image}
          alt={record.alt}
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a href={record.link}>{text}</a>,
    },
    {
  title: 'Giá mới',
  dataIndex: 'newPrice',
  key: 'newPrice',
  sorter: (a, b) =>
    parseInt(a.newPrice.replace(/[₫.]/g, '')) -
    parseInt(b.newPrice.replace(/[₫.]/g, '')),
  render: (price) => price,
},
{
  title: 'Giá cũ',
  dataIndex: 'oldPrice',
  key: 'oldPrice',
  sorter: (a, b) =>
    parseInt(a.oldPrice.replace(/[₫.]/g, '')) -
    parseInt(b.oldPrice.replace(/[₫.]/g, '')),
  render: (price) => price,
}

  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
  <div className="sidebar">...</div>
  <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ textAlign: 'center' }}>Danh sách sản phẩm</h2>
    <Table
      columns={columns}
      dataSource={products.map((item) => ({ ...item, key: item.id }))}
      pagination={{ pageSize: 5 }}
      scroll={{ y: 600 }}
    />
  </div>
</div>

  );
};

export default ProductList;

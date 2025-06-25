import React, { useState } from "react";
import { Col, Input, Row, Button, Card, Space, Divider, Modal, Form } from "antd";
const { Meta } = Card
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const productList = [
    {
        id: "1",
        name: "Nike Air Max 270",
        price: 2990000,
        category: "Running",
        imageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/14a27a5c-33ef-4f9e-bff8-5f7111ddb8fd/NIKE+VOMERO+18.png"
    },
    {
        id: "2",
        name: "Adidas Ultraboost 22",
        price: 3200000,
        category: "Running",
        imageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/14a27a5c-33ef-4f9e-bff8-5f7111ddb8fd/NIKE+VOMERO+18.png"
    },
    {
        id: "3",
        name: "Converse Chuck Taylor All Star",
        price: 1350000,
        category: "Casual",
        imageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/14a27a5c-33ef-4f9e-bff8-5f7111ddb8fd/NIKE+VOMERO+18.png"
    },
    {
        id: "4",
        name: "Nike Dunk Low Retro",
        price: 2800000,
        category: "Basketball",
        imageUrl: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/14a27a5c-33ef-4f9e-bff8-5f7111ddb8fd/NIKE+VOMERO+18.png"
    }
];


const ManagerProduct = () => {
    //xử lý add product
    const [addProduct, setAddProduct] = useState(false);
    const showAddProductModal = () => {
        setAddProduct(true);
    };
    const handleAddProductCancel = () => {
        setAddProduct(false);
    };

    //xử lý product detail và edit , delete product
    const [form] = Form.useForm();
    const [productDetail, setproductDetail] = useState(false);
    const showProductDetail = (product) => {
        form.setFieldsValue({
            name: product.name,
            price: product.price
        });
        setproductDetail(true);
    };
    const handleProductDetailCancel = () => {
        setproductDetail(false);
    };

    return (
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Products</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search product..." prefix={<SearchOutlined />} />
                </Col>
                <Col span={4} offset={4}>
                    <Button style={{ color: 'black' }} shape="round" icon={<PlusOutlined />} onClick={showAddProductModal}>
                        Add New Product
                    </Button>
                    <Modal
                        title="Add new product"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={addProduct}
                        onCancel={handleAddProductCancel}
                        footer={null}>
                        <Form
                            name="wrap"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Description" name="description">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Product status" name="pstatus" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Material" name="material" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Form" name="form" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
            <Row justify={'center'} align={'middle'} style={{ padding: '5px' }}>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h5 style={{ color: "#313133" }}>All products</h5>
                    </Button>
                </Col>
            </Row>
            <Row justify={'center'} align={'middle'}>
                {
                    productList.map((product) => (
                        <div style={{ margin: '20px' }}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src={product.imageUrl} />}
                                onClick={() => showProductDetail(product)}
                            >
                                <Meta title={product.name} />
                                <div style={{ paddingTop: "5px", paddingBottom: '10px' }}>
                                    <h6 style={{ fontWeight: 'normal', color: '#545457' }}>{product.price}</h6>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex" }}>
                                        <h6 style={{ paddingRight: "5px", fontWeight: 'normal', color: '#545457' }}>Stock:</h6>
                                        <h6>926</h6>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <h6 style={{ paddingRight: "5px", fontWeight: 'normal', color: '#545457' }}>Sold: </h6>
                                        <h6>124</h6>
                                    </div>
                                </div>
                            </Card>
                            <Modal
                                title="Edit product"
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                open={productDetail}
                                onCancel={handleProductDetailCancel}
                                footer={null}>
                                <img alt="example" style={{ width: '100%', height: '250px', objectFit: "cover" }} src={product.imageUrl} />
                                <Form
                                    form={form}
                                    name="wrap"
                                    labelCol={{ flex: '110px' }}
                                    labelAlign="left"
                                    labelWrap
                                    wrapperCol={{ flex: 1 }}
                                    colon={false}
                                    style={{ paddingTop: '15px' }}
                                >
                                    <Form.Item label="Name" name="name">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Price" name="price">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label=" ">
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button type="primary" htmlType="reset">
                                            Reset
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
                    ))
                }
            </Row>
        </div>
    );
};

export default ManagerProduct;

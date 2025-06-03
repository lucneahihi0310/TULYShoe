import React from "react";
import { Col, Input, Row, Button, Card, Space, Divider } from "antd";
const { Meta } = Card
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const ManagerProduct = () => {
    return (
        <div style={{ borderRadius: '10px', padding: '10px', backgroundColor: '#f7f9fa' }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h2>Products</h2>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search product..." prefix={<SearchOutlined />} />
                </Col>
                <Col span={4} offset={4}>
                    <Button style={{ color: 'black' }} shape="round" icon={<PlusOutlined />}>
                        Add New Product
                    </Button>
                </Col>
            </Row>
            <Row justify={'center'} align={'middle'} style={{ padding: '5px' }}>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h5 style={{ color: "#313133" }}>All products</h5>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
                <Col style={{ padding: '5px' }}>
                    <Button type="text" block>
                        <h4 style={{ color: "#d0d9db" }}>All products</h4>
                    </Button>
                </Col>
            </Row>
            <Row justify={'center'} align={'middle'}>
                <div style={{ margin: '20px' }}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://bizweb.dktcdn.net/thumb/1024x1024/100/340/361/products/dx9176-106.jpg?v=1726736407430" />}
                    >
                        <Meta title="Nike WMNS NIKE GAMMA FORCEbeat" />
                        <div style={{ paddingTop: "5px", paddingBottom: '10px' }}>
                            <h6 style={{ fontWeight: 'normal', color: '#545457' }}>100,000vnđ</h6>
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
                </div>
                <div style={{ margin: '20px' }}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </div>
                <div style={{ margin: '20px' }}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </div>
                <div style={{ margin: '20px' }}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </div>
            </Row>
        </div>
    );
};

export default ManagerProduct;

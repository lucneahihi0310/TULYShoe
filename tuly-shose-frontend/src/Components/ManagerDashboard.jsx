import React from "react";
import { Col, Input, Row, Button, Card, Space, Divider } from "antd";
const { Meta } = Card
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const ManagerDashboard = () => {
    return (
        <div>
            <Row gutter={16} style={{padding: '10px'}}>
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
            <Row justify={'center'} align={'middle'} style={{padding: '10px'}}>
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

export default ManagerDashboard;

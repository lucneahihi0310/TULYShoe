import React from "react";
import { Col, Input, Row, Button, Card } from "antd";
const { Meta } = Card

const ManagerDashboard = () => {
    return (
        <>
            <Row>
                <Col span={8}>
                    <div>products</div>
                </Col>
                <Col span={8}>
                    <Input placeholder="Basic usage" />
                </Col>
                <Col span={8}>
                    <Button ghost>
                        Add new product
                    </Button>
                </Col>
            </Row>
            <Row>
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
            <Row>
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
        </>
    );
};

export default ManagerDashboard;

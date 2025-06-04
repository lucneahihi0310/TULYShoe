import React, { useState } from "react";
import { Col, Input, Row, Button, Card, Space, Modal, Form, Table } from "antd";
const { Meta } = Card
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const ManagerCategory = () => {
    //xử lý add category
    const [addCategory, setAddCategory] = useState(false);
    const showAddCategoryModal = () => {
        setAddCategory(true);
    };
    const handleAddCategoryCancel = () => {
        setAddCategory(false);
    };
    return (
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa' }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Categories</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search category..." prefix={<SearchOutlined />} />
                </Col>
                <Col span={4} offset={4}>
                    <Button style={{ color: 'black' }} shape="round" icon={<PlusOutlined />} onClick={showAddCategoryModal}>
                        Add New Category
                    </Button>
                    <Modal
                        title="Add new category"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={addCategory}
                        onCancel={handleAddCategoryCancel}
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

                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
            <Row>
                <Col>
                    a
                </Col>
            </Row>
        </div>
    );
};

export default ManagerCategory;
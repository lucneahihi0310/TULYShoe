import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Card, Space, Modal, Form, Table, Select } from "antd";
const { Meta } = Card
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios';

const ManagerCategory = () => {
    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    //xử lý add category
    const [addCategory, setAddCategory] = useState(false);
    const showAddCategoryModal = () => {
        setAddCategory(true);
    };
    const handleAddCategoryCancel = () => {
        setAddCategory(false);
    };
    //fetch data
    useEffect(() => {
        fetchCategories();
    }, [])
    const fetchCategories = async () => {
        const res = await axios.get(`http://localhost:9999/categories`);
        setCategories(res.data);
    }
    const searchCategory = categories.filter((c) => {
        const searchName = c.category_name.toLowerCase().includes(filterCategory.toLowerCase());
        const filterStatus = statusFilter === null || c.is_active === statusFilter;
        return searchName && filterStatus;
    })
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id'
        },
        {
            title: 'Category name',
            dataIndex: 'category_name',
            key: 'category_name'
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active) => active ? 'Active' : 'Inactive'
        },
        {
            title: 'Create date',
            dataIndex: 'create_at',
            key: 'create_at'
        },
        {
            title: 'Update date',
            dataIndex: 'update_at',
            key: 'update_at'
        }
    ];
    return (
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa' }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Categories</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search category..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategory(e.target.value)} />
                    <Select
                        placeholder="Filter by status"
                        allowClear
                        style={{ width: 160, marginLeft: 8 }}
                        onChange={(value) => setStatusFilter(value)}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false }
                        ]}
                    />
                </Col>
                {/* <Col span={}>
                    a
                </Col> */}
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
            <div justify={"center"} align={"middle"}>
                <Table dataSource={searchCategory} columns={columns} />
            </div>
        </div>
    );
};

export default ManagerCategory;
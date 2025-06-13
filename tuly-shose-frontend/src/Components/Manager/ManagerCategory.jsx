import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';

const ManagerCategory = () => {
    const [categories, setCategories] = useState([]);
    const [edittingRow, setEdittingRow] = useState(null);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [filterCategoryStatus, setFilterCategoryStatus] = useState(undefined);
    const [addCategory, setAddCategory] = useState(false);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    //show add category
    const showAddCategoryModal = () => {
        setAddCategory(true);
    };

    //cancel add category
    const handleCancelAddCategory = () => {
        setAddCategory(false);
        form2.resetFields();
    };

    //edit category
    const handleEditCategory = async () => {
        try {
            const record = await form.validateFields();
            console.log("Edit:", record);

            await axios.put(`http://localhost:9999/manager/categories/edit/${edittingRow}`, {
                category_name: record.category_name,
                is_active: record.status
            });
            setEdittingRow(null);
            fetchCategories();
        }
        catch (error) {
            console.log(error);
        }
    };

    //cancel edit category
    const handleCancelEdit = () => {
        setEdittingRow(null);
    }

    //delete category
    const handleDeleteCategory = async (id) => {
        console.log("Delete : ", id);
        await axios.delete(`http://localhost:9999/manager/categories/delete/${id}`);
        fetchCategories();
    };

    //fetch data và filter category
    useEffect(() => {
        fetchCategories();
    }, [])
    const fetchCategories = async () => {
        const res = await axios.get(`http://localhost:9999/manager/categories`);
        setCategories(res.data);
        console.log('a');
    }
    const searchCategory = categories.filter((c) => {
        const findCategoryByName = c.category_name.toLowerCase().includes(filterCategoryName.toLowerCase());
        const findCategoryByStatus = filterCategoryStatus === undefined || c.status === filterCategoryStatus;
        return findCategoryByName && findCategoryByStatus;
    })

    //setup các column
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id'
        },
        {
            title: 'Category name',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="category_name"
                            rules={[
                                { required: true, message: "Please enter category name" },
                                {
                                    validator: (_, value) => {
                                        const isDuplicate = categories.some(
                                            (cat) =>
                                                cat.category_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                cat._id !== edittingRow
                                        );
                                        return isDuplicate
                                            ? Promise.reject("This category name already exists!")
                                            : Promise.resolve();
                                    }
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="status"
                            initialValue={record.status}
                            rules={[{ required: true, message: "Please select status" }]}>
                            <Select
                                placeholder="Select status"
                                allowClear
                                options={[
                                    { label: 'Active', value: true },
                                    { label: 'Inactive', value: false }
                                ]}
                            />
                        </Form.Item>
                    )
                }
                else {
                    return (
                        <div>
                            <Tag color={record.status ? "green" : "red"}>
                                {record.status ? 'ACTIVE' : 'INACTIVE'}
                            </Tag>
                        </div>
                    )
                }
            }
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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const isEditting = edittingRow == record._id;
                return isEditting ? (
                    <Space>
                        <Button
                            color="primary"
                            variant="solid"
                            onClick={() => {
                                handleEditCategory()
                            }}>
                            Save
                        </Button>

                        <Button
                            color="danger"
                            variant="solid"
                            onClick={() => {
                                handleCancelEdit();
                            }}>
                            Cancel
                        </Button>
                    </Space>
                ) : (
                    <Space  >
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEdittingRow(record._id);
                                form.setFieldsValue({
                                    category_name: record.category_name,
                                    status: record.status
                                })
                            }}>
                            Edit
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete this category?"
                            onConfirm={() => {
                                handleDeleteCategory(record._id)
                            }}
                            okText="Yes"
                            cancelText="No">
                            <Button
                                color="danger"
                                variant="solid"
                                icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space >
                )
            }
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
                    <Input placeholder="Search category..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategoryName(e.target.value)} />
                </Col>
                <Col span={2} offset={1}>
                    <Select
                        placeholder="Filter by status"
                        allowClear
                        onChange={(value) => {
                            setFilterCategoryStatus(value)
                        }}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false }
                        ]}
                    />
                </Col>
                <Col span={4} offset={1}>
                    <Button
                        shape="round" icon={<PlusOutlined />}
                        onClick={() => {
                            showAddCategoryModal();
                        }}>
                        Add New Category
                    </Button>
                    <Modal
                        title="Add new category"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={addCategory}
                        onCancel={() => {
                            handleCancelAddCategory()
                        }}
                        footer={null}>
                        <Form
                            form={form2}
                            name="wrap"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                            onFinish={async (values) => {
                                try {
                                    console.log(values);
                                    await axios.post('http://localhost:9999/manager/categories/create', {
                                        category_name: values.category_name,
                                        is_active: values.is_active
                                    });
                                    form2.resetFields();
                                    setAddCategory(false);
                                    fetchCategories();
                                } catch (error) {
                                    console.log(error)
                                }
                            }}>
                            <Form.Item
                                label="Category name"
                                name="category_name"
                                rules={[
                                    { required: true, message: "Please enter category name" },
                                    {
                                        validator: (_, value) => {
                                            const isDuplicate = categories.some(
                                                (cat) =>
                                                    cat.category_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                    cat._id !== edittingRow
                                            );
                                            return isDuplicate
                                                ? Promise.reject("This category name already exists!")
                                                : Promise.resolve();
                                        }
                                    }
                                ]}>
                                <Input placeholder="Enter category name" />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="is_active"
                                rules={[{ required: true, message: "Please select status" }]}>
                                <Select
                                    placeholder="Select status"
                                    allowClear
                                    options={[
                                        { label: 'Active', value: true },
                                        { label: 'Inactive', value: false }
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label=" ">
                                <Button
                                    type="primary"
                                    htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
            <div justify={"center"} align={"middle"}>
                <Form form={form}>
                    <Table rowKey="_id" dataSource={searchCategory} columns={columns} />
                </Form>
            </div>
        </div>
    );
};

export default ManagerCategory;
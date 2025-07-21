import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData, patchData } from "../API/ApiService";

const ManagerAccount = () => {
    const [categories, setCategories] = useState([]);
    const [edittingRow, setEdittingRow] = useState(null);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [form] = Form.useForm();

    //edit account
    const handleEditCategory = async () => {
        try {
            const record = await form.validateFields();
            console.log("Edit:", record);
            // await updateData('/colors/manager/edit_color', edittingRow, {
            //     color_code: record.color_code,
            //     is_active: record.status
            // }, true);
            setEdittingRow(null);
            fetchCategories();
        }
        catch (error) {
            console.log(error);
        }
    };

    //cancel edit account
    const handleCancelEdit = () => {
        setEdittingRow(null);
    }

    //delete account
    const handleDeleteCategory = async (id) => {
        console.log("Delete : ", id);
        await deleteData('/account/profile/delete', id, true);
        fetchCategories();
    };

    //ban account
    const handleBanAccount = async (banId) => {
        try {
            console.log("Ban account:", banId);
            await patchData('/account/profile/ban', banId, {
                is_active: false
            }, true);
            fetchCategories();
        }
        catch (error) {
            console.log(error);
        }
    };

    //unban account
    const handleUnbanAccount = async (banId) => {
        try {
            console.log("Unban account:", banId);
            await patchData('/account/profile/unban', banId, {
                is_active: true
            }, true);
            fetchCategories();
        }
        catch (error) {
            console.log(error);
        }
    };

    //fetch data và filter category
    useEffect(() => {
        fetchCategories();
    }, [])
    const fetchCategories = async () => {
        const res = await fetchData('/account', true);
        setCategories(res);
        console.log(res);
    }
    const searchCategory = categories.filter((c) => {
        if (!filterCategoryName) return true;

        const fullName = `${c.first_name?.trim() || ''} ${c.last_name?.trim() || ''}`.toLowerCase();
        return fullName.includes(filterCategoryName.toLowerCase());
    });


    //setup các column
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: 50,
            render: (text, record, index) => index + 1
        },
        {
            title: 'Họ và tên',
            key: 'name',
            width: 100,
            render: (_, record) => {
                if (record._id === edittingRow) {
                    return (
                        <Space>
                            <Form.Item
                                name="first_name"
                                rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Họ" />
                            </Form.Item>
                            <Form.Item
                                name="last_name"
                                rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                        </Space>
                    );
                } else {
                    const fullName = `${record.first_name?.trim() || ''} ${record.last_name?.trim() || ''}`.trim();
                    return <span>{fullName}</span>;
                }
            }
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            width: 100,
            render: (value, record) => {
                if (record._id === edittingRow) {
                    return (
                        <Space>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Email ..." />
                            </Form.Item>
                        </Space>
                    );
                } else {
                    const date = new Date(value);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng tính từ 0
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');

                    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                    return (
                        <div>
                            {formatted}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 10,
            render: (value, record) => {
                if (record._id === edittingRow) {
                    return (
                        <Space>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Email ..." />
                            </Form.Item>
                        </Space>
                    );
                } else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 100,
            render: (value, record) => {
                if (record._id === edittingRow) {
                    return (
                        <Space>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập email" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Email ..." />
                            </Form.Item>
                        </Space>
                    );
                } else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
            render: (value, record) => {
                if (record._id === edittingRow) {
                    return (
                        <Space>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập sđt" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Phone ..." />
                            </Form.Item>
                        </Space>
                    );
                } else {
                    return (
                        <div>
                            {value}
                        </div>
                    )
                }
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 50,
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
                            name="role"
                            rules={[{ required: true, message: "Please select role" }]}>
                            <Select
                                placeholder="Select role"
                                allowClear
                                options={[
                                    { label: 'User', value: 'user' },
                                    { label: 'Staff', value: 'staff' },
                                    { label: 'Managger', value: 'manager' }
                                ]}
                            />
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
            width: 50,
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <Form.Item
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
                    )
                }
                else {
                    return (
                        <div>
                            <Tag color={record.is_active ? "green" : "red"}>
                                {record.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </Tag>
                        </div>
                    )
                }
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 100,
            render: (value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'update_at',
            key: 'update_at',
            width: 100,
            render: (value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
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
                    <Space>
                        <div>
                            <Row>
                                <Button
                                    style={{ margin: '5px' }}
                                    color="primary"
                                    variant="solid"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setEdittingRow(record._id);
                                        // form.setFieldsValue({
                                        //     color_code: record.color_code,
                                        //     status: record.status
                                        // })
                                    }}>
                                    Edit
                                </Button>
                            </Row>
                            <Row>
                                {
                                    record.is_active ? (
                                        <Popconfirm
                                            title="Bạn chắc là bạn muốn ban tài khoản này chứ ?"
                                            onConfirm={() => {
                                                handleBanAccount(record._id);
                                            }}
                                            okText="Đồng ý"
                                            cancelText="Không đồng ý"
                                            okButtonProps={{ size: 'small', style: { width: "110px" } }}    // Đặt kích thước nhỏ cho nút "Yes"
                                            cancelButtonProps={{ size: 'small', style: { width: "110px" } }} // Đặt kích thước nhỏ cho nút "No"
                                        >
                                            <Button
                                                style={{ margin: '5px' }}
                                                danger
                                                type="primary"
                                                variant="solid"
                                                icon={<MinusCircleOutlined />}
                                            >
                                                Ban
                                            </Button>
                                        </Popconfirm>

                                    ) : (
                                        <Popconfirm
                                            title="Bạn chắc là bạn muốn ban tài khoản này chứ ?"
                                            onConfirm={() => {
                                                handleUnbanAccount(record._id);
                                            }}
                                            okText="Đồng ý"
                                            cancelText="Không đồng ý"
                                            okButtonProps={{ size: 'small', style: { width: "110px" } }}    // Đặt kích thước nhỏ cho nút "Yes"
                                            cancelButtonProps={{ size: 'small', style: { width: "110px" } }} // Đặt kích thước nhỏ cho nút "No"
                                        >
                                            <Button
                                                style={{ margin: '5px' }}
                                                color="primary"
                                                variant="solid"
                                                icon={<CheckCircleOutlined />}
                                            >
                                                Unban
                                            </Button>
                                        </Popconfirm>
                                    )
                                }
                            </Row>
                            <Row>
                                <Popconfirm
                                    title="Bạn chắc là bạn muốn xóa tài khoản này chứ ?"
                                    onConfirm={() => {
                                        handleDeleteCategory(record._id)
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ size: 'small', style: { width: "110px" } }}    // Đặt kích thước nhỏ cho nút "Yes"
                                    cancelButtonProps={{ size: 'small', style: { width: "110px" } }} // Đặt kích thước nhỏ cho nút "No"
                                >
                                    <Button
                                        style={{ margin: '5px' }}
                                        color="danger"
                                        variant="solid"
                                        icon={<DeleteOutlined />}>
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </Row>
                        </div>
                    </Space>
                )
            }
        }
    ];
    return (
        <div style={{ borderRadius: '0px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Tài khoản</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Tìm kiếm khách hàng..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategoryName(e.target.value)} />
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

export default ManagerAccount;
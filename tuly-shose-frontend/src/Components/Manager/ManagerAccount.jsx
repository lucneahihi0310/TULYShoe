import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, message } from "antd";
import { SearchOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData, patchData } from "../API/ApiService";

const ManagerAccount = () => {
    const [categories, setCategories] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [form] = Form.useForm();
    const [form_add] = Form.useForm();

    const openEditModal = (record) => {
        setSelectedRecord(record._id);

        const dt = new Date(record.dob);
        const pad = n => String(n).padStart(2, '0');
        const isoLocal =
            `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
            `T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
        console.log(isoLocal);
        form.setFieldsValue({
            first_name: record.first_name,
            last_name: record.last_name,
            dob: isoLocal,
            gender: record.gender,
            address: record.address_shipping_id.address,
            email: record.email,
            phone: record.phone
        });
        setIsModalOpen(true);
    };

    // Cancel modal
    const cancelEdit = () => {
        setIsModalOpen(false);
    };

    //delete account
    const handleDeleteCategory = async (id) => {
        try {
            console.log("Delete : ", id);
            await deleteData('/account/profile/delete', id, true);
            message.success("Xóa tài khoản thành công!");
            fetchCategories();
        }
        catch (error) {
            console.log(error);
        }
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
            render: (text, record, index) => index + 1
        },
        {
            title: 'Họ và tên',
            key: 'name',
            width: 200,
            render: (_, record) => {
                const fullName = `${record.first_name?.trim() || ''} ${record.last_name?.trim() || ''}`.trim();
                return <span>{fullName}</span>;
            }
        },
        {
            title: 'Thông tin',
            key: 'info',
            render: (_, record) => {
                const date = new Date(record.dob);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                const formattedDob = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                return (
                    <div>
                        <div><strong>Ngày sinh:</strong> {formattedDob}</div>
                        <div><strong>Giới tính:</strong> {record.gender}</div>
                        <div><strong>SĐT:</strong> {record.phone}</div>
                        <div><strong>Địa chỉ:</strong> {record.address_shipping_id.address}</div>
                    </div>
                );
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (value) => <div>{value}</div>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (value) => <div>{value}</div>
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (value, record) => (
                <div>
                    <Tag color={record.is_active ? "green" : "red"}>
                        {record.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => {
                const createDate = new Date(record.create_at);
                const updateDate = new Date(record.update_at);
                const formatDate = (date) => {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                };
                return (
                    <div>
                        <div><strong>Tạo:</strong> {formatDate(createDate)}</div>
                        <div><strong>Cập nhật:</strong> {formatDate(updateDate)}</div>
                    </div>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <div>
                        <Row>
                            <Button
                                style={{ margin: '5px' }}
                                color="primary"
                                variant="solid"
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(record)}
                            >
                                Edit
                            </Button>
                        </Row>
                        <Row>
                            {record.is_active ? (
                                <Popconfirm
                                    title="Bạn chắc là bạn muốn ban tài khoản này chứ ?"
                                    onConfirm={() => handleBanAccount(record._id)}
                                    okText="Đồng ý"
                                    cancelText="Không đồng ý"
                                    okButtonProps={{ size: 'small', style: { width: "110px" } }}
                                    cancelButtonProps={{ size: 'small', style: { width: "110px" } }}
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
                                    title="Bạn chắc là bạn muốn bỏ ban tài khoản này chứ ?"
                                    onConfirm={() => handleUnbanAccount(record._id)}
                                    okText="Đồng ý"
                                    cancelText="Không đồng ý"
                                    okButtonProps={{ size: 'small', style: { width: "110px" } }}
                                    cancelButtonProps={{ size: 'small', style: { width: "110px" } }}
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
                            )}
                        </Row>
                        <Row>
                            <Popconfirm
                                title="Bạn chắc là bạn muốn xóa tài khoản này chứ ?"
                                onConfirm={() => handleDeleteCategory(record._id)}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ size: 'small', style: { width: "110px" } }}
                                cancelButtonProps={{ size: 'small', style: { width: "110px" } }}
                            >
                                <Button
                                    style={{ margin: '5px' }}
                                    color="danger"
                                    variant="solid"
                                    icon={<DeleteOutlined />}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Row>
                    </div>
                </Space>
            )
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
                    <Input
                        placeholder="Tìm kiếm khách hàng..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => setFilterCategoryName(e.target.value)}
                        size="large"
                    />
                </Col>
                <Col span={4} offset={4}>
                    <Button
                        shape="round" icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                        size="large"
                    >
                        Thêm nhân viên
                    </Button>
                </Col>
            </Row>
            <div justify={"center"} align={"middle"}>
                <Table rowKey="_id" dataSource={searchCategory} columns={columns} />
            </div>

            {/* MODAL CHỈNH SỬA TÀI KHOẢN */}
            <Modal
                width={600}
                title="Chỉnh sửa tài khoản"
                open={isModalOpen}
                onCancel={cancelEdit}
                footer={null}
            >
                <Form
                    form={form}
                    name="wrap"
                    labelCol={{ flex: '110px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                    onFinish={async (values) => {
                        try {
                            console.log(values);
                            await updateData('/account/profile/update', selectedRecord, {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                dob: values.dob,
                                gender: values.gender,
                                address: values.address,
                                phone: values.phone,
                                email: values.email
                            }, true);
                            message.success("Cập nhật thành công!");
                            cancelEdit(false);
                            fetchCategories();
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                    <Form.Item name="first_name" label="Họ" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Tên" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: false }]}>
                        <Input type="datetime-local" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: false }]}>
                        <Select options={[
                            { label: "Nam", value: "Nam" },
                            { label: "Nữ", value: "Nữ" },
                            { label: "Khác", value: "Khác" },
                        ]} />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="SĐT" rules={[
                        { required: false },
                        {
                            pattern: /^\d{10}$/,
                            message: "SĐT phải là 10 chữ số",
                        }
                    ]}>
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL TẠO TÀI KHOẢN CHO STAFF*/}
            <Modal
                width={600}
                title="Tạo tài khoản nhân viên"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form_add}
                    name="wrap"
                    labelCol={{ flex: '110px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                    onFinish={async (values) => {
                        try {
                            console.log(values);
                            await postData('/account/add_staff', {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                dob: values.dob,
                                gender: values.gender,
                                address: values.address,
                                email: values.email,
                                phone: values.phone,
                                password: values.password
                            }, true);
                            message.success("Thêm tài khoản thành công!");
                            form_add.resetFields();
                            setIsAddModalOpen(false);
                            fetchCategories();
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                    <Form.Item name="first_name" label="Họ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
                        <Input type="datetime-local" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                        <Select options={[
                            { label: "Nam", value: "Nam" },
                            { label: "Nữ", value: "Nữ" },
                            { label: "Khác", value: "Khác" },
                        ]} />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password
                            placeholder="Enter your password"
                            visibilityToggle={true}
                        />
                    </Form.Item>
                    <Form.Item name="phone" label="SĐT" rules={[
                        { required: true },
                        {
                            pattern: /^\d{10}$/,
                            message: "SĐT phải là 10 chữ số",
                        }
                    ]}>
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagerAccount;
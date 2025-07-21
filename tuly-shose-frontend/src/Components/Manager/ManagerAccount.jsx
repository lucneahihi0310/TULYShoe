import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData, patchData } from "../API/ApiService";

const ManagerAccount = () => {
    const [categories, setCategories] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [form] = Form.useForm();

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
                const fullName = `${record.first_name?.trim() || ''} ${record.last_name?.trim() || ''}`.trim();
                return <span>{fullName}</span>;
            }
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            width: 100,
            render: (value, record) => {
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
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 10,
            render: (value, record) => {
                return (
                    <div>
                        {value}
                    </div>
                )
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 100,
            render: (value, record) => {
                return (
                    <div>
                        {value}
                    </div>
                )
            }
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
            render: (value, record) => {
                return (
                    <div>
                        {value}
                    </div>
                )
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 50,
            render: (value, record) => {
                return (
                    <div>
                        {value}
                    </div>
                )
            }
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 50,
            render: (value, record) => {
                return (
                    <div>
                        <Tag color={record.is_active ? "green" : "red"}>
                            {record.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </Tag>
                    </div>
                )
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
                return (
                    <Space>
                        <div>
                            <Row>
                                <Button
                                    style={{ margin: '5px' }}
                                    color="primary"
                                    variant="solid"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        // setEdittingRow(record._id);
                                        // form.setFieldsValue({
                                        //     color_code: record.color_code,
                                        //     status: record.status
                                        // })
                                        openEditModal(record);
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
                <Table rowKey="_id" dataSource={searchCategory} columns={columns} />
            </div>
            <Modal
                width={800}
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
                                phone: values.phone,
                                email: values.email
                            }, true);
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
                        {/* <Select options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                        ]} /> */}
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
        </div>
    );
};

export default ManagerAccount;
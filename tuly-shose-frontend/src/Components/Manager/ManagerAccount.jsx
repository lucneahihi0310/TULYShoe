import React, { useState, useEffect, useContext } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, message, Spin } from "antd";
import { SearchOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { fetchData, postData, updateData, deleteData, patchData } from "../API/ApiService";
import moment from 'moment';
import { AuthContext } from "../API/AuthContext";

const ManagerAccount = () => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [form_add] = Form.useForm();

    const loadingIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

    const openEditModal = (record) => {
        if (user && record._id === user._id) {
            message.warning("Không thể chỉnh sửa tài khoản đang đăng nhập.");
            return;
        }
        setSelectedRecord(record._id);
        const dt = new Date(record.dob);
        const pad = n => String(n).padStart(2, '0');
        const isoLocal =
            `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
        form.setFieldsValue({
            first_name: record.first_name,
            last_name: record.last_name,
            dob: isoLocal,
            gender: record.gender,
            address: record.address,
            email: record.email,
            phone: record.phone,
            role: record.role || 'user',
        });
        setIsModalOpen(true);
    };

    const cancelEdit = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await deleteData('/account/profile/delete', id, true);
            message.success("Xóa tài khoản thành công!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Xóa tài khoản thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleBanAccount = async (banId) => {
        setLoading(true);
        try {
            await patchData('/account/profile/ban', banId, { is_active: false }, true);
            message.success("Ban tài khoản thành công!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Ban tài khoản thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleUnbanAccount = async (banId) => {
        setLoading(true);
        try {
            await patchData('/account/profile/unban', banId, { is_active: true }, true);
            message.success("Bỏ ban tài khoản thành công!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Bỏ ban tài khoản thất bại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetchData('/account', true);
            setCategories(res);
        } catch (error) {
            console.error("Lỗi khi fetch accounts:", error);
            message.error("Lấy danh sách tài khoản thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const searchCategory = categories.filter((c) => {
        if (!filterCategoryName) return true;
        const fullName = `${c.first_name?.trim() || ''} ${c.last_name?.trim() || ''}`.toLowerCase();
        return fullName.includes(filterCategoryName.toLowerCase());
    });

    const columns = [
        {
            title: 'No',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ và tên',
            key: 'name',
            width: 200,
            render: (_, record) => {
                const fullName = `${record.first_name?.trim() || ''} ${record.last_name?.trim() || ''}`.trim();
                return <span>{fullName}</span>;
            },
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
                        <div><strong>Địa chỉ:</strong> {record.address}</div>
                    </div>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (value) => <div>{value}</div>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (value) => <div>{value}</div>,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (value, record) => (
                <Tag color={record.is_active ? "green" : "red"}>
                    {record.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            ),
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
                        <div><strong>Tạo:</strong> {moment(record.create_at).format('DD/MM/YYYY HH:mm')}</div>
                        <div><strong>Cập nhật:</strong> {moment(record.update_at).format('DD/MM/YYYY HH:mm')}</div>
                    </div>
                );
            },
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
                                disabled={user && record._id === user._id}
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
                                        disabled={user && record._id === user._id}
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
                                        disabled={user && record._id === user._id}
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
                                    disabled={user && record._id === user._id}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Row>
                    </div>
                </Space>
            ),
        },
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
                        shape="round"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                        size="large"
                    >
                        Thêm nhân viên
                    </Button>
                </Col>
            </Row>
            <div justify={"center"} align={"middle"}>
                <Table
                    rowKey="_id"
                    dataSource={searchCategory}
                    columns={columns}
                    loading={{ indicator: loadingIcon, spinning: loading }}
                />
            </div>

            <Modal
                width={600}
                title="Chỉnh sửa tài khoản"
                open={isModalOpen}
                onCancel={cancelEdit}
                footer={null}
            >
                <Form
                    form={form}
                    name="edit_account"
                    labelCol={{ flex: '110px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                    onFinish={async (values) => {
                        setLoading(true);
                        try {
                            await updateData('/account/profile/update', selectedRecord, {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                dob: values.dob,
                                gender: values.gender,
                                address: values.address,
                                phone: values.phone,
                                email: values.email,
                                role: values.role,
                            }, true);
                            message.success("Cập nhật thành công!");
                            setIsModalOpen(false);
                            form.resetFields();
                            fetchCategories();
                        } catch (error) {
                            console.error(error);
                            message.error("Cập nhật thất bại!");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <Form.Item name="first_name" label="Họ" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
                        <Input type="datetime-local" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                        <Select
                            options={[
                                { label: "Nam", value: "Nam" },
                                { label: "Nữ", value: "Nữ" },
                                { label: "Khác", value: "Khác" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: 'email', message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="SĐT"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^\d{10}$/, message: "SĐT phải là 10 chữ số" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                    >
                        <Select
                            options={[
                                { label: "User", value: "user" },
                                { label: "Staff", value: "staff" },
                                { label: "Manager", value: "manager" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                            <Button onClick={cancelEdit}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                width={600}
                title="Thêm nhân viên"
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    form_add.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form_add}
                    name="add_account"
                    labelCol={{ flex: '110px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                    onFinish={async (values) => {
                        setLoading(true);
                        try {
                            await postData('/account/add_staff', {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                dob: values.dob,
                                gender: values.gender,
                                address: values.address,
                                email: values.email,
                                phone: values.phone,
                                password: values.password,
                                role: values.role,
                            }, true);
                            message.success("Thêm nhân viên thành công!");
                            setIsAddModalOpen(false);
                            form_add.resetFields();
                            fetchCategories();
                        } catch (error) {
                            console.error(error);
                            message.error("Thêm nhân viên thất bại!");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <Form.Item name="first_name" label="Họ" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
                        <Input type="datetime-local" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                        <Select
                            options={[
                                { label: "Nam", value: "Nam" },
                                { label: "Nữ", value: "Nữ" },
                                { label: "Khác", value: "Khác" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: 'email', message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="SĐT"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^\d{10}$/, message: "SĐT phải là 10 chữ số" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                    >
                        <Select
                            options={[
                                { label: "Staff", value: "staff" },
                                { label: "Admin", value: "admin" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                            <Button onClick={() => {
                                setIsAddModalOpen(false);
                                form_add.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagerAccount;
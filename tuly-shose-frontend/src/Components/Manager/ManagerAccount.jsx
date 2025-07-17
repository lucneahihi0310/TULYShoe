import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerAccount = () => {
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

    //cancel edit category
    const handleCancelEdit = () => {
        setEdittingRow(null);
    }

    //delete category
    const handleDeleteCategory = async (id) => {
        console.log("Delete : ", id);
        // await deleteData('/colors/manager/delete_color', id, true);
        // fetchCategories();
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
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
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
            title: 'Create date',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 200
        },
        {
            title: 'Update date',
            dataIndex: 'update_at',
            key: 'update_at',
            width: 200
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
                    <Space  >
                        <Button
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
                        <Popconfirm
                            title="Are you sure to delete this color?"
                            onConfirm={() => {
                                handleDeleteCategory(record._id)
                            }}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ size: 'small', style: { width: "110px" } }}    // Đặt kích thước nhỏ cho nút "Yes"
                            cancelButtonProps={{ size: 'small', style: { width: "110px" } }} // Đặt kích thước nhỏ cho nút "No"
                        >
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
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Account</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search account..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategoryName(e.target.value)} />
                </Col>
                <Col span={2} offset={1}>
                    {/* <Select
                        placeholder="Filter by status"
                        allowClear
                        onChange={(value) => {
                            setFilterCategoryStatus(value)
                        }}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false }
                        ]}
                    /> */}
                </Col>
                <Col span={4} offset={1}>
                    <Button
                        shape="round" icon={<PlusOutlined />}
                        onClick={() => {
                            showAddCategoryModal();
                        }}>
                        Add New Account
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
                                    // await axios.post('http://localhost:9999/manager/colors/create', {
                                    //     color_code: values.color_code,
                                    //     is_active: values.is_active
                                    // });
                                    // await postData('/colors/manager/create_color', {
                                    //     color_code: values.color_code,
                                    //     is_active: values.is_active
                                    // }, true)
                                    form2.resetFields();
                                    setAddCategory(false);
                                    fetchCategories();
                                } catch (error) {
                                    console.log(error)
                                }
                            }}>
                            {/* <Form.Item
                                label="Tên"
                                name="name"
                                rules={[
                                    { required: true, message: "Please select color" },
                                    {
                                        validator: (_, value) => {
                                            const isDuplicate = categories.some(
                                                (cat) =>
                                                    cat.color_code.trim().toLowerCase() === value?.trim().toLowerCase() &&
                                                    cat._id !== edittingRow
                                            );
                                            return isDuplicate
                                                ? Promise.reject("This color already exists!")
                                                : Promise.resolve();
                                        }
                                    }
                                ]}>
                                <ColorPicker
                                    showText
                                    value={form2.getFieldValue("color_code")}
                                    onChange={(color) => {
                                        form2.setFieldsValue({
                                            color_code: color.toHexString()
                                        })
                                    }}
                                />
                            </Form.Item> */}

                            {/* <Form.Item
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
                            </Form.Item> */}

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

export default ManagerAccount;
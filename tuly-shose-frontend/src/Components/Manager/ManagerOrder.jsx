import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerOrder = () => {
    const [orders, setOrders] = useState([]);
    const [edittingRow, setEdittingRow] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategories();
    }, [])
    const fetchCategories = async () => {
        const res = await fetchData('/staff/orders');
        setOrders(res.formattedOrders);
        console.log(res.formattedOrders);
    }


    //setup các column
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: 50,
            render: (text, record, index) => index + 1
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        // <Form.Item
                        //     name="customerName"
                        //     rules={[
                        //         { required: true, message: "Please enter brand name" },
                        //         {
                        //             validator: (_, value) => {
                        //                 const isDuplicate = categories.some(
                        //                     (cat) =>
                        //                         cat.brand_name.trim().toLowerCase() === value?.trim().toLowerCase() &&
                        //                         cat._id !== edittingRow
                        //                 );
                        //                 return isDuplicate
                        //                     ? Promise.reject("This brand name already exists!")
                        //                     : Promise.resolve();
                        //             }
                        //         }
                        //     ]}>
                        //     <Input />
                        // </Form.Item>
                        <></>
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
            title: 'Thời gian đặt hàng',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        // <Form.Item
                        //     name="status"
                        //     rules={[{ required: true, message: "Please select status" }]}>
                        //     <Select
                        //         placeholder="Select status"
                        //         allowClear
                        //         options={[
                        //             { label: 'Active', value: true },
                        //             { label: 'Inactive', value: false }
                        //         ]}
                        //     />
                        // </Form.Item>
                        <></>
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
            title: 'Thời gian đặt hàng',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        // <Form.Item
                        //     name="status"
                        //     rules={[{ required: true, message: "Please select status" }]}>
                        //     <Select
                        //         placeholder="Select status"
                        //         allowClear
                        //         options={[
                        //             { label: 'Active', value: true },
                        //             { label: 'Inactive', value: false }
                        //         ]}
                        //     />
                        // </Form.Item>
                        <></>
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
            title: 'Trạng thái',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Địa chỉ',
            dataIndex: 'address_shipping',
            key: 'address_shipping',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Giao hàng dự kiến',
            dataIndex: 'delivery_date',
            key: 'delivery_date',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Note',
            dataIndex: 'order_note',
            key: 'order_note',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Thanh toán',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
            title: 'Người xác nhận',
            dataIndex: 'accepted_by',
            key: 'accepted_by',
            render: (value, record) => {
                if (record._id == edittingRow) {
                    return (
                        <></>
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
                                // handleEditCategory();
                            }}>
                            Save
                        </Button>

                        <Button
                            color="danger"
                            variant="solid"
                            onClick={() => {
                                // handleCancelEdit();
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
                                // setEdittingRow(record._id);
                                // form.setFieldsValue({
                                //     brand_name: record.brand_name,
                                //     status: record.status
                                // });
                                // console.log(record);
                            }}>
                            Edit
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete this brand?"
                            onConfirm={() => {
                                // handleDeleteCategory(record._id);
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
        <div style={{ borderRadius: '0px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Quản lý đơn hàng</h4>
                    </div>
                </Col>
                <Col span={8} offset={4}>
                    <Input placeholder="Search user..." prefix={<SearchOutlined />} onChange={(e) => setFilterCategoryName(e.target.value)} />
                </Col>
                <Col span={4} offset={4}>
                    <Select
                        placeholder="Filter by status"
                        allowClear
                        onChange={(value) => {
                            // setFilterCategoryStatus(value);
                        }}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false }
                        ]}
                    />
                </Col>
            </Row>
            <div justify={"center"} align={"middle"}>
                <Form form={form}>
                    <Table rowKey="_id" dataSource={orders} columns={columns} />
                </Form>
            </div>
        </div>
    );
};

export default ManagerOrder;
import React, { useState, useEffect, useContext } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";
import { fetchOrders, confirmOrder, updateOrderStatus } from "../API/orderApi";
import { AuthContext } from "../API/AuthContext"
import moment from 'moment';
import Swal from "sweetalert2"

const ManagerOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext)

    useEffect(() => {
        fetchOrders();
        fetchOrderStatus()
    }, [])
    const fetchOrders = async () => {
        const res = await fetchData('/staff/orders');
        const sortedOrders = res.formattedOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        setOrders(sortedOrders);
        console.log(sortedOrders);
    }
    const fetchOrderStatus = async () => {
        const res = await fetchData('/order_status/get_all_order_statuses');
        setOrderStatus(res);
        console.log(res);
    }

    const handleView = (record) => {
        console.log(record)
        setSelectedOrder(record);
        setShowModal(true);
    }

    const handleConfirmOrder = async (orderId) => {
        const confirmResult = await Swal.fire({
            title: "Xác nhận đơn hàng",
            text: "Bạn có chắc muốn xác nhận đơn hàng này?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
        })

        if (confirmResult.isConfirmed) {
            try {
                const staffId = user._id
                await confirmOrder(orderId, staffId)

                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Đơn hàng đã được xác nhận.",
                    timer: 2000,
                    showConfirmButton: false,
                })

                setOrders(
                    orders.map((order) =>
                        order._id === orderId
                            ? {
                                ...order,
                                accepted_by: `${user.first_name} ${user.last_name}`,
                                order_status: "Đã xác nhận",
                            }
                            : order,
                    ),
                )
            } catch (error) {
                Swal.fire("Lỗi", "Xác nhận đơn hàng thất bại", "error")
                console.error("Xác nhận đơn hàng thất bại:", error)
            }
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, order_status: newStatus } : o)))
            Swal.fire({
                icon: "success",
                title: "Cập nhật thành công",
                text: `Trạng thái đơn hàng đã đổi sang "${newStatus}"`,
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (error) {
            Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error")
        }
    }

    const getAvailableStatusOptions = (currentStatus) => {
        const statusFlow = {
            "Chờ xác nhận": ["Chờ xác nhận", "Đã xác nhận"],
            "Đã xác nhận": ["Đã xác nhận", "Đang vận chuyển"],
            "Đang vận chuyển": ["Đang vận chuyển", "Hoàn thành"],
            "Hoàn thành": ["Hoàn thành"],
        }
        return statusFlow[currentStatus] || []
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString("vi-VN"),
            time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        }
    }

    const getTimeAgo = (dateString) => {
        const now = new Date()
        const orderDate = new Date(dateString)
        const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60))
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        if (diffInDays < 7) return `${diffInDays} ngày trước`
        return formatDateTime(dateString).date
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
            title: 'Khách hàng',
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'order_code',
            key: 'order_code'
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (date) => (date ? moment(date).format('DD/MM/YYYY HH:mm') : 'Không có')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (value, record) => {
                const availableOptions = getAvailableStatusOptions(record?.order_status);
                return (
                    <>
                        <span>{record?.order_status}</span>
                        {record.accepted_by && availableOptions.length > 0 && (
                            <Select
                                placeholder="Chọn trạng thái tiếp theo"
                                onChange={(newStatus) => handleStatusChange(record?._id, newStatus)}
                                style={{ width: 120, marginLeft: 8 }}
                            >
                                {availableOptions.map((status) => (
                                    <Option key={status} value={status}>
                                        {status}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </>
                )
            }
        },
        {
            title: 'Giao hàng dự kiến',
            dataIndex: 'delivery_date',
            key: 'delivery_date',
            render: (date) => (date ? moment(date).format('DD/MM/YYYY HH:mm') : 'Không có')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount'
        },
        {
            title: 'Thanh toán',
            dataIndex: 'payment_status',
            key: 'payment_status'
        },
        {
            title: 'Người xác nhận',
            dataIndex: 'accepted_by',
            key: 'accepted_by',
            render: (value, record) => {
                const isAccepted = record.accepted_by;
                return isAccepted ? (
                    <>
                        {value}
                    </>
                ) : (
                    <>
                        Chưa xác nhận
                    </>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const isAccepted = record?.accepted_by;
                return isAccepted ? (
                    <Space>
                        <Button
                            title="Xem chi tiết"
                            color="primary"
                            variant="solid"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                handleView(record)
                            }}>
                            Xem chi tiết
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <div>
                            <Row style={{ marginBottom: '5px' }}>
                                <Button
                                    title="Xem chi tiết"
                                    color="primary"
                                    variant="solid"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                        handleView(record);
                                    }}>
                                    Xem chi tiết
                                </Button>
                            </Row>
                            <Row>
                                <Button
                                    title="Xác nhân đơn hàng"
                                    color="green"
                                    variant="solid"
                                    icon={<CheckOutlined />}
                                    onClick={() => {
                                        handleConfirmOrder(record._id);
                                    }}>
                                    Xác nhận
                                </Button>
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

            {/* MODAL ORDER DETAIL */}
            <Modal
                title="Chi tiết đơn hàng"
                closable={{ "aria-label": "Custom Close Button" }}
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                }}
                width={700}
                footer={null}
            >
                <>
                    <Row gutter={16}>
                        <Col span={11}>
                            <div>
                                <Row style={{
                                    backgroundColor: "#98f5f5",
                                    padding: "10px"
                                }}>
                                    <div style={{ textAlign: "center" }}>
                                        <h5>Thông tin khách hàng</h5>
                                    </div>
                                </Row>
                                <Row style={{
                                    backgroundColor: "#ddebeb",
                                    padding: "10px"
                                }}>
                                    <div>
                                        <h6>Khách hàng : {selectedOrder?.userName}</h6>
                                        <h6>Mã đơn hàng : {selectedOrder?.order_code}</h6>
                                        <h6>Trạng thái : {selectedOrder?.order_status}</h6>
                                        <h6>Ghi chú : {selectedOrder?.order_note || "Không có"}</h6>
                                    </div>
                                </Row>
                            </div>
                        </Col>
                        <Col span={11} offset={2}>
                            <Row>
                                <h5>Thông tin vận chuyển</h5>
                            </Row>
                            <Row>
                                <div>
                                    <h6>Địa chỉ : {selectedOrder?.address_shipping}</h6>
                                    <h6>Ngày đặt : {moment(selectedOrder?.order_date).format('DD/MM/YYYY')}</h6>
                                    <h6>Giờ đặt : {moment(selectedOrder?.order_status).format('HH:mm')}</h6>
                                    <h6>Giao hàng dự kiến : {moment(selectedOrder?.delivery_date).format('DD/MM/YYYY')}</h6>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <div>
                            <Row>
                                <h5>Thông tin xử lý</h5>
                            </Row>
                            <Row>
                                <Col>
                                    <div>
                                        <h6>Người xác nhận : {selectedOrder?.accepted_by || "Chưa xác nhận"}</h6>
                                        <h6>Tổng tiền : {selectedOrder?.total_amount}</h6>
                                        <h6>Thanh toán : {selectedOrder?.payment_status}</h6>
                                        <h6>Cập nhật lần cuối : {moment(selectedOrder?.update_at).format("DD/MM/YYYY")}</h6>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </>
            </Modal>
        </div>
    );
};

export default ManagerOrder;
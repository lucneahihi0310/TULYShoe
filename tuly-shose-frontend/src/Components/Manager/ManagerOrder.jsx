import React, { useState, useEffect, useContext } from "react";
import { Col, Input, Row, Button, Space, Modal, Table, Select, Spin, Flex } from "antd";
import { SearchOutlined, FilterOutlined, EyeOutlined, CheckOutlined, LoadingOutlined, FileTextOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";
import { fetchOrders, confirmOrder, updateOrderStatus } from "../API/orderApi";
import { AuthContext } from "../API/AuthContext"
import moment from 'moment';
import Swal from "sweetalert2";
import styles from "../../CSS/ManagerOrder.module.css";

const ManagerOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [filterCategoryStatus, setFilterCategoryStatus] = useState(undefined);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext)

    const loadingIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

    useEffect(() => {
        fetchOrders();
        fetchOrderStatus()
    }, [])

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchData('/staff/orders');
            const sortedOrders = res.formattedOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi khi fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchOrderStatus = async () => {
        setLoading(true);
        try {
            const res = await fetchData('/order_status/get_all_order_statuses');
            setOrderStatus(res);
        } catch (error) {
            console.error("Lỗi khi fetch order status:", error);
        } finally {
            setLoading(false);
        }
    }

    const searchCategory = orders.filter((c) => {
        const findCategoryByName = c.userName.toLowerCase().includes(filterCategoryName.toLowerCase());
        const findCategoryByStatus = filterCategoryStatus === undefined || c.order_status === filterCategoryStatus;
        return findCategoryByName && findCategoryByStatus;
    })

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
        switch (currentStatus) {
            case 'Chờ xác nhận':
                return ['Đã xác nhận', 'Đã huỷ'];
            case 'Đã xác nhận':
                return ['Đang vận chuyển'];
            case 'Đang vận chuyển':
                return ['Hoàn thành'];
            case 'Hoàn thành':
            case 'Đã huỷ':
                return [];
            default:
                return [];
        }
    };

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
                const currentStatus = record?.order_status;
                const availableOptions = getAvailableStatusOptions(currentStatus); // Trả về danh sách trạng thái tiếp theo

                return (
                    <>
                        {record.accepted_by && availableOptions.length > 0 ? (
                            <Select
                                defaultValue={currentStatus}
                                style={{ width: 160 }}
                                onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
                                options={availableOptions.map((status) => ({
                                    label: status,
                                    value: status
                                }))}
                            />
                        ) : (
                            <span>{currentStatus}</span>
                        )}
                    </>
                );
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
                    <Input
                        placeholder="Tìm kiếm theo tên khách hàng..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => setFilterCategoryName(e.target.value)}
                        size="large"
                    />
                </Col>
                <Col span={4} offset={4}>
                    <Select
                        size="large"
                        suffixIcon={<FilterOutlined />}
                        placeholder="Tất cả trạng thái"
                        allowClear
                        onChange={(value) => {
                            setFilterCategoryStatus(value);
                        }}
                        options={orderStatus.map((status) => ({
                            label: status.order_status_name,
                            value: status.order_status_name
                        }))}
                    />
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


            {/* MODAL ORDER DETAIL */}
            <Modal
                closable={{ "aria-label": "Custom Close Button" }}
                open={showModal}
                onCancel={() => {
                    setShowModal(false)
                }}
                width={700}
                footer={null}
            >
                <>
                    <Flex style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileTextOutlined style={{ fontSize: 32 }} />
                        </div>
                        <div style={{ marginLeft: '15px' }}>
                            <h4>Chi tiết đơn hàng</h4>
                            <h6>Mã đơn hàng : {selectedOrder?.order_code}</h6>
                        </div>
                    </Flex>

                    <div className={styles.sectionCard} style={{ marginBottom: '10px' }}>
                        <Row style={{
                            backgroundColor: "#98f5f5",
                            padding: "10px",
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px'
                        }}>
                            <h5>Thông tin đơn hàng</h5>
                        </Row>
                        <Row style={{
                            backgroundColor: "#ddebeb",
                            padding: "10px",
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px'
                        }}>
                            <div>
                                <h6>Khách hàng : {selectedOrder?.userName}</h6>
                                <h6>Ngày đặt : {moment(selectedOrder?.order_date).format('DD/MM/YYYY HH:MM')}</h6>
                                <h6>Trạng thái : {selectedOrder?.order_status}</h6>
                            </div>
                        </Row>
                    </div>
                    <div className={styles.sectionCard} style={{ marginBottom: '10px' }}>
                        <Row style={{
                            backgroundColor: "#f3ec1fff",
                            padding: "10px",
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px'
                        }}>
                            <h5>Thông Tin Giao Hàng</h5>
                        </Row>
                        <Row style={{
                            backgroundColor: "#ddebeb",
                            padding: "10px",
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px'
                        }}>
                            <div>
                                <h6>Địa chỉ : {selectedOrder?.address_shipping}</h6>
                                <h6>Giao hàng dự kiến : {moment(selectedOrder?.delivery_date).format('DD/MM/YYYY')}</h6>
                                <h6>Ghi chú : {selectedOrder?.order_note || "Không có"}</h6>
                            </div>
                        </Row>
                    </div>
                    <div className={styles.sectionCard} style={{ marginBottom: '10px' }}>
                        <Row style={{
                            backgroundColor: "#4ae328ff",
                            padding: "10px",
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px'
                        }}>
                            <h5>Thông tin xử lý</h5>
                        </Row>
                        <Row style={{
                            backgroundColor: "#ddebeb",
                            padding: "10px",
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px'
                        }}>
                            <div>
                                <h6>Người xác nhận : {selectedOrder?.accepted_by || "Chưa xác nhận"}</h6>
                                <h6>Tổng tiền : {selectedOrder?.total_amount}</h6>
                                <h6>Thanh toán : {selectedOrder?.payment_status}</h6>
                                <h6>Cập nhật lần cuối : {moment(selectedOrder?.update_at).format("DD/MM/YYYY")}</h6>
                            </div>
                        </Row>
                    </div>
                </>
            </Modal>
        </div>
    );
};

export default ManagerOrder;
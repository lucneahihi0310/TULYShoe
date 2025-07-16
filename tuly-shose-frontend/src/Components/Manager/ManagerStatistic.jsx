import React, { useState, useEffect } from "react";
import { Col, Input, Row, Button, Space, Modal, Form, Table, Select, Tag, Popconfirm, ColorPicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerStatistic = () => {

    return (
        <div style={{ borderRadius: '20px', padding: '10px', backgroundColor: '#f7f9fa', width: "100%" }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Thống kê</h4>
                    </div>
                </Col>
            </Row>
            {/* <div justify={"center"} align={"middle"}>
                <Form form={form}>
                    <Table rowKey="_id" dataSource={searchCategory} columns={columns} />
                </Form>
            </div> */}
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h6 style={{ fontWeight: 'normal' }}>Tổng doanh thu</h6>
                        <h5 style={{
                            color: "#1e1e2f",
                            fontWeight: "bold"
                        }}>
                            3000000 ₫
                        </h5>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h6 style={{ fontWeight: 'normal' }}>
                            Đơn hàng hôm này
                        </h6>
                        <h5 style={{
                            color: "#1e1e2f",
                            fontWeight: "bold"
                        }}>
                            0
                        </h5>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h6 style={{ fontWeight: 'normal' }}>
                            Doanh thu hôm nay
                        </h6>
                        <h5 style={{
                            color: "#1e1e2f",
                            fontWeight: "bold"
                        }}>
                            0 ₫
                        </h5>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h6 style={{ fontWeight: 'normal' }}>
                            Giá trị đơn trung bình
                        </h6>
                        <h5 style={{
                            color: "#1e1e2f",
                            fontWeight: "bold"
                        }}>
                            3000000 ₫
                        </h5>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} style={{ padding: '10px' }} >
                <Col span={12}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h5 style={{ fontWeight: 'bold', paddingBottom: '5px' }}>
                            Thống kê đơn hàng
                        </h5>
                        <Row gutter={16}>
                            <Col span={6}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Tổng số đơn hàng
                                </h6>
                            </Col>
                            <Col span={4} offset={14} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Đơn đã giao
                                </h6>
                            </Col>
                            <Col span={4} offset={14} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#21e288ff",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Đơn đang chờ
                                </h6>
                            </Col>
                            <Col span={4} offset={14} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#cdd61cff",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Đơn đã hủy
                                </h6>
                            </Col>
                            <Col span={4} offset={14} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#da1c1cff",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h5 style={{ fontWeight: 'bold', paddingBottom: '5px' }}>
                            Thống kê thanh toán
                        </h5>
                        <Row gutter={16}>
                            <Col span={6}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Tổng số sản phẩm
                                </h6>
                            </Col>
                            <Col span={4} offset={14} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "normal"
                                }}>
                                    Tổng số người dùng
                                </h6>
                            </Col>
                            <Col span={4} offset={12} style={{ textAlign: 'right' }}>
                                <h6 style={{
                                    color: "#1e1e2f",
                                    fontWeight: "bold"
                                }}>
                                    6
                                </h6>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManagerStatistic;
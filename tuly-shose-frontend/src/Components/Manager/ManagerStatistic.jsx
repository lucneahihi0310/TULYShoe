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
                        <h5>Tổng doanh thu</h5>
                        <h4>3000000vvnd</h4>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h5>Đơn hàng hôm này</h5>
                        <h4>3000000vvnd</h4>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h5>Doanh thu hôm nay</h5>
                        <h4>3000000vvnd</h4>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        <h5>Giá trị đơn trung bình</h5>
                        <h4>3000000vvnd</h4>
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
                        <h5>Thống kê đơn hàng</h5>
                        <h4>3000000vvnd</h4>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{
                        backgroundColor: '#d1e6df',
                        borderRadius: '20px',
                        padding: '20px'
                    }}>
                        h
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ManagerStatistic;
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, message, Col, Row } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ManagerStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [scheduleForm] = Form.useForm();
    const [staffForm] = Form.useForm();

    // Lấy danh sách nhân viên khi component được mount
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await fetchData('/account', true);
                // Lọc chỉ lấy nhân viên có role là "staff"
                const staffOnly = data.filter(item => item.role === 'staff');
                // Định dạng dữ liệu
                const formattedData = staffOnly.map(item => ({
                    id: item._id,
                    name: `${item.first_name} ${item.last_name}`,
                    email: item.email,
                    role: item.role,
                }));
                setStaffList(formattedData);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách nhân viên: ' + error.message);
            }
        };
        fetchStaff();
    }, []);

    // Xem lịch làm việc của nhân viên
    const viewSchedules = async (staffId) => {
        try {
            const data = await fetchData(`/staff/schedules/${staffId}`, true);
            setSchedules(data);
            setSelectedStaffId(staffId);
            // Hiển thị lịch trong modal
            Modal.info({
                title: 'Lịch làm việc',
                content: (
                    <Table
                        columns={[
                            { title: 'Ngày', dataIndex: 'schedule_date', key: 'schedule_date' },
                            { title: 'Giờ bắt đầu', dataIndex: 'scheduled_start_time', key: 'scheduled_start_time' },
                            { title: 'Giờ kết thúc', dataIndex: 'scheduled_end_time', key: 'scheduled_end_time' },
                            { title: 'Trạng thái', dataIndex: 'work_status', key: 'work_status' },
                        ]}
                        dataSource={data}
                        rowKey="_id"
                    />
                ),
                width: 800,
            });
        } catch (error) {
            message.error('Lỗi khi lấy lịch làm việc: ' + error.message);
        }
    };

    // Hiển thị modal thêm lịch làm việc
    const showAddScheduleModal = () => {
        setIsScheduleModalVisible(true);
    };

    // Xử lý khi thêm lịch làm việc
    const handleScheduleOk = async () => {
        try {
            const values = await scheduleForm.validateFields();
            // Chuyển đổi định dạng ngày và giờ
            values.schedule_date = values.scheduleDate.format('YYYY-MM-DD');
            values.scheduled_start_time = values.startTime.format('HH:mm');
            values.scheduled_end_time = values.endTime.format('HH:mm');
            delete values.scheduleDate;
            delete values.startTime;
            delete values.endTime;
            // Gửi yêu cầu tới API
            console.log(values);
            // await postData('/staff/schedules', values, true);
            message.success('Thêm lịch làm việc thành công');
            scheduleForm.resetFields();
            setIsScheduleModalVisible(false);
        } catch (error) {
            message.error('Lỗi khi thêm lịch làm việc: ' + error.message);
        }
    };

    // Hủy modal thêm lịch
    const handleScheduleCancel = () => {
        setIsScheduleModalVisible(false);
    };

    // Hiển thị modal thêm nhân viên
    // const showAddStaffModal = () => {
    //     setIsStaffModalVisible(true);
    // };

    // Xử lý khi thêm nhân viên
    // const handleStaffOk = async () => {
    //     try {
    //         const values = await staffForm.validateFields();
    //         await postData('/account/add', values, true);
    //         message.success('Thêm nhân viên thành công');
    //         staffForm.resetFields();
    //         setIsStaffModalVisible(false);
    //         // Làm mới danh sách nhân viên
    //         const data = await fetchData('/account', true);
    //         const staffOnly = data.filter(item => item.role === 'staff');
    //         const formattedData = staffOnly.map(item => ({
    //             id: item._id,
    //             name: `${item.first_name} ${item.last_name}`,
    //             email: item.email,
    //             role: item.role,
    //         }));
    //         setStaffList(formattedData);
    //     } catch (error) {
    //         message.error('Lỗi khi thêm nhân viên: ' + error.message);
    //     }
    // };

    // Hủy modal thêm nhân viên
    const handleStaffCancel = () => {
        setIsStaffModalVisible(false);
    };

    // Cột của bảng nhân viên
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button onClick={() => viewSchedules(record.id)}>Xem lịch</Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16} style={{ padding: '10px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Quản lý nhân viên</h4>
                    </div>
                </Col>
                <Col span={4} offset={16}>
                    <Button type="primary" onClick={showAddScheduleModal} style={{ marginRight: '10px' }}>
                        <PlusOutlined /> Thêm lịch làm việc
                    </Button>
                </Col>
                {/* <Col span={4} offset={0}>
                    <Button type="primary" onClick={showAddStaffModal}>
                        <PlusOutlined /> Thêm nhân viên
                    </Button>
                </Col> */}
            </Row>


            <Table columns={columns} dataSource={staffList} rowKey="id" style={{ marginTop: '20px' }} />

            {/* Modal thêm lịch làm việc */}
            <Modal title="Thêm lịch làm việc" visible={isScheduleModalVisible} onOk={handleScheduleOk} onCancel={handleScheduleCancel}>
                <Form form={scheduleForm} layout="vertical">
                    <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
                        <Select>
                            {staffList.map(staff => (
                                <Select.Option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="scheduleDate" label="Ngày làm việc" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item name="notes" label="Ghi chú">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal thêm nhân viên */}
            {/* <Modal title="Thêm nhân viên" visible={isStaffModalVisible} onOk={handleStaffOk} onCancel={handleStaffCancel}>
                <Form form={staffForm} layout="vertical">
                    <Form.Item name="first_name" label="Họ" rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                        <Select>
                            <Select.Option value="staff">Nhân viên</Select.Option>
                            <Select.Option value="manager">Quản lý</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal> */}
        </div>
    );
};

export default ManagerStaff;
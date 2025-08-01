import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, message, Col, Row, Tag, Checkbox } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { fetchData, postData } from "../API/ApiService";

const ManagerStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isViewSchedulesModalVisible, setIsViewSchedulesModalVisible] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [selectedStaffName, setSelectedStaffName] = useState('');
    const [searchDate, setSearchDate] = useState(null);
    const [scheduleForm] = Form.useForm();
    const calendarRef = useRef(null);

    // Fetch staff list when component mounts
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await fetchData('/account', true);
                const staffOnly = data.filter(item => item.role === 'staff');
                const formattedData = staffOnly.map(item => ({
                    id: item._id,
                    name: `${item.first_name} ${item.last_name}`,
                    dob: item.dob,
                    gender: item.gender,
                    address: item.address,
                    email: item.email,
                    phone: item.phone,
                    role: item.role,
                    is_active: item.is_active
                }));
                setStaffList(formattedData);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách nhân viên: ' + error.message);
            }
        };
        fetchStaff();
    }, []);

    // Fetch schedules for a staff member
    const fetchSchedules = async (staffId, staffName) => {
        try {
            const data = await fetchData(`/staff/schedules/${staffId}`, true);
            const calendarEvents = data.map(schedule => ({
                id: schedule._id,
                title: `${schedule.staff_name}: ${schedule.scheduled_start_time} - ${schedule.scheduled_end_time}`,
                start: moment(`${schedule.schedule_date}T${schedule.scheduled_start_time}:00`).toISOString(),
                end: moment(`${schedule.schedule_date}T${schedule.scheduled_end_time}:00`).toISOString(),
                extendedProps: {
                    work_status: schedule.work_status,
                    notes: schedule.notes
                }
            }));
            if (calendarEvents.length === 0) {
                message.warning('Không có lịch làm việc cho nhân viên này.');
            }
            setSchedules(calendarEvents);
            setFilteredSchedules(calendarEvents);
            setSelectedStaffId(staffId);
            setSelectedStaffName(staffName);
            setIsViewSchedulesModalVisible(true);
        } catch (error) {
            message.error('Lỗi khi lấy lịch làm việc: ' + error.message);
        }
    };

    // Handle date search
    const handleSearchDate = (date) => {
        setSearchDate(date);
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            const filtered = schedules.filter(schedule =>
                moment(schedule.start).format('YYYY-MM-DD') === formattedDate
            );
            setFilteredSchedules(filtered);
            if (calendarRef.current && filtered.length > 0) {
                calendarRef.current.getApi().gotoDate(date.toDate());
            }
        } else {
            setFilteredSchedules(schedules);
        }
    };

    // Show modal to add a schedule
    const showAddScheduleModal = () => {
        setIsScheduleModalVisible(true);
    };

    // Check for schedule conflicts
    const checkScheduleConflict = async (staffId, scheduleDate, startTime, endTime) => {
        try {
            const schedules = await fetchData(`/staff/schedules/${staffId}`, true);
            const formattedDate = scheduleDate.format('YYYY-MM-DD');
            const startMinutes = startTime.hour() * 60 + startTime.minute();
            const endMinutes = endTime.hour() * 60 + endTime.minute();

            for (const schedule of schedules) {
                if (schedule.schedule_date === formattedDate) {
                    const existingStart = parseInt(schedule.scheduled_start_time.split(':')[0]) * 60 +
                        parseInt(schedule.scheduled_start_time.split(':')[1]);
                    const existingEnd = parseInt(schedule.scheduled_end_time.split(':')[0]) * 60 +
                        parseInt(schedule.scheduled_end_time.split(':')[1]);

                    if (startMinutes < existingEnd && endMinutes > existingStart) {
                        return {
                            conflict: true,
                            message: `Lịch làm việc trùng với lịch từ ${schedule.scheduled_start_time} đến ${schedule.scheduled_end_time}`
                        };
                    }
                }
            }
            return { conflict: false };
        } catch (error) {
            throw new Error('Lỗi khi kiểm tra trùng lịch: ' + error.message);
        }
    };

    // Handle schedule submission
    const handleScheduleOk = async () => {
        try {
            const values = await scheduleForm.validateFields();

            // Check for conflicts
            const conflictCheck = await checkScheduleConflict(
                values.staffId,
                values.scheduleDate,
                values.startTime,
                values.endTime
            );

            if (conflictCheck.conflict) {
                message.error(conflictCheck.message);
                return;
            }

            const dataToSend = {
                staff_id: values.staffId,
                schedule_date: values.scheduleDate.format('YYYY-MM-DD'),
                scheduled_start_time: values.startTime.format('HH:mm'),
                scheduled_end_time: values.endTime.format('HH:mm'),
                is_recurring: values.is_recurring || false,
                recurrence_end_date: values.is_recurring ? values.recurrence_end_date?.format('YYYY-MM-DD') : null,
                notes: values.notes || '',
            };

            await postData('/staff/schedules/createSchedule', dataToSend, true);
            message.success('Thêm lịch làm việc thành công');
            scheduleForm.resetFields();
            setIsScheduleModalVisible(false);
            if (selectedStaffId) {
                fetchSchedules(selectedStaffId, selectedStaffName);
            }
        } catch (error) {
            message.error(error.message || 'Lỗi khi thêm lịch làm việc');
        }
    };

    // Cancel schedule modal
    const handleScheduleCancel = () => {
        scheduleForm.resetFields();
        setIsScheduleModalVisible(false);
    };

    // Cancel view schedules modal
    const handleViewSchedulesCancel = () => {
        setIsViewSchedulesModalVisible(false);
        setSchedules([]);
        setFilteredSchedules([]);
        setSelectedStaffId(null);
        setSelectedStaffName('');
    };

    // Table columns for staff
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: 50,
            render: (text, record, index) => index + 1
        },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob' },
        { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (value, record) => (
                <Tag color={record.is_active ? "green" : "red"}>
                    {record.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text, record) => (
                <Button onClick={() => fetchSchedules(record.id, record.name)}>Xem lịch</Button>
            ),
        },
    ];

    // Validation for time range (removed 9:00 AM to 8:00 PM restriction)
    const isValidTimeRange = (time) => {
        return !!time; // Only check if time is provided
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16} style={{ padding: '10px', marginBottom: '20px' }}>
                <Col span={4}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4>Quản lý nhân viên</h4>
                    </div>
                </Col>
                <Col span={6}>
                    {/* <DatePicker
                        format="YYYY-MM-DD"
                        onChange={handleSearchDate}
                        placeholder="Tìm kiếm theo ngày"
                        style={{ width: '100%' }}
                    /> */}
                </Col>
                <Col span={4} offset={10}>
                    <Button type="primary" onClick={showAddScheduleModal}>
                        <PlusOutlined /> Thêm lịch làm việc
                    </Button>
                </Col>
            </Row>

            <Table columns={columns} dataSource={staffList} rowKey="id" style={{ marginBottom: '20px' }} />

            {/* Modal to view schedules with FullCalendar */}
            <Modal
                title={`Lịch làm việc của ${selectedStaffName}`}
                open={isViewSchedulesModalVisible}
                onCancel={handleViewSchedulesCancel}
                footer={null}
                width={2000}
                style={{ top: 20 }}
                styles={{ height: '600px', overflowY: 'auto' }}
            >
                {filteredSchedules.length > 0 ? (
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        events={filteredSchedules}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek'
                        }}
                        eventClick={(info) => {
                            Modal.info({
                                title: 'Chi tiết lịch làm việc',
                                content: (
                                    <div>
                                        <p><strong>Nhân viên:</strong> {info.event.title.split(':')[0]}</p>
                                        <p><strong>Ngày:</strong> {moment(info.event.start).format('YYYY-MM-DD')}</p>
                                        <p><strong>Thời gian:</strong> {`${moment(info.event.start).format('HH:mm')} - ${moment(info.event.end).format('HH:mm')}`}</p>
                                        <p><strong>Trạng thái:</strong> {info.event.extendedProps.work_status || 'Chưa bắt đầu'}</p>
                                        <p><strong>Ghi chú:</strong> {info.event.extendedProps.notes || 'Không có'}</p>
                                    </div>
                                ),
                                onOk() { },
                            });
                        }}
                        locale="vi"
                        eventColor="#1890ff"
                        eventTextColor="#fff"
                        height="500px"
                    />
                ) : (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Không có lịch làm việc để hiển thị.</p>
                )}
            </Modal>

            {/* Modal to add schedule */}
            <Modal
                title="Thêm lịch làm việc"
                open={isScheduleModalVisible}
                onCancel={handleScheduleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={scheduleForm}
                    layout="vertical"
                    onFinish={handleScheduleOk}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="staffId"
                                label="Nhân viên"
                                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                            >
                                <Select>
                                    {staffList.map(staff => (
                                        <Select.Option key={staff.id} value={staff.id}>
                                            {staff.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="scheduleDate"
                                label="Ngày làm việc"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(new Error('Vui lòng chọn ngày'));
                                            }
                                            const selectedDate = moment(value);
                                            const today = moment();
                                            if (selectedDate.isBefore(today, 'day')) {
                                                return Promise.reject(new Error('Ngày làm việc phải từ hôm nay trở đi'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="startTime"
                                label="Giờ bắt đầu"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn giờ bắt đầu' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value) return Promise.reject(new Error('Vui lòng chọn giờ bắt đầu'));
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="endTime"
                                label="Giờ kết thúc"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn giờ kết thúc' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value) return Promise.reject(new Error('Vui lòng chọn giờ kết thúc'));
                                            const startTime = getFieldValue('startTime');
                                            if (startTime) {
                                                const diff = value.diff(startTime, 'hours', true);
                                                if (diff < 1) {
                                                    return Promise.reject(new Error('Giờ kết thúc phải lớn hơn giờ bắt đầu ít nhất 1 tiếng'));
                                                }
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="is_recurring"
                                valuePropName="checked"
                            >
                                <Checkbox>Lặp lại hàng ngày</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.is_recurring !== currentValues.is_recurring}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('is_recurring') ? (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="recurrence_end_date"
                                            label="Ngày kết thúc lặp lại"
                                            rules={[
                                                { required: true, message: 'Vui lòng chọn ngày kết thúc lặp lại' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || moment(getFieldValue('scheduleDate')).isSameOrBefore(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null
                        }
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="notes" label="Ghi chú">
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                    Thêm lịch
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagerStaff;
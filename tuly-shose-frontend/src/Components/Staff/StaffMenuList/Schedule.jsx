import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const scheduleData = [
  {
    _id: "60a4c8b2f9a2d3c4e5f6a7c5",
    staff_id: "60a4c8b2f9a2d3c4e5f6a8b5",
    schedule_date: "2025-06-10",
    scheduled_start_time: "09:00",
    scheduled_end_time: "11:00",
    is_recurring: false,
    recurrence_end_date: null,
    start_time: "09:05",
    end_time: "10:55",
    notes: "Ca sáng",
    work_status_id: "completed",
    created_by: "60a4c8b2f9a2d3c4e5f6a8b0",
    create_at: "2025-06-06T02:15:00+07:00",
    update_at: "2025-06-06T02:15:00+07:00",
  },
  {
    _id: "60a4c8b2f9a2d3c4e5f6a7d6",
    staff_id: "60a4c8b2f9a2d3c4e5f6a8b5",
    schedule_date: "2025-06-11",
    scheduled_start_time: "13:00",
    scheduled_end_time: "15:00",
    is_recurring: false,
    recurrence_end_date: null,
    start_time: null,
    end_time: null,
    notes: "Ca chiều",
    work_status_id: "pending",
    created_by: "60a4c8b2f9a2d3c4e5f6a8b0",
    create_at: "2025-06-07T02:15:00+07:00",
    update_at: "2025-06-07T02:15:00+07:00",
  },
];

const ScheduleCalendar = () => {
  const [filters, setFilters] = useState({ date: '', staff: '', status: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = scheduleData.filter(item => {
    const matchDate = filters.date ? item.schedule_date === filters.date : true;
    const matchStaff = filters.staff ? item.staff_id === filters.staff : true;
    const matchStatus = filters.status ? item.work_status_id === filters.status : true;
    return matchDate && matchStaff && matchStatus;
  });

  const events = filteredData.map(item => ({
    id: item._id,
    title: `${item.notes} (${item.scheduled_start_time} - ${item.scheduled_end_time})`,
    start: new Date(`${item.schedule_date}T${item.scheduled_start_time}`),
    end: new Date(`${item.schedule_date}T${item.scheduled_end_time}`),
    resource: item,
  }));

  const eventPropGetter = (event) => {
    const status = event.resource.work_status_id;
    let style = { backgroundColor: '#e0e0e0', color: 'black' };
    if (status === 'completed') style = { backgroundColor: '#d4edda', color: '#155724' };
    else if (status === 'pending') style = { backgroundColor: '#fff3cd', color: '#856404' };
    return { style };
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Ngày</Form.Label>
          <Form.Control type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </Col>
       
        <Col md={3}>
          <Form.Label>Trạng thái</Form.Label>
          <Form.Control as="select" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">-- Tất cả --</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Chưa hoàn thành</option>
          </Form.Control>
        </Col>
      </Row>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventPropGetter}
        tooltipAccessor={event =>
          `${event.resource.notes}\nCheck-in: ${event.resource.start_time || '---'}\nCheck-out: ${event.resource.end_time || '---'}`
        }
      />
    </Container>
  );
};

export default ScheduleCalendar;

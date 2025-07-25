import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../CSS/ScheduleCalendar.css';
import { Container, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { AuthContext } from '../../API/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaCheck, FaSignOutAlt } from 'react-icons/fa';
import { checkInSchedule, checkOutSchedule, fetchSchedulesByStaff } from '../../API/scheduleApi';

const localizer = momentLocalizer(moment);

const ScheduleCalendar = () => {
  const { user } = useContext(AuthContext);
  const [scheduleData, setScheduleData] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      loadSchedules(user._id);
    }
  }, [user]);

  const loadSchedules = async (staffId) => {
  setLoading(true);
  const data = await fetchSchedulesByStaff(staffId);

  if (!data || data.length === 0) {
    toast.info("Không có lịch làm việc nào được tìm thấy.");
  }

  setScheduleData(data);
  setLoading(false);
};


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'date' && value) {
      setCurrentDate(new Date(value));
    }
  };

  const handleCheckIn = async (schedule) => {
    const now = moment();
    const startTime = moment(`${schedule.schedule_date}T${schedule.scheduled_start_time}`);
    const diffMinutes = startTime.diff(now, 'minutes');

    if (now.isAfter(startTime)) {
    toast.error('Bạn không thể check-in vì đã quá giờ bắt đầu ca làm.');
    return;
  }
    if (diffMinutes > 10) {
      toast.warn('Bạn chỉ được check-in trong vòng 10 phút trước khi ca làm bắt đầu.');
      return;
    }

    try {
      await checkInSchedule(schedule._id);
      toast.success('Check-in thành công!');
      loadSchedules(user._id);
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Check-in thất bại!');
    }
  };

  const handleCheckOut = async (schedule) => {
    const now = moment();
    const endTime = moment(`${schedule.schedule_date}T${schedule.scheduled_end_time}`);
    const diffMinutes = endTime.diff(now, 'minutes');

    
    if (diffMinutes > 10) {
      toast.warn('Bạn chỉ được check-out trong vòng 10 phút trước khi ca làm kết thúc.');
      return;
    }

    try {
      await checkOutSchedule(schedule._id);
      toast.success('Check-out thành công!');
      loadSchedules(user._id);
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Check-out thất bại!');
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  const handleNextWeek = () => {
    const nextWeek = moment(currentDate).add(1, 'week').toDate();
    setCurrentDate(nextWeek);
  };

  const handlePrevWeek = () => {
    const prevWeek = moment(currentDate).subtract(1, 'week').toDate();
    setCurrentDate(prevWeek);
  };

  const filteredData = scheduleData.filter(item => {
  const hasValidTime =
    item.schedule_date &&
    item.scheduled_start_time &&
    item.scheduled_end_time;

  const matchDate = filters.date ? item.schedule_date === filters.date : true;
  const matchStatus = filters.status ? item.work_status === filters.status : true;

  return hasValidTime && matchDate && matchStatus;
});


  const events = filteredData.map(item => ({
    id: item._id,
    title: item.notes,
    start: new Date(`${item.schedule_date}T${item.scheduled_start_time}`),
    end: new Date(`${item.schedule_date}T${item.scheduled_end_time}`),
    resource: item,
  }));

  const eventPropGetter = (event) => {
    const status = event.resource.work_status;
    let className = '';
    if (status === 'Chưa bắt đầu ca làm') className = 'chua-bat-dau';
    else if (status === 'Đang thực hiện công việc') className = 'dang-lam';
    else if (status === 'Ca làm đã hoàn thành') className = 'hoan-thanh';
    return { className };
  };

  const customTimeGutterFormat = (date) => {
    const hour = moment(date).hour();
    if (hour >= 7 && hour < 12) return '7:00 - 12:00';
    if (hour >= 12 && hour < 17) return '12:00 - 17:00';
    if (hour >= 17 && hour < 21) return '17:00 - 21:00';
    return '';
  };

  const CustomEvent = ({ event }) => (
  <div
    className="custom-event"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      padding: '0 2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={`${event.title}`}
  >
    <span>{event.title}</span>
  </div>
);






  return (
    <Container fluid className="mt-4 calendar-container">
      <ToastContainer />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Đang tải lịch làm việc...</p>
        </div>
      ) : (
        <>
          <div className="header-bar mb-4">
            <h3>
              Lịch làm việc tuần: {moment(currentDate).startOf('week').format('DD/MM')} - {moment(currentDate).endOf('week').format('DD/MM')}
            </h3>
          </div>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Ngày</Form.Label>
              <Form.Control type="date" name="date" value={filters.date} onChange={handleFilterChange} />
            </Col>
            <Col md={3}>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Control as="select" name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">-- Tất cả --</option>
                <option value="Chưa bắt đầu ca làm">Chưa làm</option>
                <option value="Đang thực hiện công việc">Đang làm</option>
                <option value="Ca làm đã hoàn thành">Hoàn thành</option>
              </Form.Control>
            </Col>
            <Col md={6}>
              <div className="button-group">
                <Button variant="outline-primary" onClick={handlePrevWeek}>Tuần trước</Button>
                <Button variant="outline-primary" onClick={handleNextWeek}>Tuần sau</Button>
              </div>
            </Col>
          </Row>

          {events.length > 0 ? (
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    style={{ height: 520 }}
    eventPropGetter={eventPropGetter}
    components={{ event: CustomEvent }}
    date={currentDate}
    view={Views.WEEK}
    toolbar={false}
    step={300}
    timeslots={1}
    min={new Date(1970, 1, 1, 7, 0)}
    max={new Date(1970, 1, 1, 21, 0)}
    formats={{ timeGutterFormat: customTimeGutterFormat }}
    onSelectEvent={(event) => handleSelectEvent(event)}
  />
) : (
  <div className="text-center text-muted mt-4">
    <p>Không có ca làm việc nào trong tuần này.</p>
  </div>
)}


          <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Chi tiết ca làm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEvent && (
                <>
                  <p><strong>Ghi chú:</strong> {selectedEvent.notes}</p>
                  <p><strong>Thời gian:</strong> {selectedEvent.scheduled_start_time} - {selectedEvent.scheduled_end_time}</p>
                  <p><strong>Trạng thái:</strong> {selectedEvent.work_status}</p>
                  <p><strong>Check-in:</strong> {selectedEvent.start_time || '---'}</p>
                  <p><strong>Check-out:</strong> {selectedEvent.end_time || '---'}</p>

                  {selectedEvent.work_status === 'Chưa bắt đầu ca làm' && (
                    <Button variant="success" onClick={() => handleCheckIn(selectedEvent)} className="mr-2">
                      <FaCheck className="mr-1" /> Check-in
                    </Button>
                  )}
                  {selectedEvent.work_status === 'Đang thực hiện công việc' && (
                    <Button variant="primary" onClick={() => handleCheckOut(selectedEvent)}>
                      <FaSignOutAlt className="mr-1" /> Check-out
                    </Button>
                  )}
                </>
              )}
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default ScheduleCalendar;

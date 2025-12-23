const WorkSchedule = require('../models/workSchedule.model');
const WorkStatus = require('../models/workStatus.model');
const Account = require('../models/account.modle');
const moment = require('moment');

const normalizeStatus = (schedule) => {
  if (schedule.work_status_id?.description) return schedule.work_status_id.description;
  if (schedule.work_status_id?.status_name) return schedule.work_status_id.status_name;
  if (schedule.end_time) return 'Ca làm đã hoàn thành';
  if (schedule.start_time) return 'Đang thực hiện công việc';
  return 'Chưa bắt đầu ca làm';
};

const getSchedulesByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Chỉ cho phép chính nhân viên xem lịch của họ, hoặc manager
    if (req.customerId !== staffId && req.role !== 'manager') {
      return res.status(403).json({ message: 'Không có quyền xem lịch làm việc này' });
    }

    const today = moment().startOf('day');

    const computedStatus = (schedule) => {
      const day = moment(schedule.schedule_date, 'YYYY-MM-DD').startOf('day');
      const hasStart = !!schedule.start_time;
      const hasEnd = !!schedule.end_time;

      if (day.isBefore(today)) {
        if (hasEnd) return 'Ca làm đã hoàn thành';
        return 'Nghỉ';
      }

      if (day.isSame(today)) {
        if (hasEnd) return 'Ca làm đã hoàn thành';
        if (hasStart) return 'Đang thực hiện công việc';
        return 'Chưa bắt đầu ca làm';
      }

      // Future
      return 'Chưa bắt đầu ca làm';
    };

    const schedules = await WorkSchedule.find({ staff_id: staffId })
      .populate('work_status_id')
      .populate('staff_id', 'first_name last_name')
      .populate('created_by', 'first_name last_name')
      .sort({ schedule_date: 1, scheduled_start_time: 1 });
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }

    const normalizeStatus = (schedule) => {
      if (schedule.work_status_id?.description) return schedule.work_status_id.description;
      if (schedule.work_status_id?.status_name) return schedule.work_status_id.status_name;
      if (schedule.end_time) return 'Ca làm đã hoàn thành';
      if (schedule.start_time) return 'Đang thực hiện công việc';
      return 'Chưa bắt đầu ca làm';
    };

    const formattedSchedules = schedules.map(schedule => ({
      _id: schedule._id,
      staff_name: `${schedule.staff_id.first_name} ${schedule.staff_id.last_name}`, // Staff name
      schedule_date: schedule.schedule_date,
      scheduled_start_time: schedule.scheduled_start_time,
      scheduled_end_time: schedule.scheduled_end_time,
      is_recurring: schedule.is_recurring,
      recurrence_end_date: schedule.recurrence_end_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      notes: schedule.notes,
      work_status: normalizeStatus(schedule), // Mô tả trạng thái từ DB
      computed_status: computedStatus(schedule), // Trạng thái tính theo ngày/check-in/out
      created_by: `${schedule.created_by.first_name} ${schedule.created_by.last_name}`, // Creator name
      create_at: schedule.create_at,
      update_at: schedule.update_at
    }));

    res.status(200).json(formattedSchedules);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

const checkIn = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    // Tìm lịch làm việc
    const schedule = await WorkSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }

    // Chỉ nhân viên của lịch hoặc manager được checkin
    if (req.customerId !== schedule.staff_id.toString() && req.role !== 'manager') {
      return res.status(403).json({ message: 'Không có quyền check-in lịch này' });
    }

    // Kiểm tra ngày và khung giờ (chỉ được check-in trong ngày, ±5 phút so với giờ bắt đầu)
    const now = moment();
    const scheduleDay = moment(schedule.schedule_date, 'YYYY-MM-DD');
    if (!now.isSame(scheduleDay, 'day')) {
      return res.status(400).json({ message: 'Chỉ được check-in trong ngày làm việc đã được lên lịch' });
    }
    const scheduledStart = moment(`${schedule.schedule_date}T${schedule.scheduled_start_time}`, 'YYYY-MM-DDTHH:mm');
    if (!now.isBetween(scheduledStart.clone().subtract(5, 'minutes'), scheduledStart.clone().add(5, 'minutes'), null, '[]')) {
      return res.status(400).json({ message: 'Chỉ được check-in trong vòng 5 phút trước/sau giờ bắt đầu ca làm' });
    }

    // Tìm ID trạng thái "Đang thực hiện công việc"
    const workingStatus = await WorkStatus.findOne({ status_name: 'đang làm' });
    if (!workingStatus) {
      return res.status(404).json({ message: 'Không tìm thấy trạng thái Đang làm' });
    }

    // Cập nhật check-in
    schedule.start_time = moment().format('HH:mm'); // Lưu giờ hiện tại
    schedule.work_status_id = workingStatus._id; // Chuyển trạng thái

    await schedule.save();

    res.status(200).json({ message: 'Check-in thành công', schedule });
  } catch (error) {
    console.error('Lỗi check-in:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message || JSON.stringify(error) });
  }
};

const getScheduleSummary = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { month } = req.query; // YYYY-MM

    if (req.customerId !== staffId && req.role !== 'manager') {
      return res.status(403).json({ message: 'Không có quyền xem lịch làm việc này' });
    }

    const startMonth = month ? moment(month, 'YYYY-MM').startOf('month') : moment().startOf('month');
    const endMonth = startMonth.clone().endOf('month');
    const today = moment().startOf('day');

    const schedules = await WorkSchedule.find({
      staff_id: staffId,
      schedule_date: {
        $gte: startMonth.format('YYYY-MM-DD'),
        $lte: endMonth.format('YYYY-MM-DD'),
      },
    }).populate('work_status_id');

    const dayMap = new Map();
    let daysOff = 0;

    schedules.forEach((schedule) => {
      const dayKey = schedule.schedule_date;
      const day = moment(schedule.schedule_date, 'YYYY-MM-DD').startOf('day');
      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          hasSchedule: true,
          hasStart: false,
          hasEnd: false,
          day,
        });
      }
      const entry = dayMap.get(dayKey);
      if (schedule.start_time) entry.hasStart = true;
      if (schedule.end_time) entry.hasEnd = true;
      dayMap.set(dayKey, entry);
    });

    let daysCompleted = 0;
    let daysInProgress = 0;
    let daysNotStarted = 0;

    dayMap.forEach((entry) => {
      const isPast = entry.day.isBefore(today, 'day');
      const isToday = entry.day.isSame(today, 'day');

      if (isPast) {
        if (entry.hasEnd) {
          daysCompleted += 1;
        } else {
          // Có lịch nhưng không hoàn thành => nghỉ
          daysOff += 1;
        }
      } else if (isToday) {
        if (entry.hasEnd) {
          daysCompleted += 1;
        } else if (entry.hasStart) {
          daysInProgress += 1;
        } else {
          daysNotStarted += 1;
        }
      } else {
        // Future
        daysNotStarted += 1;
      }
    });

    const totalDaysInMonth = endMonth.diff(startMonth, 'days') + 1;
    const daysWithSchedule = dayMap.size;
    // Nếu không có lịch nào, không tính là nghỉ; chỉ tính nghỉ cho các ngày quá khứ có lịch nhưng không hoàn thành

    const formattedSchedules = schedules.map((schedule) => ({
      _id: schedule._id,
      schedule_date: schedule.schedule_date,
      scheduled_start_time: schedule.scheduled_start_time,
      scheduled_end_time: schedule.scheduled_end_time,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      notes: schedule.notes,
      work_status: normalizeStatus(schedule),
      computed_status: (function () {
        const day = moment(schedule.schedule_date, 'YYYY-MM-DD').startOf('day');
        const hasStart = !!schedule.start_time;
        const hasEnd = !!schedule.end_time;

        if (day.isBefore(today)) {
          if (hasEnd) return 'Ca làm đã hoàn thành';
          return 'Nghỉ';
        }
        if (day.isSame(today)) {
          if (hasEnd) return 'Ca làm đã hoàn thành';
          if (hasStart) return 'Đang thực hiện công việc';
          return 'Chưa bắt đầu ca làm';
        }
        return 'Chưa bắt đầu ca làm';
      })(),
    }));

    res.status(200).json({
      summary: {
        month: startMonth.format('YYYY-MM'),
        total_days: totalDaysInMonth,
        days_off: daysOff,
        days_completed: daysCompleted,
        days_in_progress: daysInProgress,
        days_not_started: daysNotStarted,
      },
      schedules: formattedSchedules,
    });
  } catch (error) {
    console.error('Lỗi lấy tổng quan lịch:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message || JSON.stringify(error) });
  }
};

const checkOut = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    // Tìm lịch làm việc
    const schedule = await WorkSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }

    // Chỉ nhân viên của lịch hoặc manager được checkout
    if (req.customerId !== schedule.staff_id.toString() && req.role !== 'manager') {
      return res.status(403).json({ message: 'Không có quyền check-out lịch này' });
    }

    // Kiểm tra ngày và khung giờ (chỉ được check-out trong ngày, ±5 phút so với giờ kết thúc)
    const now = moment();
    const scheduleDay = moment(schedule.schedule_date, 'YYYY-MM-DD');
    if (!now.isSame(scheduleDay, 'day')) {
      return res.status(400).json({ message: 'Chỉ được check-out trong ngày làm việc đã được lên lịch' });
    }
    const scheduledEnd = moment(`${schedule.schedule_date}T${schedule.scheduled_end_time}`, 'YYYY-MM-DDTHH:mm');
    if (!now.isBetween(scheduledEnd.clone().subtract(5, 'minutes'), scheduledEnd.clone().add(5, 'minutes'), null, '[]')) {
      return res.status(400).json({ message: 'Chỉ được check-out trong vòng 5 phút trước/sau giờ kết thúc ca làm' });
    }

    // Tìm ID trạng thái "Đã hoàn thành"
    const completedStatus = await WorkStatus.findOne({ status_name: 'đã kết thúc ca làm' });
    if (!completedStatus) {
      return res.status(404).json({ message: 'Không tìm thấy trạng thái Đã hoàn thành' });
    }

    // Cập nhật check-out
    schedule.end_time = moment().format('HH:mm'); // Lưu giờ hiện tại
    schedule.work_status_id = completedStatus._id; // Chuyển trạng thái

    await schedule.save();

    res.status(200).json({ message: 'Check-out thành công', schedule });
  } catch (error) {
    console.error('Lỗi check-out:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message || JSON.stringify(error) });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { staff_id, schedule_date, scheduled_start_time, scheduled_end_time, notes, is_recurring, work_status_id, recurrence_end_date } = req.body;

    if (req.role !== 'manager') {
      return res.status(403).json({ message: 'Chỉ manager mới được tạo lịch làm việc' });
    }

    if (is_recurring && !recurrence_end_date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ngày kết thúc lặp lại' });
    }

    // Convert time to minutes for comparison
    const startTimeMinutes = parseInt(scheduled_start_time.split(':')[0]) * 60 + parseInt(scheduled_start_time.split(':')[1]);
    const endTimeMinutes = parseInt(scheduled_end_time.split(':')[0]) * 60 + parseInt(scheduled_end_time.split(':')[1]);

    // Check for overlapping schedules (không cho trùng ca của cùng nhân viên, và cảnh báo trùng người khác)
    const checkOverlap = async (date, start, end) => {
      const existingSchedules = await WorkSchedule.find({ schedule_date: date });

      for (const schedule of existingSchedules) {
        const existingStart = parseInt(schedule.scheduled_start_time.split(':')[0]) * 60 + parseInt(schedule.scheduled_start_time.split(':')[1]);
        const existingEnd = parseInt(schedule.scheduled_end_time.split(':')[0]) * 60 + parseInt(schedule.scheduled_end_time.split(':')[1]);

        // Check for overlap: new schedule starts before existing ends AND ends after existing starts
        if (start < existingEnd && end > existingStart) {
          const conflictingStaff = await Account.findById(schedule.staff_id, 'first_name last_name');
          // Nếu là cùng nhân viên, cấm trùng; nếu khác, chỉ cảnh báo
          if (staff_id.toString() === schedule.staff_id.toString()) {
            return {
              overlap: true,
              message: `Nhân viên đã có lịch trùng vào ngày ${date}, vui lòng chọn thời gian khác`
            };
          }
          return {
            overlap: true,
            message: `Lịch làm việc trùng với lịch của nhân viên ${conflictingStaff?.first_name || ''} ${conflictingStaff?.last_name || ''} vào ngày ${date}, vui lòng chọn thời gian khác`
          };
        }
      }
      return { overlap: false };
    };

    const schedulesToCreate = [];
    let currentDate = moment(schedule_date, 'YYYY-MM-DD');
    const endDate = is_recurring ? moment(recurrence_end_date, 'YYYY-MM-DD') : currentDate;

    // Check for overlaps for each date in the range
    while (currentDate <= endDate) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const overlapResult = await checkOverlap(dateStr, startTimeMinutes, endTimeMinutes);
      if (overlapResult.overlap) {
        return res.status(400).json({ message: overlapResult.message });
      }

      schedulesToCreate.push({
        staff_id,
        schedule_date: dateStr,
        scheduled_start_time,
        scheduled_end_time,
        notes,
        is_recurring,
        recurrence_end_date: is_recurring ? recurrence_end_date : null,
        created_by: req.customerId,
        work_status_id: work_status_id || null,
      });
      currentDate.add(1, 'days');
    }

    const createdSchedules = await WorkSchedule.insertMany(schedulesToCreate);
    res.status(201).json({ message: 'Tạo lịch làm việc thành công', schedules: createdSchedules });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo lịch làm việc', error });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await WorkSchedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }
    res.status(200).json({ message: 'Cập nhật lịch làm việc thành công', schedule: updatedSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật lịch làm việc', error });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await WorkSchedule.findByIdAndDelete(id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }
    res.status(200).json({ message: 'Xóa lịch làm việc thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa lịch làm việc', error });
  }
};

module.exports = { getSchedulesByStaff, getScheduleSummary, checkIn, checkOut, createSchedule, updateSchedule, deleteSchedule };
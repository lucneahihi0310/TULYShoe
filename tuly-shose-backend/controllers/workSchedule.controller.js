const WorkSchedule = require('../models/workSchedule.model');
const WorkStatus = require('../models/workStatus.model');
const Account = require('../models/account.modle');
const moment = require('moment');

const getSchedulesByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const schedules = await WorkSchedule.find({ staff_id: staffId })
      .populate('work_status_id')
      .populate('staff_id', 'first_name last_name')
      .populate('created_by', 'first_name last_name')
      .sort({ schedule_date: 1, scheduled_start_time: 1 });
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
    }
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
      work_status: schedule.work_status_id ? schedule.work_status_id.description : null, // Description
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

const checkOut = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    // Tìm lịch làm việc
    const schedule = await WorkSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch làm việc' });
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
    const { staff_id, schedule_date, scheduled_start_time, scheduled_end_time, notes, is_recurring, recurrence_end_date } = req.body;

    if (is_recurring && !recurrence_end_date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ngày kết thúc lặp lại' });
    }

    // Convert time to minutes for comparison
    const startTimeMinutes = parseInt(scheduled_start_time.split(':')[0]) * 60 + parseInt(scheduled_start_time.split(':')[1]);
    const endTimeMinutes = parseInt(scheduled_end_time.split(':')[0]) * 60 + parseInt(scheduled_end_time.split(':')[1]);

    // Check for overlapping schedules across all staff
    const checkOverlap = async (date, start, end) => {
      const existingSchedules = await WorkSchedule.find({ schedule_date: date });

      for (const schedule of existingSchedules) {
        const existingStart = parseInt(schedule.scheduled_start_time.split(':')[0]) * 60 + parseInt(schedule.scheduled_start_time.split(':')[1]);
        const existingEnd = parseInt(schedule.scheduled_end_time.split(':')[0]) * 60 + parseInt(schedule.scheduled_end_time.split(':')[1]);

        // Check for overlap: new schedule starts before existing ends AND ends after existing starts
        if (start < existingEnd && end > existingStart && staff_id.toString() !== schedule.staff_id.toString()) {
          const conflictingStaff = await Account.findById(schedule.staff_id, 'first_name last_name');
          return {
            overlap: true,
            message: `Lịch làm việc trùng với lịch của nhân viên ${conflictingStaff.first_name} ${conflictingStaff.last_name} vào ngày ${date}, vui lòng chọn thời gian khác`
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
        created_by: req.customerId._id, // Lấy từ token xác thực
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

module.exports = { getSchedulesByStaff, checkIn, checkOut, createSchedule, updateSchedule, deleteSchedule };
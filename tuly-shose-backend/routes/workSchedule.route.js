const express = require('express');
const { getSchedulesByStaff, checkIn, checkOut, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/workSchedule.controller');
const router = express.Router();

// Route lấy lịch làm việc của 1 staff
router.get('/:staffId', getSchedulesByStaff);
router.put('/checkin/:scheduleId', checkIn);
router.put('/checkout/:scheduleId', checkOut);

router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
module.exports = router;

const express = require('express');
const { getSchedulesByStaff, checkIn, checkOut } = require('../controllers/workSchedule.controller');
const router = express.Router();

// Route lấy lịch làm việc của 1 staff
router.get('/:staffId', getSchedulesByStaff);
router.put('/checkin/:scheduleId', checkIn);
router.put('/checkout/:scheduleId', checkOut);
module.exports = router;

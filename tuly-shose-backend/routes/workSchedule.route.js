const express = require('express');
const { getSchedulesByStaff, getScheduleSummary, checkIn, checkOut, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/workSchedule.controller');
const router = express.Router();
const middlewares = require('../middlewares/auth.middleware');

// Route lấy lịch làm việc của 1 staff (bảo vệ, kiểm tra quyền trong controller)
router.get('/:staffId', middlewares, getSchedulesByStaff);
router.get('/summary/:staffId', middlewares, getScheduleSummary);
router.put('/checkin/:scheduleId', middlewares, checkIn);
router.put('/checkout/:scheduleId', middlewares, checkOut);

router.post('/createSchedule', middlewares, createSchedule);
router.put('/updateSchedule/:id', middlewares, updateSchedule);
router.delete('/deleteSchedule/:id', middlewares, deleteSchedule);
module.exports = router;
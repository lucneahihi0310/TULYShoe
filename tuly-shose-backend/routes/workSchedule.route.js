const express = require('express');
const { getSchedulesByStaff, checkIn, checkOut, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/workSchedule.controller');
const router = express.Router();
const middlewares = require('../middlewares/auth.middleware');

// Route lấy lịch làm việc của 1 staff
router.get('/:staffId', getSchedulesByStaff);
router.put('/checkin/:scheduleId', checkIn);
router.put('/checkout/:scheduleId', checkOut);

router.post('/createSchedule', middlewares, createSchedule);
router.put('/updateSchedule/:id', middlewares, updateSchedule);
router.delete('/deleteSchedule/:id', middlewares, deleteSchedule);
module.exports = router;
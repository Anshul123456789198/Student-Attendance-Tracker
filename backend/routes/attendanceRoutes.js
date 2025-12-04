const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getAttendanceByDate,
    getStudentAttendance,
    getAttendanceReport
} = require('../controllers/attendanceController');

router.post('/', markAttendance);
router.get('/date/:date', getAttendanceByDate);
router.get('/student/:studentId', getStudentAttendance);
router.get('/report', getAttendanceReport);

module.exports = router;
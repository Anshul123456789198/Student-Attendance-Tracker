const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status, remarks } = req.body;
        
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Check if attendance already marked for this date
        const existingAttendance = await Attendance.findOne({
            student: studentId,
            date: new Date(date).setHours(0, 0, 0, 0)
        });
        
        let attendance;
        if (existingAttendance) {
            // Update existing attendance
            existingAttendance.status = status;
            existingAttendance.remarks = remarks;
            attendance = await existingAttendance.save();
        } else {
            // Create new attendance record
            attendance = new Attendance({
                student: studentId,
                date: new Date(date).setHours(0, 0, 0, 0),
                status,
                remarks
            });
            await attendance.save();
        }
        
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date).setHours(0, 0, 0, 0);
        
        const attendance = await Attendance.find({ date })
            .populate('student', 'rollNumber name className')
            .sort({ 'student.name': 1 });
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student attendance history
exports.getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.params.studentId })
            .populate('student', 'rollNumber name className')
            .sort({ date: -1 });
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance report
exports.getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, className } = req.query;
        
        let query = {};
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate).setHours(0, 0, 0, 0),
                $lte: new Date(endDate).setHours(23, 59, 59, 999)
            };
        }
        
        // If className is provided, filter by student's class
        if (className) {
            const studentsInClass = await Student.find({ className });
            const studentIds = studentsInClass.map(s => s._id);
            query.student = { $in: studentIds };
        }
        
        const attendance = await Attendance.find(query)
            .populate('student', 'rollNumber name className')
            .sort({ date: -1 });
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
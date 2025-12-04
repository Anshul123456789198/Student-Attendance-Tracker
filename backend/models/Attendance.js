const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        default: 'Absent'
    },
    remarks: {
        type: String
    }
});

// Create compound index for unique attendance per student per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
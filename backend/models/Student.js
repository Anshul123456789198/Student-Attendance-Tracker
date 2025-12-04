const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
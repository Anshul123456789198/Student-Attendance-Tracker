const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.send('Attendance Tracker API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Student API calls
export const getStudents = () => API.get('/students');
export const createStudent = (studentData) => API.post('/students', studentData);
export const updateStudent = (id, studentData) => API.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Attendance API calls
export const markAttendance = (attendanceData) => API.post('/attendance', attendanceData);
export const getAttendanceByDate = (date) => API.get(`/attendance/date/${date}`);
export const getAttendanceReport = (params) => API.get('/attendance/report', { params });
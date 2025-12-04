import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getStudents, markAttendance, getAttendanceByDate } from '../services/api';

const MarkAttendance = () => {
    const [date, setDate] = useState(new Date());
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchAttendanceForDate();
    }, [date]);

    const fetchStudents = async () => {
        try {
            const response = await getStudents();
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchAttendanceForDate = async () => {
        try {
            const dateStr = date.toISOString().split('T')[0];
            const response = await getAttendanceByDate(dateStr);
            const attendanceMap = {};
            response.data.forEach(item => {
                attendanceMap[item.student._id] = item.status;
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance({
            ...attendance,
            [studentId]: status
        });
    };

    const saveAttendance = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            const promises = Object.entries(attendance).map(([studentId, status]) => {
                return markAttendance({
                    studentId,
                    date: date.toISOString().split('T')[0],
                    status,
                    remarks: ''
                });
            });
            
            await Promise.all(promises);
            setMessage('Attendance saved successfully!');
        } catch (error) {
            setMessage('Error saving attendance');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Present': return 'green';
            case 'Absent': return 'red';
            case 'Late': return 'orange';
            default: return 'gray';
        }
    };

    return (
        <div className="mark-attendance">
            <h2>Mark Attendance</h2>
            
            <div className="date-selector">
                <label>Select Date: </label>
                <DatePicker
                    selected={date}
                    onChange={setDate}
                    dateFormat="yyyy-MM-dd"
                />
            </div>

            <div className="attendance-table">
                <table>
                    <thead>
                        <tr>
                            <th>Roll No.</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id}>
                                <td>{student.rollNumber}</td>
                                <td>{student.name}</td>
                                <td>{student.className}</td>
                                <td>
                                    <select
                                        value={attendance[student._id] || 'Absent'}
                                        onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                        style={{
                                            backgroundColor: getStatusColor(attendance[student._id] || 'Absent'),
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px',
                                            borderRadius: '3px'
                                        }}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Late">Late</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={saveAttendance} 
                disabled={loading || students.length === 0}
                className="save-button"
            >
                {loading ? 'Saving...' : 'Save Attendance'}
            </button>
            
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default MarkAttendance;
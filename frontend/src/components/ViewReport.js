import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getAttendanceReport, getStudents } from '../services/api';

const ViewReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [className, setClassName] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classNames, setClassNames] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        generateReport();
    }, [startDate, endDate, className]);

    const fetchStudents = async () => {
        try {
            const response = await getStudents();
            setStudents(response.data);
            
            // Extract unique class names
            const uniqueClasses = [...new Set(response.data.map(s => s.className))];
            setClassNames(uniqueClasses);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            };
            
            if (className) {
                params.className = className;
            }
            
            const response = await getAttendanceReport(params);
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStatistics = () => {
        const stats = {};
        
        attendanceData.forEach(record => {
            const studentId = record.student._id;
            const studentName = record.student.name;
            
            if (!stats[studentId]) {
                stats[studentId] = {
                    name: studentName,
                    rollNumber: record.student.rollNumber,
                    className: record.student.className,
                    present: 0,
                    absent: 0,
                    late: 0,
                    total: 0
                };
            }
            
            stats[studentId].total++;
            stats[studentId][record.status.toLowerCase()]++;
        });
        
        return Object.values(stats);
    };

    const statistics = calculateStatistics();

    return (
        <div className="view-report">
            <h2>Attendance Report</h2>
            
            <div className="report-filters">
                <div className="filter-group">
                    <label>From Date: </label>
                    <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                
                <div className="filter-group">
                    <label>To Date: </label>
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                
                <div className="filter-group">
                    <label>Class: </label>
                    <select
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    >
                        <option value="">All Classes</option>
                        {classNames.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div>Loading report...</div>
            ) : (
                <>
                    <div className="statistics">
                        <h3>Summary Statistics</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Roll No.</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                    <th>Total Days</th>
                                    <th>Attendance %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.map(stat => (
                                    <tr key={stat.rollNumber}>
                                        <td>{stat.rollNumber}</td>
                                        <td>{stat.name}</td>
                                        <td>{stat.className}</td>
                                        <td className="present">{stat.present}</td>
                                        <td className="absent">{stat.absent}</td>
                                        <td className="late">{stat.late}</td>
                                        <td>{stat.total}</td>
                                        <td>
                                            {stat.total > 0 
                                                ? ((stat.present / stat.total) * 100).toFixed(1)
                                                : 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="detailed-report">
                        <h3>Detailed Attendance</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Roll No.</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map(record => (
                                    <tr key={record._id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.student.rollNumber}</td>
                                        <td>{record.student.name}</td>
                                        <td>{record.student.className}</td>
                                        <td className={`status-${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </td>
                                        <td>{record.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewReport;
import React, { useState } from 'react';
import { createStudent } from '../services/api';

const AddStudent = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        className: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            await createStudent(formData);
            setMessage('Student added successfully!');
            setFormData({
                rollNumber: '',
                name: '',
                className: '',
                email: '',
                phone: ''
            });
            
            if (onStudentAdded) {
                onStudentAdded();
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error adding student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-student">
            <h2>Add New Student</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="rollNumber"
                        placeholder="Roll Number"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="className"
                        placeholder="Class (e.g., 10th Grade)"
                        value={formData.className}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Student'}
                </button>
                {message && <div className="message">{message}</div>}
            </form>
        </div>
    );
};

export default AddStudent;
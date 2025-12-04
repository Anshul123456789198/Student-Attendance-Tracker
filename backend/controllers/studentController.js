const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single student
exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new student
exports.createStudent = async (req, res) => {
    try {
        const { rollNumber, name, className, email, phone } = req.body;
        
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ error: 'Roll number already exists' });
        }
        
        const student = new Student({
            rollNumber,
            name,
            className,
            email,
            phone
        });
        
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
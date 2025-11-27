const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const multer = require('multer'); 
const xlsx = require('xlsx');    
const bcryptjs = require('bcryptjs'); // Ensure bcryptjs is used consistently

const upload = multer({ storage: multer.memoryStorage() });

// @desc    Admin creates a single user (Student/Proctor/HOD/etc.)
// @route   POST /api/admin/add-single-user
// @access  Private (Admin only)
router.post('/add-single-user', protect, authorize(['admin']), async (req, res) => {
    const { username, password, role, email, name, department, semester, section, designation } = req.body;

    if (!username || !password || !role || !email || !name) {
        return res.status(400).json({ message: 'Please include all required fields: username, password, role, email, name.' });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            role: role.toLowerCase(),
            email,
            name,
            department: department || null,
            semester: semester || null,
            section: section || null,
            designation: designation || null
        });

        if (user) {
            res.status(201).json({ 
                message: `User ${username} (${role}) added successfully.`,
                id: user._id 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        console.error("Single user creation failed:", error); // Log the detailed error
        res.status(500).json({ message: 'Server error during single user creation.' });
    }
});


// @desc    Admin bulk upload users from Excel
// @route   POST /api/admin/bulk-upload
// @access  Private (Admin only)
router.post('/bulk-upload', protect, authorize(['admin']), upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        let usersToInsert = [];
        const salt = await bcryptjs.genSalt(10);

        for (const item of data) {
            if (!item.username || !item.email || !item.role || !item.name) continue;

            const defaultPassword = item.password || item.username.slice(-4) + '123';
            const hashedPassword = await bcryptjs.hash(defaultPassword, salt);

            usersToInsert.push({
                username: item.username, password: hashedPassword, role: item.role.toLowerCase(),
                email: item.email, name: item.name, department: item.department, 
                semester: item.semester, section: item.section, designation: item.designation
            });
        }
        const result = await User.insertMany(usersToInsert, { ordered: false }); 
        res.status(201).json({ message: `Successfully inserted ${result.length} users.`, insertedCount: result.length });
    } catch (error) {
        if (error.code === 11000) { return res.status(409).json({ message: 'Bulk upload failed due to duplicate users (username/email).', details: error.message }); }
        res.status(500).json({ message: 'Server error during bulk upload.', details: error.message });
    }
});

// @desc    Admin manage (map) proctorship (e.g., assign a proctor to a student)
// @route   PUT /api/admin/manage-proctorship
// @access  Private (Admin only)
router.put('/manage-proctorship', protect, authorize(['admin']), async (req, res) => {
    const { studentUsername, proctorUsername } = req.body;
    try {
        const proctor = await User.findOne({ username: proctorUsername, role: 'proctor' });
        if (!proctor) return res.status(404).json({ message: `Proctor not found.` });

        const student = await User.findOneAndUpdate(
            { username: studentUsername, role: 'student' },
            { proctor: proctor._id },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: `Student not found.` });
        res.json({ message: `${student.name} assigned to Proctor ${proctor.name} successfully.`, student: student });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile', protect, authorize(['student']), async (req, res) => {
    try {
        const studentProfile = await User.findById(req.user._id).select('-password').populate('proctor', 'name email designation');
        if (!studentProfile) return res.status(404).json({ message: 'Student not found' });
        res.json(studentProfile);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/submit-form', protect, authorize(['student']), async (req, res) => {
    const { subject, body } = req.body;
    try {
        const student = await User.findById(req.user._id);
        if (!student || !student.proctor) {
            return res.status(400).json({ message: 'Cannot submit form. Proctor not assigned.' });
        }
        const newForm = await Form.create({
            student_id: req.user._id, subject, body, current_authority: 'proctor', current_status: 'pending'
        });
        res.status(201).json({ message: 'Form submitted successfully!', form: newForm });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/forms', protect, authorize(['student']), async (req, res) => {
    try {
        const forms = await Form.find({ student_id: req.user._id }).sort({ submitted_at: -1 });
        res.json(forms);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
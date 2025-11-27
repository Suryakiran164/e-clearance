const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @desc    Get all pending forms for the proctor
// @route   GET /api/proctor/forms
// @access  Private (Proctor only)
router.get('/forms', protect, authorize(['proctor']), async (req, res) => {
    try {
        const students = await User.find({ proctor: req.user._id }).select('_id');
        const studentIds = students.map(s => s._id);

        const forms = await Form.find({
            student_id: { $in: studentIds },
            current_authority: 'proctor',
            current_status: 'pending'
        }).populate('student_id', 'name username department');

        res.json(forms);
    } catch (error) {
        console.error("Error fetching proctor forms:", error);
        res.status(500).json({ message: 'Server error retrieving forms.' });
    }
});

// @desc    Proctor action on a form (ACCEPT/ESCALATE/REJECT)
// @route   POST /api/proctor/forms/:id/action
// @access  Private (Proctor only)
router.post('/forms/:id/action', protect, authorize(['proctor']), async (req, res) => {
    const { action, remarks } = req.body; 

    if (!['ACCEPT', 'ESCALATE', 'REJECT'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action provided.' });
    }

    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        if (form.current_authority !== 'proctor' || form.current_status !== 'pending') {
             return res.status(400).json({ message: `Form is currently with ${form.current_authority} or already processed.` });
        }

        form.approval_history.push({
            authority_role: 'proctor',
            authority_id: req.user._id,
            action: action,
            remarks: remarks
        });

        if (action === 'ACCEPT') {
            form.current_status = 'accepted';
            
        } else if (action === 'ESCALATE') {
            form.current_authority = 'hod'; // The correct lowercase target
            
        } else if (action === 'REJECT') {
            form.current_status = 'rejected';
            form.rejection_reason = remarks; 
        }

        await form.save();
        res.json({ message: `Form ${action} successfully.`, form });

    } catch (error) {
        console.error("Error processing proctor action:", error);
        res.status(500).json({ message: 'Server error processing action.' });
    }
});

module.exports = router;
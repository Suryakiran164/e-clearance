const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const User = require('..//models/userModel'); // Import User model

// @desc    Get all forms pending for the HOD's approval
// @route   GET /api/hod/forms
// @access  Private (HOD only)
router.get('/forms', protect, authorize(['hod']), async (req, res) => {
    try {
        const hodDepartment = req.user.department; 

        // 1. SAFETY CHECK: Ensure HOD has a department defined to prevent crashes
        if (!hodDepartment) {
            return res.status(403).json({ message: 'HOD profile is missing department data for filtering.' });
        }

        // 2. Find all students in this department
        const students = await User.find({ 
            role: 'student', 
            department: hodDepartment 
        }).select('_id');
        const studentIds = students.map(s => s._id);

        // 3. Find forms submitted by these students, pending at HOD level
        const forms = await Form.find({
            student_id: { $in: studentIds },
            current_authority: 'hod',
            current_status: 'pending'
        }).populate('student_id', 'name username department');

        res.json(forms);
    } catch (error) {
        console.error("Error retrieving HOD forms:", error);
        res.status(500).json({ message: 'Server error retrieving forms.' });
    }
});

// @desc    HOD action on a form (ACCEPT/ESCALATE/REJECT)
// @route   POST /api/hod/forms/:id/action
// @access  Private (HOD only)
router.post('/forms/:id/action', protect, authorize(['hod']), async (req, res) => {
    const { action, remarks } = req.body; 

    if (!['ACCEPT', 'ESCALATE', 'REJECT'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action provided.' });
    }

    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        // Ensure form is pending and currently assigned to HOD
        if (form.current_authority !== 'hod' || form.current_status !== 'pending') {
             return res.status(400).json({ message: `Form is currently with ${form.current_authority} or already processed.` });
        }

        // 1. Log the action to history
        form.approval_history.push({
            authority_role: 'hod',
            authority_id: req.user._id,
            action: action,
            remarks: remarks
        });

        // 2. Determine workflow transition
        if (action === 'ACCEPT') {
            form.current_status = 'accepted';
            
        } else if (action === 'ESCALATE') {
            // CRITICAL FIX: Set next authority to the correct lowercase role
            form.current_authority = 'principal'; 
            
        } else if (action === 'REJECT') {
            form.current_status = 'rejected';
            form.rejection_reason = remarks; 
        }

        // 3. Save the updated form state
        await form.save();
        res.json({ message: `Form ${action} successfully.`, form });

    } catch (error) {
        // Log the detailed error on the server side
        console.error("HOD Action Server Crash/Error:", error);
        
        // Check for Validation Error (if Mongoose schema is still rejecting 'principal')
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: `Form validation failed: ${error.message}` });
        }

        // Generic 500 response if it's an unhandled database/server error
        res.status(500).json({ message: 'Server error processing action.' });
    }
});

module.exports = router;
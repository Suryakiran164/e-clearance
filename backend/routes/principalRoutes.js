const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @desc    Get all forms pending for the Principal's approval
// @route   GET /api/principal/forms
// @access  Private (Principal only)
router.get('/forms', protect, authorize(['principal']), async (req, res) => {
    try {
        // FIX: Ensure both authority and status filters are correct and lowercase
        const forms = await Form.find({
            current_authority: 'principal', // Must be lowercase 'principal'
            current_status: 'pending'      // Must be lowercase 'pending'
        }).populate('student_id', 'name username department');

        res.json(forms);
    } catch (error) {
        console.error("Error retrieving principal forms:", error);
        res.status(500).json({ message: 'Server error retrieving forms.' });
    }
});

// @desc    Principal action on a form (ACCEPT/REJECT)
// @route   POST /api/principal/forms/:id/action
// @access  Private (Principal only)
router.post('/forms/:id/action', protect, authorize(['principal']), async (req, res) => {
    const { action, remarks } = req.body; 

    if (!['ACCEPT', 'REJECT'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action provided. Must be ACCEPT or REJECT.' });
    }

    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        
        // Ensure form is pending and currently assigned to Principal
        if (form.current_authority !== 'principal' || form.current_status !== 'pending') {
             return res.status(400).json({ message: `Form is not awaiting Principal approval or already processed.` });
        }
        
        form.approval_history.push({
            authority_role: 'principal',
            authority_id: req.user._id,
            action: action,
            remarks: remarks
        });

        if (action === 'ACCEPT') {
            form.current_status = 'accepted';
        } else if (action === 'REJECT') {
            form.current_status = 'rejected';
            form.rejection_reason = remarks; 
        }

        await form.save();
        res.json({ message: `Form ${action} successfully.`, form });

    } catch (error) {
        console.error("Error processing principal action:", error);
        res.status(500).json({ message: 'Server error processing action.' });
    }
});

module.exports = router;
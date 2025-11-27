const mongoose = require('mongoose');

const approvalHistorySchema = mongoose.Schema({
    authority_role: { 
        type: String, 
        enum: ['proctor', 'hod', 'principal'], 
        required: true 
    },
    authority_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['ACCEPT', 'ESCALATE', 'REJECT'], required: true },
    remarks: { type: String, default: 'N/A' },
    timestamp: { type: Date, default: Date.now }
});

const formSchema = mongoose.Schema({
    student_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    submitted_at: { type: Date, default: Date.now },
    current_status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    current_authority: { 
        type: String, 
        enum: ['proctor', 'hod', 'principal'], 
        default: 'proctor' 
    },
    rejection_reason: { type: String, default: null },
    approval_history: [approvalHistorySchema] 
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);
module.exports = Form;
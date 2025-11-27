const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true }, // USN or ID
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'proctor', 'hod', 'principal', 'admin'], required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    designation: { type: String },
    department: { type: String }, 
    semester: { type: String },   
    section: { type: String },    
    proctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Student reference
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
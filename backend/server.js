const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Configuration Imports ---
const connectDB = require('./config/db');

// --- Route Imports (Corrected Paths: './routes/...') ---
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const proctorRoutes = require('./routes/proctorRoutes');
const hodRoutes = require('./routes/hodRoutes');
const principalRoutes = require('./routes/principalRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB(); // Initialize DB connection

const app = express();
app.use(express.json()); // Body parser
app.use(cors({ origin: 'https://svit-commonform-frontend.onrender.com', credentials: true })); 

// --- Mount Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/proctor', proctorRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/principal', principalRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => { res.send('API is running...'); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`🚀 Server running on port ${PORT}`));

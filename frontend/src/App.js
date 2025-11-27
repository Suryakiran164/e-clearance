// frontend/src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components and Pages
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/Navbar'; 
import Login from './pages/Login'; 
import Unauthorized from './pages/Unauthorized';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import SubmitForm from './pages/Student/SubmitForm';
import SubmittedForms from './pages/Student/SubmittedForms';
import ProctorDashboard from './pages/Staff/ProctorDashboard';
import HODDashboard from './pages/Staff/HODDashboard';
import PrincipalDashboard from './pages/Staff/PrincipalDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import UserManagement from './pages/Admin/UserManagement';

function App() {
  return (
    <div className="App">
        <Navbar />
        <div style={{ padding: '20px' }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* STUDENT ROUTES */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/submit-form" element={<SubmitForm />} />
                    <Route path="/student/forms" element={<SubmittedForms />} />
                </Route>

                {/* STAFF & ADMIN ROUTES - ALL allowedRoles MUST be lowercase */}
                
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
                    <Route path="/admin/users" element={<UserManagement />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['proctor']} />}>
                    <Route path="/proctor/dashboard" element={<ProctorDashboard />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['hod']} />}> 
                    <Route path="/hod/dashboard" element={<HODDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['principal']} />}>
                    <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    </div>
  );
}
export default App;
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

// Initial state for the single user creation form
const initialUserState = {
    username: '', password: '', role: 'student', email: '', name: '', 
    department: '', semester: '', section: '', designation: ''
};

const UserManagement = () => {
    // Existing state for bulk upload and proctorship
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [proctorUsername, setProctorUsername] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    
    // New state for single user creation
    const [singleUser, setSingleUser] = useState(initialUserState);

    // Context for token
    const { token } = useContext(AuthContext); 

    // --- Handlers for Single User Form ---
    const handleSingleUserChange = (e) => {
        setSingleUser({ ...singleUser, [e.target.name]: e.target.value });
    };

    const handleSingleUserSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');

        if (!singleUser.username || !singleUser.password || !singleUser.role || !singleUser.name || !singleUser.email) {
            return setStatusMessage('ERROR: Basic required fields (username, password, role, name, email) are missing.');
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(
                'http://localhost:5000/api/admin/add-single-user', 
                singleUser,
                config
            );
            setStatusMessage(`SUCCESS: ${data.message}`);
            setSingleUser(initialUserState); // Reset form
        } catch (err) {
            setStatusMessage(`ERROR: ${err.response?.data?.message || 'Failed to create user.'}`);
        }
    };

    // --- Existing Handlers (Bulk Upload) ---
    const handleBulkUpload = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        if (!file) {
            setStatusMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const config = { headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }};
            const { data } = await axios.post('http://localhost:5000/api/admin/bulk-upload', formData, config);
            setStatusMessage(`SUCCESS: ${data.message}`);
        } catch (err) {
            setStatusMessage(`ERROR: ${err.response?.data?.message || 'Failed to upload file. Check API server logs.'}`);
        }
    };

    // --- Existing Handlers (Proctor Mapping) ---
    const handleMapProctor = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        if (!proctorUsername || !studentUsername) {
            setStatusMessage('Both student and proctor usernames are required.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(
                'http://localhost:5000/api/admin/manage-proctorship', 
                { studentUsername, proctorUsername }, 
                config
            );
            setStatusMessage(`SUCCESS: ${data.message}`);
        } catch (err) {
            setStatusMessage(`ERROR: ${err.response?.data?.message || 'Mapping failed. Check IDs.'}`);
        }
    };

    return (
        <div style={styles.mainContainer}>
            <h2 style={styles.mainHeader}>👑 Admin: User Management</h2>

            {statusMessage && <p style={styles.statusMessage(statusMessage.startsWith('ERROR'))}>{statusMessage}</p>}

            <div style={styles.cardContainer}>
                
                {/* --- 1. NEW SECTION: Single User Form --- */}
                <div style={styles.fullCard}>
                    <h3 style={styles.cardHeader}>👤 Create Single User</h3>
                    <form onSubmit={handleSingleUserSubmit} style={styles.form}>
                        
                        {/* Row 1: Credentials */}
                        <div style={styles.formRow}>
                            <input name="username" type="text" placeholder="Username (USN/ID)*" value={singleUser.username} onChange={handleSingleUserChange} style={styles.input} required />
                            <input name="password" type="password" placeholder="Password*" value={singleUser.password} onChange={handleSingleUserChange} style={styles.input} required />
                            <select name="role" value={singleUser.role} onChange={handleSingleUserChange} style={styles.input} required>
                                <option value="student">Student</option>
                                <option value="proctor">Proctor</option>
                                <option value="HOD">HOD</option>
                                <option value="principal">Principal</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        {/* Row 2: Basic Info */}
                        <div style={styles.formRow}>
                            <input name="name" type="text" placeholder="Full Name*" value={singleUser.name} onChange={handleSingleUserChange} style={styles.input} required />
                            <input name="email" type="email" placeholder="Email*" value={singleUser.email} onChange={handleSingleUserChange} style={styles.input} required />
                            <input name="designation" type="text" placeholder="Designation" value={singleUser.designation} onChange={handleSingleUserChange} style={styles.input} />
                        </div>
                        
                        {/* Row 3: Academic Info */}
                        <div style={styles.formRow}>
                            <input name="department" type="text" placeholder="Department (e.g., CS)" value={singleUser.department} onChange={handleSingleUserChange} style={styles.input} />
                            <input name="semester" type="text" placeholder="Semester" value={singleUser.semester} onChange={handleSingleUserChange} style={styles.input} />
                            <input name="section" type="text" placeholder="Section" value={singleUser.section} onChange={handleSingleUserChange} style={styles.input} />
                        </div>

                        <button type="submit" style={styles.submitButton}>Add New User</button>
                    </form>
                </div>
            </div>

            <h3 style={{...styles.mainHeader, marginTop: '40px'}}>Bulk & Assignment Tools</h3>
            <div style={styles.cardContainer}>
                 
                {/* --- 2. Existing Bulk Upload Card --- */}
                <div style={styles.halfCard}>
                    <h3 style={styles.cardHeader}>📊 Bulk User Upload (Excel/CSV)</h3>
                    <form onSubmit={handleBulkUpload} style={styles.form}>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                        <p style={styles.note}>Upload sheet containing user details (username, role, etc.).</p>
                        <button type="submit" style={styles.submitButton}>Upload and Inject Data</button>
                    </form>
                </div>

                {/* --- 3. Existing Proctor Mapping Card --- */}
                <div style={styles.halfCard}>
                    <h3 style={styles.cardHeader}>🔗 Manage Proctor Assignment</h3>
                    <form onSubmit={handleMapProctor} style={styles.form}>
                        <input type="text" placeholder="Student USN/ID" value={studentUsername} onChange={(e) => setStudentUsername(e.target.value)} style={styles.input} required />
                        <input type="text" placeholder="Proctor ID" value={proctorUsername} onChange={(e) => setProctorUsername(e.target.value)} style={styles.input} required />
                        <button type="submit" style={styles.submitButton}>Assign Proctor</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: { maxWidth: '1200px', margin: 'auto', padding: '20px' },
    mainHeader: { borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    cardContainer: { display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '30px' },
    fullCard: { width: '100%', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', backgroundColor: '#fdfdfd' },
    halfCard: { flex: 1, minWidth: '300px', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', backgroundColor: '#fdfdfd' },
    cardHeader: { color: '#007bff', borderBottom: '1px dashed #eee', paddingBottom: '10px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    formRow: { display: 'flex', gap: '10px' }, // Correctly defined style for horizontal grouping
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 },
    note: { fontSize: '0.8em', color: '#555' },
    submitButton: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    statusMessage: (isError) => ({
        marginTop: '20px',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '4px',
        backgroundColor: isError ? '#f8d7da' : '#d4edda',
        color: isError ? '#721c24' : '#155724',
        fontWeight: 'bold',
    })
};

export default UserManagement;
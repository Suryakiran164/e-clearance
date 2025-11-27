import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// ❗ CRITICAL FIX: AuthContext is a NAMED export. It MUST be imported with curly braces {}.
import { AuthContext } from '../../context/AuthContext'; 

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // FIX: useContext will now receive the correctly imported context object
    const { token } = useContext(AuthContext); 

    useEffect(() => {
        const fetchProfile = async () => {
            // Only proceed if the token is available
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                // Using axios directly here, assuming manual header passing
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Adjust endpoint path based on your file structure (two levels up to src, then into context)
                const { data } = await axios.get('http://localhost:5000/api/student/profile', config);
                setProfile(data);
            } catch (err) {
                setError('Failed to fetch profile data. Check network or server.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]); 

    if (loading) return <h2>Loading Profile...</h2>;
    if (error) return <p style={{ color: 'red', margin: '20px' }}>Error: {error}</p>;
    if (!profile) return <p style={{ margin: '20px' }}>Profile data not available.</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>👤 Student Profile</h2>
            <div style={styles.detailGrid}>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>USN/ID:</strong> {profile.username}</p>
                <p><strong>Role:</strong> {profile.role.toUpperCase()}</p>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Semester:</strong> {profile.semester}</p>
                <p><strong>Section:</strong> {profile.section}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                {/* Safe access to proctor data */}
                <p><strong>Proctor:</strong> {profile.proctor ? `${profile.proctor.name} (${profile.proctor.email})` : 'Not Assigned'}</p>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '700px', margin: 'auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
    header: { borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }
};

export default StudentProfile;
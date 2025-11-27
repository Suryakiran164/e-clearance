import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    return (
        <div>
            <h2>📚 Student Dashboard</h2>
            <p>Welcome! Select an action below:</p>
            <div style={styles.cardContainer}>
                <Link to="/student/profile" style={styles.cardLink}>
                    <div style={styles.card}>
                        <h3>👤 View Profile</h3>
                        <p>Access your personal and academic details.</p>
                    </div>
                </Link>
                <Link to="/student/submit-form" style={styles.cardLink}>
                    <div style={styles.card}>
                        <h3>📝 Submit Common Form</h3>
                        <p>Initiate a new clearance or request form.</p>
                    </div>
                </Link>
                <Link to="/student/forms" style={styles.cardLink}>
                    <div style={styles.card}>
                        <h3>✅ View Form Status</h3>
                        <p>Track the progress of your submitted requests.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const styles = {
    cardContainer: { display: 'flex', gap: '20px', marginTop: '20px' },
    cardLink: { textDecoration: 'none', color: 'inherit', flex: 1 },
    card: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.3s', minHeight: '120px' },
};

export default StudentDashboard;
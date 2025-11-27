import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div>
            <h2>👑 Admin Dashboard & Management</h2>
            <p>Welcome, Administrator. Use the links below to manage the institutional data and user mappings.</p>
            <div style={styles.cardContainer}>
                <Link to="/admin/users" style={styles.cardLink}>
                    <div style={styles.card}>
                        <h3>👥 Manage Users & Bulk Upload</h3>
                        <p>Add students/staff via Excel sheet and manage proctorship mapping.</p>
                    </div>
                </Link>
                {/* Add links for HOD/Principal mapping if needed */}
                {/* <Link to="/admin/reports" style={styles.cardLink}> ... </Link> */}
            </div>
        </div>
    );
};
const styles = {
    cardContainer: { display: 'flex', gap: '20px', marginTop: '20px' },
    cardLink: { textDecoration: 'none', color: 'inherit', flex: 1 },
    card: { padding: '20px', border: '1px solid #007bff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s' },
};
export default AdminDashboard;
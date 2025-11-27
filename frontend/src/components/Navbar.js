import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const Navbar = () => {
    // role is initialized to null when not logged in
    const { isAuthenticated, role, logout } = useContext(AuthContext); 

    const getDashboardLink = () => {
        // Only return a dashboard link if role exists, otherwise default to home or login
        if (!role) return '/login'; 
        return `/${role}/dashboard`; 
    };

    return (
        <nav style={styles.navbar}>
            <Link to={isAuthenticated ? getDashboardLink() : '/login'} style={styles.logo}>E-Clearance Portal</Link>
            
            <div style={styles.navLinks}>
                {/* FIX: Only render the user-specific items if BOTH isAuthenticated AND role exist */}
                {isAuthenticated && role && ( 
                    <>
                        {/* The role is checked, so toUpperCase() is safe */}
                        <span style={styles.roleTag}>Role: {role.toUpperCase()}</span> 
                        <Link to={getDashboardLink()} style={styles.link}>Dashboard</Link>
                        <button onClick={logout} style={styles.logoutButton}>Logout</button>
                    </>
                )}
                {!isAuthenticated && (
                    <Link to="/login" style={styles.link}>Login</Link>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' },
    logo: { textDecoration: 'none', color: 'white', fontSize: '1.5em', fontWeight: 'bold' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '20px' },
    roleTag: { color: '#ffc107', fontWeight: 'bold', border: '1px solid #ffc107', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
    link: { textDecoration: 'none', color: 'white', transition: 'color 0.3s' },
    logoutButton: { padding: '8px 15px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;
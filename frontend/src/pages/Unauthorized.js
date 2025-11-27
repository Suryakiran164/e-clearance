import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🚫 Access Denied (403)</h1>
      <p style={styles.message}>You do not have the required role or permission to view this page.</p>
      <Link to="/login" style={styles.link}>Go to Login</Link>
    </div>
  );
};

const styles = {
    container: { textAlign: 'center', marginTop: '100px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '8px' },
    header: { color: '#c0392b', fontSize: '2.5em' },
    message: { fontSize: '1.2em', margin: '20px 0' },
    link: { textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }
};

export default Unauthorized;
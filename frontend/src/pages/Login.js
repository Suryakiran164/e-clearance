import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; // Add useNavigate for safe measure

const Login = () => {
    // You MUST include React, useState, useContext, and axios logic here
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext); 
    const navigate = useNavigate(); // Add navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            login(data.token, data.role);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Portal Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    style={styles.input} 
                    type="text" 
                    placeholder="USN or Roll Number" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    style={styles.input} 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button style={styles.button} type="submit">Login</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
            <p style={styles.forgotPassword}><a href="/forgot-password">Forgot Password?</a></p>
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '400px', 
        margin: '100px auto',
        padding: '30px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff'
    },
    header: { textAlign: 'center', color: '#333', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' },
    error: { color: 'red', textAlign: 'center', marginTop: '15px', fontWeight: 'bold' },
    forgotPassword: { textAlign: 'center', fontSize: '14px', marginTop: '15px' }
};

// CRITICAL FIX: Ensure the component is DEFAULT EXPORTED
export default Login;
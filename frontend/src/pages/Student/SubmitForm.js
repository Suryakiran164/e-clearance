import React, { useState, useContext } from 'react';
import axios from 'axios';
// ✅ Import the necessary context object
import { AuthContext } from '../../context/AuthContext'; 

const SubmitForm = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // Get token from context
    const { token } = useContext(AuthContext); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
             setError('Authentication token is missing. Please log in again.');
             return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(
                'http://localhost:5000/api/student/submit-form',
                { subject, body },
                config
            );
            
            // ✅ FIX 1: Clear status and inputs immediately upon success
            setMessage(data.message || "Form submitted successfully!");
            setSubject('');
            setBody('');
            setError(''); // Clear any previous errors

        } catch (err) {
            // Check for the "Proctor not assigned" error (400 Bad Request)
            const errorMessage = err.response?.data?.message || 'Failed to submit form. Check server logs.';
            setError(errorMessage);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>📝 Submit New Common Form</h2>
            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Subject of the Request" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    style={styles.input}
                    required 
                />
                <textarea 
                    placeholder="Detailed Body of the Request" 
                    rows="8"
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    style={{...styles.input, ...styles.textarea}}
                    required 
                />
                <button 
                    type="submit" 
                    style={styles.button}
                >
                    Send to Proctor
                </button>
            </form>
        </div>
    );
};

const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', marginTop: '20px' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    textarea: { resize: 'vertical' },
    button: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    successMessage: { color: 'green', fontWeight: 'bold' },
    errorMessage: { color: 'red', fontWeight: 'bold' }
};

export default SubmitForm;
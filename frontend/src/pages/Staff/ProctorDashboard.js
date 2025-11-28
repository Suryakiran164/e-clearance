import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

const ProctorDashboard = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    // Get token from context (must be named import)
    const { token } = useContext(AuthContext); 

    // Memoized Function to Fetch Data
    const fetchForms = useCallback(async () => {
        setLoading(true);
        try {
            if (!token) {
                setLoading(false);
                return;
            } 

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('https://svit-commonform-backend.onrender.com/api/proctor/forms', config);
            
            setForms(data); 

        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    }, [token]); 

    // useEffect for Initial Load and Explicit Refresh
    useEffect(() => {
        fetchForms();
    }, [fetchForms, refreshTrigger]); 

    // Handler for Actions (ACCEPT, ESCALATE, REJECT)
    const handleAction = async (formId, action, remarks = '') => {
        if (!token) {
            alert('Authentication required. Please log in again.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                `https://svit-commonform-backend.onrender.com/api/proctor/forms/${formId}/action`, 
                { action, remarks }, 
                config
            );
            alert(`Form ${action} successfully!`);
            
            // Increment the trigger to force useEffect to re-run and fetch new data
            setRefreshTrigger(prev => prev + 1); 

        } catch (error) {
            alert(`Action failed: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    if (loading) return <h2>🔄 Loading Proctor Approvals...</h2>;

    return (
        <div>
            <h2>👨‍🏫 Proctor Dashboard: Pending Approvals ({forms.length})</h2>
            
            {/* Button Handler: Increments the trigger state */}
            <button 
                onClick={() => setRefreshTrigger(prev => prev + 1)} 
                style={styles.refreshButton}
            >
                Refresh Inbox
            </button>
            
            {forms.length === 0 ? (
                <p>No forms currently pending your approval.</p>
            ) : (
                forms.map(form => (
                    <div key={form._id} style={styles.formCard}>
                        <h3 style={styles.formHeader}>Subject: {form.subject}</h3>
                        <p><strong>Student:</strong> {form.student_id.name} ({form.student_id.username})</p>
                        <p><strong>Department:</strong> {form.student_id.department}</p>
                        
                        {/* ✅ FIX: RENDER THE FORM BODY (Request Details) */}
                        <p style={styles.formBodyText}><strong>Request Details:</strong> {form.body}</p>
                        
                        <div style={styles.actionButtons}>
                            <button style={styles.acceptBtn} onClick={() => handleAction(form._id, 'ACCEPT', 'Proctor approved.')}>ACCEPT</button>
                            <button style={styles.escalateBtn} onClick={() => handleAction(form._id, 'ESCALATE', 'Forwarded to HOD.')}>ESCALATE</button>
                            <button style={styles.rejectBtn} onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) handleAction(form._id, 'REJECT', reason);
                            }}>REJECT</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    formCard: { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' },
    formHeader: { color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
    // NEW STYLE: Added for visibility of the multi-line body content
    formBodyText: {
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#fff',
        borderLeft: '3px solid #007bff',
        fontSize: '1em',
        whiteSpace: 'pre-wrap' // Ensures new lines are preserved
    }, 
    actionButtons: { marginTop: '15px', display: 'flex', gap: '10px' },
    acceptBtn: { padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    escalateBtn: { padding: '8px 15px', backgroundColor: '#f39c12', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    rejectBtn: { padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    refreshButton: { marginBottom: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default ProctorDashboard;

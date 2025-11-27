import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// ❗ CRITICAL FIX: AuthContext is a NAMED export. It MUST be imported with curly braces.
import { AuthContext } from '../../context/AuthContext'; 

const HODDashboard = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // FIX: useContext will now receive the correctly imported context object
    const { token } = useContext(AuthContext); 

    // Use useCallback to memoize the fetch function and avoid dependency warnings
    const fetchForms = async () => {
        setLoading(true);
        try {
            // Only proceed if the token is available
            if (!token) {
                setLoading(false);
                return;
            } 

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/hod/forms', config);
            setForms(data);
        } catch (error) {
            console.error('Error fetching HOD forms:', error);
            // Optionally redirect to login if the error is 401 Unauthorized
        } finally {
            setLoading(false);
        }
    };
    
    // Run fetchForms whenever the token state changes (i.e., upon login/refresh)
    useEffect(() => {
        fetchForms();
    }, [token]); // Dependency array includes token

    const handleAction = async (formId, action, remarks = '') => {
        if (!token) {
            alert('Authentication required. Please log in again.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                `http://localhost:5000/api/hod/forms/${formId}/action`, 
                { action, remarks }, 
                config
            );
            alert(`Form ${action} successfully!`);
            fetchForms(); // Refresh the list after action
        } catch (error) {
            alert(`Action failed: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    if (loading) return <h2>Loading HOD Approvals...</h2>;

    return (
        <div>
            <h2>👨‍🎓 HOD Dashboard: Pending Approvals ({forms.length})</h2>
            <button onClick={fetchForms} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Refresh Inbox
            </button>
            
            {forms.length === 0 ? (
                <p>No forms currently pending HOD approval in your department.</p>
            ) : (
                forms.map(form => (
                    <div key={form._id} style={styles.formCard}>
                        <h3 style={styles.formHeader}>Subject: {form.subject}</h3>
                        <p><strong>Student:</strong> {form.student_id.name} ({form.student_id.username})</p>
                        <p><strong>Submitted Body:</strong> {form.body}</p>
                        <div style={styles.actionButtons}>
                            <button style={styles.acceptBtn} onClick={() => handleAction(form._id, 'ACCEPT', 'HOD Approved.')}>ACCEPT</button>
                            <button style={styles.escalateBtn} onClick={() => handleAction(form._id, 'ESCALATE', 'Forwarded to Principal.')}>ESCALATE</button>
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
    actionButtons: { marginTop: '15px', display: 'flex', gap: '10px' },
    acceptBtn: { padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    escalateBtn: { padding: '8px 15px', backgroundColor: '#f39c12', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    rejectBtn: { padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default HODDashboard;
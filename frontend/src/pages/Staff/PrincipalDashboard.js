import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

const PrincipalDashboard = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // FIX: useContext receives the correctly imported context object
    const { token } = useContext(AuthContext); 

    const fetchForms = async () => {
        setLoading(true);
        try {
            if (!token) {
                setLoading(false);
                return;
            } 

            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Fetch forms currently pending at Principal level
            const { data } = await axios.get('http://localhost:5000/api/principal/forms', config);
            setForms(data);
        } catch (error) {
            console.error('Error fetching Principal forms:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchForms();
    }, [token]); // Run effect when token changes

    const handleAction = async (formId, action, remarks = '') => {
        if (!token) {
            alert('Authentication required. Please log in again.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                `http://localhost:5000/api/principal/forms/${formId}/action`, 
                { action, remarks }, 
                config
            );
            alert(`Form ${action} successfully! (Final Decision)`);
            fetchForms(); // Refresh list
        } catch (error) {
            alert(`Action failed: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    if (loading) return <h2>Loading Principal Approvals...</h2>;

    return (
        <div>
            <h2>🏛️ Principal Dashboard: Final Approvals ({forms.length})</h2>
            <button onClick={fetchForms} style={styles.refreshButton}>Refresh</button>
            
            {forms.length === 0 ? (
                <p>No forms currently pending your final approval.</p>
            ) : (
                forms.map(form => (
                    <div key={form._id} style={styles.formCard}>
                        <h3 style={styles.formHeader}>Subject: {form.subject} (Escalated by HOD)</h3>
                        <p><strong>Student:</strong> {form.student_id.name} ({form.student_id.username})</p>
                        <p><strong>Department:</strong> {form.student_id.department}</p>
                        
                        {/* ✅ FIX: RENDER THE FORM BODY (Request Details) */}
                        <p style={styles.formBodyText}><strong>Request Details:</strong> {form.body}</p>
                        
                        <div style={styles.actionButtons}>
                            <button style={styles.acceptBtn} onClick={() => handleAction(form._id, 'ACCEPT', 'Principal Approved - Final.')}>ACCEPT</button>
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

const styles = { // Retained and updated styles
    formCard: { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' },
    formHeader: { color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
    refreshButton: { marginBottom: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    // NEW STYLE: Added for visibility of the multi-line body content
    formBodyText: {
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#fff',
        borderLeft: '3px solid #e74c3c', // Distinct color for Principal's view
        fontSize: '1em',
        whiteSpace: 'pre-wrap'
    }, 
    actionButtons: { marginTop: '15px', display: 'flex', gap: '10px' },
    acceptBtn: { padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    rejectBtn: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default PrincipalDashboard;
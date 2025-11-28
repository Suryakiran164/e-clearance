import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// ❗ CRITICAL FIX: AuthContext is a NAMED export. It MUST be imported with curly braces {}.
import { AuthContext } from '../../context/AuthContext'; 

const SubmittedForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    // FIX: useContext now receives the correctly imported context object
    const { token } = useContext(AuthContext); 

    useEffect(() => {
        const fetchForms = async () => {
            // Only proceed if the token is available
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Using axios directly here, assuming manual header passing
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('https://svit-commonform-backend.onrender.com/api/student/forms', config);
                setForms(data);
            } catch (err) {
                console.error('Error fetching submitted forms:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchForms();
    }, [token]); // Dependency array includes token

    const getStatusColor = (status) => {
        if (status === 'accepted') return 'green';
        if (status === 'rejected') return 'red';
        return 'orange'; // Pending
    };

    if (loading) return <h2>Loading Submitted Forms...</h2>;

    return (
        <div>
            <h2>✅ Submitted Forms Status</h2>
            {forms.length === 0 ? (
                <p>You have not submitted any forms yet.</p>
            ) : (
                forms.map((form) => (
                    <div key={form._id} style={styles.formCard}>
                        <h3 style={styles.formSubject}>{form.subject}</h3>
                        <p><strong>Submitted On:</strong> {new Date(form.submitted_at).toLocaleDateString()}</p>
                        <p><strong>Current Authority:</strong> {form.current_authority.toUpperCase()}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span style={{ color: getStatusColor(form.current_status), fontWeight: 'bold', marginLeft: '10px' }}>
                                {form.current_status.toUpperCase()}
                            </span>
                        </p>
                        
                        {form.current_status === 'rejected' && (
                            <p style={styles.rejectionReason}><strong>Reason:</strong> {form.rejection_reason}</p>
                        )}

                        {/* Print ACK Option for accepted forms */}
                        {form.current_status === 'accepted' && (
                            <button onClick={() => alert(`Printing Acknowledgment for Form ${form._id}`)} style={styles.printButton}>
                                Print Acknowledgment
                            </button>
                        )}
                        
                        <div style={styles.historyContainer}>
                            <h4>Approval History:</h4>
                            {form.approval_history.map((h, index) => (
                                <p key={index} style={styles.historyItem}>
                                    [{new Date(h.timestamp).toLocaleDateString()}]: {h.authority_role.toUpperCase()} 
                                    - {h.action.toUpperCase()} ({h.remarks})
                                </p>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    formCard: { border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' },
    formSubject: { color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
    rejectionReason: { color: '#dc3545', fontWeight: 'bold', backgroundColor: '#f8d7da', padding: '8px', borderRadius: '4px' },
    historyContainer: { marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #eee' },
    historyItem: { fontSize: '0.9em', color: '#555' },
    printButton: { padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default SubmittedForms;

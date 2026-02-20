import { useState, useEffect } from 'react';
import api from '../utils/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        projectId: '',
        amount: '',
        dueDate: '',
        status: 'Unpaid'
    });

    const { projectId, amount, dueDate, status } = formData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentsRes, projectsRes] = await Promise.all([
                    api.get('/payments'),
                    api.get('/projects')
                ]);
                setPayments(paymentsRes.data);
                setProjects(projectsRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/payments', formData);
            // Refresh to get populated project title
            const newPayment = { ...res.data, projectId: projects.find(p => p._id === formData.projectId) };
            setPayments([...payments, newPayment]);
            setFormData({
                projectId: '',
                amount: '',
                dueDate: '',
                status: 'Unpaid'
            });
        } catch (err) {
            setError('Failed to add payment');
        }
    };

    const deletePayment = async (id) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                await api.delete(`/payments/${id}`);
                setPayments(payments.filter((payment) => payment._id !== id));
            } catch (err) {
                setError('Failed to delete payment');
            }
        }
    };

    const markAsPaid = async (id) => {
        try {
            const res = await api.patch(`/payments/${id}`, { status: 'Paid', paidDate: new Date() });
            setPayments(payments.map(p => p._id === id ? { ...p, status: 'Paid', paidDate: res.data.paidDate } : p));
        } catch (err) {
            setError('Failed to update payment status');
        }
    };

    if (loading) return <div>Loading payments...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Payments</h1>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Add Payment Form */}
                <div className="stat-card">
                    <h3>Add New Payment</h3>
                    <form onSubmit={onSubmit} style={{ marginTop: '15px' }}>
                        <div className="form-group">
                            <label>Project</label>
                            <select
                                name="projectId"
                                value={projectId}
                                onChange={onChange}
                                required
                            >
                                <option value="">Select Project</option>
                                {projects.map(project => (
                                    <option key={project._id} value={project._id}>{project.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                value={amount}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={dueDate}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={status}
                                onChange={onChange}
                            >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <button type="submit" className="btn">Add Payment</button>
                    </form>
                </div>

                {/* Payments List */}
                <div>
                    {payments.length === 0 ? (
                        <p>No payments found. Add one to get started.</p>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{payment.projectId?.title || 'Unknown Project'}</td>
                                            <td>${payment.amount}</td>
                                            <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge badge-${payment.status === 'Paid' ? 'success' : 'warning'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td>
                                                {payment.status !== 'Paid' && (
                                                    <button onClick={() => markAsPaid(payment._id)} className="action-btn" style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button onClick={() => deletePayment(payment._id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;

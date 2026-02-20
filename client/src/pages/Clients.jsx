import { useState, useEffect } from 'react';
import api from '../utils/api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        hourlyRate: '',
        notes: ''
    });

    const { name, email, company, hourlyRate, notes } = formData;

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch clients');
            setLoading(false);
        }
    };

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/clients', formData);
            setClients([...clients, res.data]);
            setFormData({
                name: '',
                email: '',
                company: '',
                hourlyRate: '',
                notes: ''
            });
        } catch (err) {
            setError('Failed to add client');
        }
    };

    const deleteClient = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await api.delete(`/clients/${id}`);
                setClients(clients.filter((client) => client._id !== id));
                setError(null);
            } catch (err) {
                console.error('Delete error:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to delete client');
            }
        }
    };

    if (loading) return <div>Loading clients...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Clients</h1>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Add Client Form */}
                <div className="stat-card">
                    <h3>Add New Client</h3>
                    <form onSubmit={onSubmit} style={{ marginTop: '15px' }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Company (Optional)</label>
                            <input
                                type="text"
                                name="company"
                                value={company}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={hourlyRate}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                value={notes}
                                onChange={onChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db' }}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn">Add Client</button>
                    </form>
                </div>

                {/* Clients List */}
                <div>
                    {clients.length === 0 ? (
                        <p>No clients found. Add one to get started.</p>
                    ) : (
                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                            {clients.map((client) => (
                                <div key={client._id} className="stat-card" style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '5px' }}>{client.name}</h3>
                                        <button onClick={() => deleteClient(client._id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 10px 0', fontWeight: 'normal' }}>{client.company || 'Individual'}</p>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                                        <strong>Email:</strong> {client.email}
                                    </div>
                                    {client.hourlyRate && (
                                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                                            <strong>Rate:</strong> ${client.hourlyRate}/hr
                                        </div>
                                    )}
                                    {client.notes && (
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '10px', fontStyle: 'italic' }}>
                                            "{client.notes}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Clients;

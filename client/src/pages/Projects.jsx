import { useState, useEffect } from 'react';
import api from '../utils/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        clientId: '',
        title: '',
        deadline: '',
        budget: '',
        status: 'Active'
    });

    const { clientId, title, deadline, budget, status } = formData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, clientsRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/clients')
                ]);
                setProjects(projectsRes.data);
                setClients(clientsRes.data);
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
            const res = await api.post('/projects', formData);
            // Refresh to get populated client name
            const newProject = { ...res.data, clientId: clients.find(c => c._id === formData.clientId) };
            setProjects([...projects, newProject]);
            setFormData({
                clientId: '',
                title: '',
                deadline: '',
                budget: '',
                status: 'Active'
            });
        } catch (err) {
            setError('Failed to add project');
        }
    };

    const deleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter((project) => project._id !== id));
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await api.patch(`/projects/${id}`, { status: newStatus });
            setProjects(projects.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (err) {
            setError('Failed to update status');
        }
    }

    if (loading) return <div>Loading projects...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Projects</h1>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Add Project Form */}
                <div className="stat-card">
                    <h3>Add New Project</h3>
                    <form onSubmit={onSubmit} style={{ marginTop: '15px' }}>
                        <div className="form-group">
                            <label>Client</label>
                            <select
                                name="clientId"
                                value={clientId}
                                onChange={onChange}
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Project Title</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={deadline}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Budget ($)</label>
                            <input
                                type="number"
                                name="budget"
                                value={budget}
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
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button type="submit" className="btn">Add Project</button>
                    </form>
                </div>

                {/* Projects List */}
                <div>
                    {projects.length === 0 ? (
                        <p>No projects found. Add one to get started.</p>
                    ) : (
                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                            {projects.map((project) => (
                                <div key={project._id} className="stat-card" style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '5px' }}>{project.title}</h3>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <span className={`badge badge-${project.status === 'Active' ? 'success' : project.status === 'Completed' ? 'primary' : 'danger'}`}
                                                style={{
                                                    background: project.status === 'Active' ? '#d1fae5' : project.status === 'Completed' ? '#dbeafe' : '#fee2e2',
                                                    color: project.status === 'Active' ? '#065f46' : project.status === 'Completed' ? '#1e40af' : '#991b1b'
                                                }}>
                                                {project.status}
                                            </span>
                                            <button onClick={() => deleteProject(project._id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}>&times;</button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 10px 0', fontWeight: 'normal' }}>
                                        Client: {project.clientId?.name || 'Unknown'}
                                    </p>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span><strong>Budget:</strong> ${project.budget}</span>
                                        <span><strong>Due:</strong> {new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>

                                    <div style={{ marginTop: '15px', borderTop: '1px solid #efefef', paddingTop: '10px' }}>
                                        <small style={{ display: 'block', marginBottom: '5px', color: '#9ca3af' }}>Update Status:</small>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {project.status !== 'Active' && <button onClick={() => updateStatus(project._id, 'Active')} className="action-btn" style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Active</button>}
                                            {project.status !== 'Completed' && <button onClick={() => updateStatus(project._id, 'Completed')} className="action-btn" style={{ background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Complete</button>}
                                            {project.status !== 'Cancelled' && <button onClick={() => updateStatus(project._id, 'Cancelled')} className="action-btn" style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;

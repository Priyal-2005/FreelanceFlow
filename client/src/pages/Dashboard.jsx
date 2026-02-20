import { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingAmount: 0,
        activeProjectsCount: 0,
        totalClientsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard');
                setStats(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p style={{ color: 'var(--success-color)' }}>${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Payments</h3>
                    <p style={{ color: 'var(--warning-color)' }}>${stats.pendingAmount.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Projects</h3>
                    <p>{stats.activeProjectsCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Clients</h3>
                    <p>{stats.totalClientsCount}</p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <a href="/clients" className="btn" style={{ textDecoration: 'none', display: 'block' }}>Manage Clients</a>
                    <a href="/projects" className="btn" style={{ textDecoration: 'none', display: 'block' }}>Manage Projects</a>
                    <a href="/payments" className="btn" style={{ textDecoration: 'none', display: 'block' }}>Track Payments</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

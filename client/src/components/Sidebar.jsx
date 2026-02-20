import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="sidebar">
            <h2 style={{ paddingLeft: '15px' }}>
                FreelanceFlow
            </h2>
            <div style={{ paddingLeft: '15px', marginBottom: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
                Welcome, {user?.name}
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard" className={isActive('/dashboard')}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/clients" className={isActive('/clients')}>
                            Clients
                        </Link>
                    </li>
                    <li>
                        <Link to="/projects" className={isActive('/projects')}>
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link to="/payments" className={isActive('/payments')}>
                            Payments
                        </Link>
                    </li>
                </ul>
            </nav>
            <div style={{ marginTop: 'auto', padding: '15px' }}>
                <button onClick={logout} className="btn btn-danger" style={{ width: '100%' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

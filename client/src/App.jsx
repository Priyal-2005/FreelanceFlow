import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Payments from './pages/Payments';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route element={<PrivateRoute />}>
                        <Route element={<Layout />}>
                            <Route path='/dashboard' element={<Dashboard />} />
                            <Route path='/clients' element={<Clients />} />
                            <Route path='/projects' element={<Projects />} />
                            <Route path='/payments' element={<Payments />} />
                            <Route path='/' element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;

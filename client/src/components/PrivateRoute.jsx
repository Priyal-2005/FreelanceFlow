import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // If loading, you might want to return a loading spinner
    if (loading) return <div>Loading...</div>;

    // If user is authenticated, render child routes, otherwise redirect to login
    // We check for user object OR token in localStorage for persistent login state
    const token = localStorage.getItem('token');

    return token ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;

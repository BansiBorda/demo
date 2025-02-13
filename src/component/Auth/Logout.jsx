import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { logout } from '../../services/api';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the API logout endpoint
            await logout();
            // Clear token and other user data from local storage
            localStorage.removeItem('token');
            message.success('Logged out successfully');
            navigate('/login'); // Redirect to login page
        } catch (error) {
            message.error('Logout failed: ' + error.response?.data?.message);
        }
    };

    useEffect(() => {
        handleLogout(); // Trigger logout when the page is accessed
    }, []);

    return (
        <React.Fragment>
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1>Logging you out...</h1>
                <Button type="primary" onClick={() => navigate('/login')}>
                    Go to Login
                </Button>
            </div>
        </React.Fragment>
    );
};

export default Logout;

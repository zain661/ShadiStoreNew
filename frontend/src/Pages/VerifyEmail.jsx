import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            fetch(`${process.env.SERVER_URL}/verify-email?token=${token}`)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        setMessage(data.message);
                        setIsVerified(true);
                        setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
                    } else if (data.error) {
                        setMessage(data.error);
                    }
                })
                .catch(error => {
                    setMessage('Error verifying email');
                    console.error('Error verifying email:', error);
                });
        } else {
            setMessage('Invalid verification link');
        }
    }, [location, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Email Verification</h2>
            <p>{message}</p>
            {isVerified && <p>Redirecting to login page...</p>}
        </div>
    );
};

export default VerifyEmail;

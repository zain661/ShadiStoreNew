import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSS/LoginSignup.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const verified = query.get('verified');
        if (verified === 'true') {
            setSuccess('تم التحقق من بريدك الإلكتروني بنجاح. يرجى تسجيل الدخول.');
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('auth-token', data.token);
                navigate('/'); // Redirect to dashboard or another protected route
                window.location.reload(); // Force re-render of Navbar
            } else if (data.error) {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
        }
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>تسجيل الدخول</h1>
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="loginsignup-fields">
                    <input
                        type="email"
                        name="email"
                        placeholder="الإيميل"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="كلمة السر"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">استمر</button>
                </form>
                <p className='loginsignup-login'>
                    إذا كنت لا تملك حساب{' '}
                    <a href="/register">سجل هنا</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

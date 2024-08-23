import React, { useState } from 'react';
// import './CSS/loginSignup.css';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://shadi-store-new.vercel.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.message) {
                alert('تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني.');
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>انشاء حساب</h1>
                <form onSubmit={handleSubmit} className="loginsignup-fields">
                    <input type="text" name="name" placeholder="الاسم" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="الإيميل" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="كلمة السر" onChange={handleChange} required />
                    <button type="submit">تسجيل</button>
                </form>
                <p className='loginsignup-login'>
                    إذا كنت تملك حساب{' '}
                    <Link to="/login">سجل الدخول من هنا</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

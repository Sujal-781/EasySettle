import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const errors = { name: '', email: '', password: '' };

        if (!formData.name) {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Enter a valid email';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await api.post('/users/register', formData);
            navigate('/');
        } catch (err) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                email: 'Email already in use or registration failed'
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="container">
            {/* Left Section */}
            <div className="text-box column">
                <h1>EasySettle</h1>
                <p>
                    Join thousands of people who use EasySettle to manage shared
                    expenses and settle debts effortlessly.
                </p>
                <div className="features">
                    <div className="feature">💸 Track shared expenses</div>
                    <div className="feature">📊 Smart debt simplification</div>
                    <div className="feature">🤝 Settle debts instantly</div>
                </div>
            </div>

            {/* Register Card */}
            <div className="login-box column">
                <h2>Create Account</h2>
                <p className="subtitle">Sign up to get started with EasySettle.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <small>Full Name</small>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <small className="error">{formErrors.name}</small>
                    </div>
                    <div className="form-group">
                        <small>Email</small>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <small className="error">{formErrors.email}</small>
                    </div>
                    <div className="form-group">
                        <small>Password</small>
                        <input
                            type="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <small className="error">{formErrors.password}</small>
                    </div>
                    <button type="submit">Create Account</button>
                </form>

                <div className="bottom-text">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/')}>Sign In</span>
                </div>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateName = () => {
        if (!name) { setNameError('Name is required'); return false; }
        setNameError(''); return true;
    };

    const validateEmail = () => {
        if (!email) { setEmailError('Email is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email'); return false; }
        setEmailError(''); return true;
    };

    const validatePassword = () => {
        if (!password) { setPasswordError('Password is required'); return false; }
        if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); return false; }
        setPasswordError(''); return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nameValid = validateName();
        const emailValid = validateEmail();
        const passwordValid = validatePassword();
        if (!nameValid || !emailValid || !passwordValid) return;
        try {
            await api.post('/users/register', { name, email, password });
            navigate('/');
        } catch (err) {
            setEmailError('Email already in use or registration failed');
        }
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
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <small className="error">{nameError}</small>
                    </div>
                    <div className="form-group">
                        <small>Email</small>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <small className="error">{emailError}</small>
                    </div>
                    <div className="form-group">
                        <small>Password</small>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <small className="error">{passwordError}</small>
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
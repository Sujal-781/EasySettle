import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

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

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateEmail() || !validatePassword()) return;
        try {
            const response = await api.post('/users/login', { email, password });
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userName', response.data.name);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 401) {
                setPasswordError('Incorrect email or password');
            } else {
                setEmailError('Something went wrong. Try again.');
            }
        }
    }

    return (
        <div className="container">
            {/* Left Section */}
            <div className="text-box column">
                <h1>EasySettle</h1>
                <p>
                    Manage expenses, split bills with friends, and keep your finances
                    organized — all in one place.
                </p>
                <div className="features">
                    <div className="feature">💸 Track shared expenses</div>
                    <div className="feature">📊 Smart debt simplification</div>
                    <div className="feature">🤝 Settle debts instantly</div>
                </div>
            </div>

            {/* Login Card */}
            <div className="login-box column">
                <h2>Welcome!</h2>
                <p className="subtitle">Sign in to continue managing your finances.</p>

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <small className="error">{passwordError}</small>
                    </div>
                    <button type="submit">Sign In</button>
                </form>

                <div className="bottom-text">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')}>Register</span>
                </div>
            </div>
        </div>
    );
}
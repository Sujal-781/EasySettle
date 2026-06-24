import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ emailError: '', passwordError: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = () => {
        if (!formData.email) { setFormErrors(prev => ({ ...prev, emailError: 'Email is required' })); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setFormErrors(prev => ({ ...prev, emailError: 'Enter a valid email' })); return false; }
        setFormErrors(prev => ({ ...prev, emailError: '' })); return true;
    };

    const validatePassword = () => {
        if (!formData.password) { setFormErrors(prev => ({ ...prev, passwordError: 'Password is required' })); return false; }
        if (formData.password.length < 6) { setFormErrors(prev => ({ ...prev, passwordError: 'Password must be at least 6 characters' })); return false; }
        setFormErrors(prev => ({ ...prev, passwordError: '' })); return true;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateEmail() || !validatePassword()) return;
        setLoading(true);
        try {
            const response = await api.post('/users/login', { email: formData.email, password: formData.password });
            document.cookie = `authToken=${response.data.token}; HttpOnly; Secure; SameSite=Strict`;
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 401) {
                setFormErrors(prev => ({ ...prev, passwordError: 'Incorrect email or password' }));
            } else {
                setFormErrors(prev => ({ ...prev, emailError: 'Something went wrong. Try again.' }));
            }
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <small className="error">{formErrors.emailError}</small>
                    </div>
                    <div className="form-group">
                        <small>Password</small>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <small className="error">{formErrors.passwordError}</small>
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                </form>

                <div className="bottom-text">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')}>Register</span>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Dashboard.css'; // Assuming a CSS file for styles

export default function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // Changed to sessionStorage for security
    const userName = sessionStorage.getItem('userName'); // Changed to sessionStorage for security

    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        fetchGroups();
    }, [userId, navigate]);

    const fetchGroups = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/groups/user/${userId}`);
            setGroups(response.data);
        } catch (err) {
            setError('Failed to fetch groups');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            const response = await api.post('/groups', {
                name: newGroupName,
                createdBy: { id: userId }
            });
            await api.post(`/groups/${response.data.id}/members/${userId}`);
            setGroups(prevGroups => [...prevGroups, response.data]); // Update state directly
            setNewGroupName('');
            setIsModalVisible(false);
        } catch (err) {
            console.error('Failed to create group', err);
        }
    };

    return (
        <div className="dashboard">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {/* Navbar */}
            <div className="navbar">
                <h2 className="logo">EasySettle</h2>
                <div className="user-info">
                    <span className="greeting">Hey, {userName} 👋</span>
                    <button
                        onClick={() => { sessionStorage.clear(); navigate('/'); }}
                        className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h3>Your Groups</h3>
                    <button
                        onClick={() => setIsModalVisible(true)}
                        className="new-group-button">
                        + New Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div className="no-groups">
                        <div className="no-groups-icon">👥</div>
                        <p>No groups yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="groups-grid">
                        {groups.map(group => (
                            <div
                                key={group.id}
                                onClick={() => navigate(`/groups/${group.id}`)}
                                className="group-card"
                            >
                                <div className="group-icon">👥</div>
                                <h4>{group.name}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Dashboard.css'; // Assuming a CSS file for styles

export default function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (!userId) { 
            navigate('/'); 
            return; 
        }
        fetchGroups();
    }, [userId]); // Added userId as a dependency

    const fetchGroups = async () => {
        try {
            const response = await api.get(`/groups/user/${userId}`);
            setGroups(response.data);
        } catch (err) {
            console.error('Failed to fetch groups', err);
        }
    };

    const createGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            const response = await api.post('/groups', {
                name: newGroupName,
                createdBy: { id: userId }
            });
            // also add creator as member
            await api.post(`/groups/${response.data.id}/members/${userId}`);
            setNewGroupName('');
            setIsModalVisible(false);
            setGroups(prevGroups => [...prevGroups, response.data]); // Update state directly
        } catch (err) {
            console.error('Failed to create group', err);
        }
    };

    return (
        <div className="dashboard">
            {/* Navbar */}
            <div className="navbar">
                <h2 className="logo"> EasySettle</h2>
                <div className="user-info">
                    <span className="greeting">Hey, {userName} 👋</span>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/'); }}
                        className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h3 className="groups-title">Your Groups</h3>
                    <button
                        onClick={() => setIsModalVisible(true)}
                        className="new-group-button">
                        + New Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div className="no-groups">
                        <div className="no-groups-icon">👥</div>
                        <p className="no-groups-message">No groups yet. Create one to get started!</p>
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
                                <h4 className="group-name">{group.name}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
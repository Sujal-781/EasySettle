import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        fetchGroups();
    }, []);

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
            await api.post('/groups', {
                name: newGroupName,
                createdBy: { id: userId }
            });
            setNewGroupName('');
            setShowModal(false);
            fetchGroups();
        } catch (err) {
            console.error('Failed to create group', err);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            fontFamily: "'Poppins', sans-serif",
            color: 'white'
        }}>
            {/* Navbar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{ color: '#22c55e', margin: 0 }}>💸 EasySettle</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#94a3b8' }}>Hey, {userName} 👋</span>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }}
                        style={{
                            background: 'transparent', border: '1px solid #ef4444',
                            color: '#ef4444', padding: '8px 16px', borderRadius: '8px',
                            cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: 0, fontSize: '22px' }}>Your Groups</h3>
                    <button onClick={() => setShowModal(true)}
                        style={{
                            background: '#22c55e', color: 'white', border: 'none',
                            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: 600, fontSize: '15px'
                        }}>
                        + New Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', marginTop: '80px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                        <p style={{ fontSize: '18px' }}>No groups yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {groups.map(group => (
                            <div key={group.id}
                                onClick={() => navigate(`/groups/${group.id}`)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px', padding: '24px',
                                    cursor: 'pointer', transition: 'transform 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{group.name}</h4>
                                <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
                                    {group.members?.length || 0} members
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: '#1e293b', borderRadius: '16px', padding: '32px',
                        width: '400px', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>Create New Group</h3>
                        <input
                            type="text"
                            placeholder="Group name (e.g. Goa Trip)"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a',
                                color: 'white', fontSize: '15px', boxSizing: 'border-box',
                                fontFamily: 'inherit', outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                                    color: 'white', cursor: 'pointer', fontFamily: 'inherit'
                                }}>
                                Cancel
                            </button>
                            <button onClick={createGroup}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: 'none', background: '#22c55e',
                                    color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
                                }}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
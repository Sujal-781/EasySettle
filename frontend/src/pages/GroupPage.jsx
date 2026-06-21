import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function GroupPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [simplifiedDebts, setSimplifiedDebts] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showDebts, setShowDebts] = useState(false);
    const [expenseDesc, setExpenseDesc] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        fetchGroup();
        fetchExpenses();
        fetchBalances();
    }, []);

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (err) {
            console.error('Failed to fetch group', err);
        }
    };

    const fetchExpenses = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/list`);
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        }
    };

    const fetchBalances = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/balances`);
            setBalances(res.data);
        } catch (err) {
            console.error('Failed to fetch balances', err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await api.get('/users');
            setAllUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const addExpense = async () => {
        if (!expenseDesc || !expenseAmount) return;
        try {
            await api.post('/expenses/add', {
                group: { id: Number(id) },
                paidBy: { id: Number(userId) },
                amount: Number(expenseAmount),
                description: expenseDesc
            });
            setExpenseDesc('');
            setExpenseAmount('');
            setShowExpenseModal(false);
            fetchExpenses();
            fetchBalances();
        } catch (err) {
            console.error('Failed to add expense', err);
        }
    };

    const fetchSimplifiedDebts = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/simplify`);
            setSimplifiedDebts(res.data);
            setShowDebts(true);
        } catch (err) {
            console.error('Failed to simplify debts', err);
        }
    };

    const cardStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
    };

    const btnStyle = (color = '#22c55e') => ({
        background: color,
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: '14px',
        width: 'auto'
    });

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
                <h2 style={{ color: '#22c55e', margin: 0, cursor: 'pointer' }}
                    onClick={() => navigate('/dashboard')}>
                    💸 EasySettle
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>Hey, {userName} 👋</span>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }}
                        style={{
                            background: 'transparent', border: '1px solid #ef4444',
                            color: '#ef4444', padding: '8px 16px', borderRadius: '8px',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px'
                        }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <button onClick={() => navigate('/dashboard')}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', padding: 0, marginBottom: '8px' }}>
                            ← Back to Dashboard
                        </button>
                        <h2 style={{ margin: 0, fontSize: '28px' }}>👥 {group?.name || 'Loading...'}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button onClick={() => { fetchAllUsers(); setShowMemberModal(true); }} style={btnStyle('#8b5cf6')}>
                            + Add Member
                        </button>
                        <button onClick={() => setShowExpenseModal(true)} style={btnStyle()}>
                            + Add Expense
                        </button>
                        <button onClick={fetchSimplifiedDebts} style={btnStyle('#3b82f6')}>
                            🧮 Simplify Debts
                        </button>
                    </div>
                </div>

                {/* Balances */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>💰 Balances</h3>
                    {Object.keys(balances).length === 0 ? (
                        <p style={{ color: '#64748b', margin: 0 }}>All settled up!</p>
                    ) : (
                        Object.entries(balances).map(([uid, amount]) => (
                            <div key={uid} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '10px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <span style={{ color: '#94a3b8' }}>User {uid}</span>
                                <span style={{
                                    color: amount > 0 ? '#22c55e' : amount < 0 ? '#ef4444' : '#64748b',
                                    fontWeight: 600
                                }}>
                                    {amount > 0 ? `+₹${amount}` : amount < 0 ? `-₹${Math.abs(amount)}` : `₹0`}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Simplified Debts */}
                {showDebts && (
                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>🧮 Simplified Settlements</h3>
                        {simplifiedDebts.length === 0 ? (
                            <p style={{ color: '#64748b', margin: 0 }}>All settled up!</p>
                        ) : (
                            simplifiedDebts.map((debt, i) => (
                                <div key={i} style={{
                                    padding: '12px 16px', marginBottom: '8px',
                                    background: 'rgba(59,130,246,0.1)',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    borderRadius: '8px', color: '#93c5fd'
                                }}>
                                    {debt}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Expenses */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>📋 Expenses</h3>
                    {expenses.length === 0 ? (
                        <p style={{ color: '#64748b', margin: 0 }}>No expenses yet. Add one!</p>
                    ) : (
                        expenses.map(expense => (
                            <div key={expense.id} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '14px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{expense.description}</p>
                                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                                        Paid by User {expense.paidBy?.id}
                                    </p>
                                </div>
                                <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '18px' }}>
                                    ₹{expense.amount}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            {showMemberModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: '#1e293b', borderRadius: '16px', padding: '32px',
                        width: '400px', border: '1px solid rgba(255,255,255,0.1)',
                        maxHeight: '80vh', overflowY: 'auto'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>Add Member</h3>
                        {allUsers.length === 0 ? (
                            <p style={{ color: '#64748b' }}>No users found.</p>
                        ) : (
                            allUsers.map(user => (
                                <div key={user.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', padding: '12px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500 }}>{user.name}</p>
                                        <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '12px' }}>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.post(`/groups/${id}/members/${user.id}`);
                                                setShowMemberModal(false);
                                                fetchGroup();
                                            } catch (err) {
                                                console.error('Failed to add member', err);
                                            }
                                        }}
                                        style={{
                                            background: '#22c55e', color: 'white', border: 'none',
                                            padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                                            fontFamily: 'inherit', fontSize: '13px', width: 'auto'
                                        }}>
                                        Add
                                    </button>
                                </div>
                            ))
                        )}
                        <button onClick={() => setShowMemberModal(false)}
                            style={{
                                width: '100%', marginTop: '20px', padding: '12px',
                                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'transparent', color: 'white', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '15px'
                            }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Add Expense Modal */}
            {showExpenseModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: '#1e293b', borderRadius: '16px', padding: '32px',
                        width: '400px', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>Add Expense</h3>
                        <input
                            type="text"
                            placeholder="Description (e.g. Dinner)"
                            value={expenseDesc}
                            onChange={e => setExpenseDesc(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a',
                                color: 'white', fontSize: '15px', boxSizing: 'border-box',
                                fontFamily: 'inherit', outline: 'none', marginBottom: '12px'
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Amount (₹)"
                            value={expenseAmount}
                            onChange={e => setExpenseAmount(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a',
                                color: 'white', fontSize: '15px', boxSizing: 'border-box',
                                fontFamily: 'inherit', outline: 'none', marginBottom: '20px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowExpenseModal(false)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                                    color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px'
                                }}>
                                Cancel
                            </button>
                            <button onClick={addExpense}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: 'none', background: '#22c55e',
                                    color: 'white', cursor: 'pointer', fontFamily: 'inherit',
                                    fontWeight: 600, fontSize: '15px'
                                }}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
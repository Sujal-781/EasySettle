import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function GroupPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // Changed to sessionStorage for better security
    const userName = sessionStorage.getItem('userName'); // Changed to sessionStorage for better security

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [simplifiedDebts, setSimplifiedDebts] = useState([]);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // Renamed for clarity
    const [isDebtsVisible, setIsDebtsVisible] = useState(false); // Renamed for clarity
    const [expenseDescription, setExpenseDescription] = useState(''); // Renamed for clarity
    const [expenseAmount, setExpenseAmount] = useState('');
    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false); // Renamed for clarity
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState({});
    const [groupMemberIds, setGroupMemberIds] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        fetchGroup();
        fetchExpenses();
        fetchBalances();
        fetchUsers();
        fetchGroupMembers();
    }, [id, userId, navigate]); // Added dependencies to prevent unnecessary re-fetching

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (err) {
            setError('Failed to fetch group');
            console.error('Failed to fetch group', err);
        }
    };

    const fetchExpenses = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/list`);
            setExpenses(res.data);
        } catch (err) {
            setError('Failed to fetch expenses');
            console.error('Failed to fetch expenses', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            const userMap = {};
            res.data.forEach(u => userMap[u.id] = u.name);
            setUsers(userMap);
            setAllUsers(res.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Failed to fetch users', err);
        }
    };

    const fetchBalances = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/balances`);
            setBalances(res.data);
        } catch (err) {
            setError('Failed to fetch balances');
            console.error('Failed to fetch balances', err);
        }
    };

    const fetchGroupMembers = async () => {
        try {
            const res = await api.get(`/groups/${id}/members`);
            setGroupMemberIds(res.data.map(m => m.id));
        } catch (err) {
            setError('Failed to fetch group members');
            console.error('Failed to fetch group members', err);
        }
    };

    const addExpense = async () => {
        if (!expenseDescription || !expenseAmount || Number(expenseAmount) <= 0) return; // Added validation for positive amount
        try {
            await api.post('/expenses/add', {
                group: { id: Number(id) },
                paidBy: { id: Number(userId) },
                amount: Number(expenseAmount),
                description: expenseDescription
            });
            setExpenseDescription('');
            setExpenseAmount('');
            setIsExpenseModalVisible(false);
            fetchExpenses();
            fetchBalances();
        } catch (err) {
            setError('Failed to add expense');
            console.error('Failed to add expense', err);
        }
    };

    const fetchSimplifiedDebts = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/simplify`);
            setSimplifiedDebts(res.data);
            setIsDebtsVisible(true);
        } catch (err) {
            setError('Failed to simplify debts');
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
                    <button onClick={() => { sessionStorage.clear(); navigate('/'); }} // Changed to sessionStorage for better security
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
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
                            Back to Dashboard
                        </button>
                    </div>
                    <h1 style={{ color: '#22c55e' }}>{group?.name || 'Group'}</h1>
                    <button onClick={() => setIsMemberModalVisible(true)} style={btnStyle()}>
                        Add Member
                    </button>
                </div>

                {/* Error Handling */}
                {error && <div style={{ color: 'red' }}>{error}</div>}

                {/* Expenses List */}
                <div>
                    {expenses.map(expense => (
                        <div key={expense.id} style={cardStyle}>
                            <p>{expense.description}</p>
                            <p>Amount: ${expense.amount}</p>
                            <p>Paid by: {users[expense.paidBy?.id] || 'Unknown'}</p>
                        </div>
                    ))}
                </div>

                {/* Add Expense Button */}
                <button onClick={() => setIsExpenseModalVisible(true)} style={btnStyle()}>
                    Add Expense
                </button>

                {/* Loading State */}
                {loading && <div>Loading...</div>}
            </div>
        </div>
    );
}
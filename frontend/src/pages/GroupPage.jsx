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
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isDebtsVisible, setIsDebtsVisible] = useState(false);
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState({});
    const [groupMemberIds, setGroupMemberIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchGroup(),
                    fetchExpenses(),
                    fetchBalances(),
                    fetchUsers(),
                    fetchGroupMembers()
                ]);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId, navigate]);

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (err) {
            console.error('Failed to fetch group', err);
            setError('Failed to fetch group');
        }
    };

    const fetchExpenses = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/list`);
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
            setError('Failed to fetch expenses');
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
            console.error('Failed to fetch users', err);
            setError('Failed to fetch users');
        }
    };

    const fetchBalances = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/balances`);
            setBalances(res.data);
        } catch (err) {
            console.error('Failed to fetch balances', err);
            setError('Failed to fetch balances');
        }
    };

    const fetchGroupMembers = async () => {
        try {
            const res = await api.get(`/groups/${id}/members`);
            setGroupMemberIds(res.data.map(m => m.id));
        } catch (err) {
            console.error('Failed to fetch group members', err);
            setError('Failed to fetch group members');
        }
    };

    const addExpense = async () => {
        if (!expenseDescription || !expenseAmount || Number(expenseAmount) <= 0) return;
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
            await Promise.all([fetchExpenses(), fetchBalances()]);
        } catch (err) {
            console.error('Failed to add expense', err);
            setError('Failed to add expense');
        }
    };

    const fetchSimplifiedDebts = async () => {
        try {
            const res = await api.get(`/expenses/groups/${id}/simplify`);
            setSimplifiedDebts(res.data);
            setIsDebtsVisible(true);
        } catch (err) {
            console.error('Failed to simplify debts', err);
            setError('Failed to simplify debts');
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
                            Back to Dashboard
                        </button>
                    </div>
                    <h1>{group?.name || 'Group'}</h1>
                    <button onClick={() => setIsExpenseModalVisible(true)} style={btnStyle()}>
                        Add Expense
                    </button>
                </div>

                {/* Expenses List */}
                <div>
                    {expenses.map((expense, index) => (
                        <div key={expense.id} style={cardStyle}>
                            <p>{expense.description} - ${expense.amount} (Paid by: {users[expense.paidBy?.id] || 'Unknown'})</p>
                        </div>
                    ))}
                </div>

                {/* Modal for adding expense */}
                {isExpenseModalVisible && (
                    <div style={{ /* Modal styles here */ }}>
                        <h2>Add Expense</h2>
                        <input
                            type="text"
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <input
                            type="number"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <button onClick={addExpense} style={btnStyle()}>Submit</button>
                        <button onClick={() => setIsExpenseModalVisible(false)} style={btnStyle('#ef4444')}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
}
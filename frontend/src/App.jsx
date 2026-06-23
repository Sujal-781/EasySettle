import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupPage from './pages/GroupPage';
import NotFound from './pages/NotFound'; // Assuming a NotFound component is created

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/groups/:id" element={<GroupPage />} />
                <Route path="*" element={<NotFound />} /> {/* Default route for unmatched paths */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
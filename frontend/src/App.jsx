import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import AskQuestion from './pages/AskQuestion';
import MentorRegister from './pages/MentorRegister';
import MentorDirectory from './pages/MentorDirectory';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import Login from './pages/Login';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';

function Topbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <div className="brand-mark">🔵</div>
        Dr. B.R. Ambedkar Mentorship Portal
      </Link>
      <nav className="nav-links">
        <Link to="/ask">Get Guidance</Link>
        <Link to="/mentors">Find a Mentor</Link>
        <Link to="/about">About</Link>
        {token && role === 'mentor' && <Link to="/mentor/dashboard">Dashboard</Link>}
        {token && role === 'admin' && <Link to="/admin">Admin</Link>}
        {!token && <Link to="/mentor/register" className="nav-cta">Become a Mentor</Link>}
        {!token
          ? <Link to="/login" className="nav-admin">Login</Link>
          : <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', boxShadow: 'none', transform: 'none', fontWeight: 500 }}
            >
              Logout
            </button>
        }
      </nav>
    </header>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/mentor/register" element={<MentorRegister />} />
          <Route path="/mentors" element={<MentorDirectory />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/mentor/dashboard" element={<ProtectedRoute allowedRole="mentor"><MentorDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

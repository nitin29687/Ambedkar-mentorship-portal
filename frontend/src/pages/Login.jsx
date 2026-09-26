import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectRole = location.state?.role;
  const [mode, setMode] = useState(redirectRole === 'admin' ? 'admin' : 'mentor');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const endpoint = mode === 'admin' ? '/api/auth/admin/login' : '/api/auth/mentor/login';
      const response = await axios.post(endpoint, form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', mode);
      navigate(mode === 'admin' ? '/admin' : '/mentor/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = mode === 'admin';

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Card */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

          {/* Top band */}
          <div style={{ height: '6px', background: isAdmin ? 'var(--clr-accent)' : 'var(--clr-primary)' }} />

          <div style={{ padding: '2rem 2rem 2.5rem' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔵</div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clr-primary)', letterSpacing: '-0.02em' }}>
                Mentorship Portal
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Sign in to your account
              </p>
            </div>

            {/* Mode toggle */}
            <div style={{
              display: 'flex',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '1.5rem',
              gap: '4px',
            }}>
              {['mentor', 'admin'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setMessage(''); }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: 'none',
                    boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                    background: mode === m
                      ? (m === 'admin' ? 'var(--clr-accent)' : 'var(--clr-primary)')
                      : 'transparent',
                    color: mode === m ? '#fff' : 'var(--text-muted)',
                    transform: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {m === 'mentor' ? '🎓 Mentor' : '⚙️ Admin'}
                </button>
              ))}
            </div>

            {/* Admin hint */}
            {isAdmin && (
              <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radius-md)', padding: '0.8rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#92400e' }}>
                <strong>Default credentials:</strong><br />
                Email: <code style={{ background: '#fff', padding: '0 4px', borderRadius: '3px', fontSize: '0.8rem' }}>admin@yourdomain.com</code><br />
                Password: <code style={{ background: '#fff', padding: '0 4px', borderRadius: '3px', fontSize: '0.8rem' }}>admin123</code>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={isAdmin ? 'admin@yourdomain.com' : 'mentor@example.com'}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: isAdmin ? 'var(--clr-accent)' : 'var(--clr-primary)',
                  padding: '0.8rem',
                  fontSize: '0.95rem',
                  marginTop: '0.25rem',
                  width: '100%',
                }}
              >
                {loading ? 'Signing in…' : `Sign in as ${isAdmin ? 'Admin' : 'Mentor'} →`}
              </button>
            </form>

            {message && (
              <div className="notice notice-error" style={{ marginTop: '1rem' }}>
                {message}
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '1.25rem' }}>
          Want to volunteer?{' '}
          <a href="/mentor/register" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Register as a mentor</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

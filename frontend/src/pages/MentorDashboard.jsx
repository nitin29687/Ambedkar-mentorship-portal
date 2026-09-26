import { useEffect, useState } from 'react';
import axios from 'axios';

function MentorDashboard() {
  const [questions, setQuestions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [publicFlags, setPublicFlags] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  const loadAssignedQuestions = async () => {
    try {
      const response = await axios.get('/api/responses/assigned', { headers: getHeaders() });
      setQuestions(response.data);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to load assigned questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  useEffect(() => { loadAssignedQuestions(); }, []);

  const handleSubmit = async (questionId) => {
    const content = drafts[questionId]?.trim();
    if (!content) { showMessage('Please write a response before posting.', 'error'); return; }

    try {
      await axios.post('/api/responses', { questionId, content, isPublic: publicFlags[questionId] ?? true }, { headers: getHeaders() });
      showMessage('Response posted successfully.');
      setDrafts(prev => ({ ...prev, [questionId]: '' }));
      loadAssignedQuestions();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to post your response.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--clr-primary) 0%, #122a52 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Mentor Dashboard</h1>
          <p style={{ color: 'rgba(200,216,245,0.7)', fontSize: '0.875rem' }}>Review your assigned questions and share guidance with students.</p>
        </div>
      </div>

      <div className="page-wrap">
        {message && (
          <div className={`notice ${messageType === 'error' ? 'notice-error' : 'notice-success'}`} style={{ marginBottom: '1.25rem' }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
            <p>Loading assigned questions…</p>
          </div>
        ) : questions.length === 0 ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'var(--clr-primary)', marginBottom: '0.5rem' }}>No questions yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              You'll receive questions here once an admin assigns them to you based on your expertise.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map(question => (
              <div key={question.id} className="panel" style={{ borderLeft: '4px solid var(--clr-primary)' }}>
                {/* Student info */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <div className="avatar avatar-lg" style={{ background: 'var(--clr-primary)' }}>
                    {question.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.25rem' }}>{question.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      {question.place}, {question.district}, {question.state}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <span>✉️</span> <strong>{question.email}</strong>
                      </span>
                      {question.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                          <span>📱</span> <strong>{question.phone}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`badge status-${question.status}`}>{question.status}</span>
                </div>

                {/* Question text */}
                <div style={{ background: 'var(--clr-primary-faint)', borderRadius: 'var(--radius-md)', padding: '1rem 1.1rem', marginBottom: '1.5rem', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.4rem' }}>Student's Question</div>
                  <p style={{ lineHeight: 1.75, color: 'var(--text)', fontSize: '0.9rem' }}>{question.question}</p>
                </div>

                {/* Previous responses */}
                {question.responses && question.responses.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Your Previous Responses ({question.responses.length})
                    </div>
                    {question.responses.map((r, i) => (
                      <div key={i} style={{ background: '#f8faff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '0.5rem', fontSize: '0.875rem', lineHeight: 1.65 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                          <span className={`badge ${r.isPublic ? 'badge-green' : 'badge-gray'}`}>{r.isPublic ? 'Public' : 'Private'}</span>
                        </div>
                        {r.content}
                      </div>
                    ))}
                  </div>
                )}

                {/* Response form */}
                <div>
                  <label style={{ marginBottom: '0.75rem' }}>
                    Write Your Response
                    <textarea
                      rows={5}
                      value={drafts[question.id] || ''}
                      onChange={e => setDrafts(prev => ({ ...prev, [question.id]: e.target.value }))}
                      placeholder="Provide clear, actionable guidance. You can also reach out directly using the contact details above."
                      style={{ marginTop: '0.5rem' }}
                    />
                  </label>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', fontWeight: 400, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={publicFlags[question.id] ?? true}
                        onChange={e => setPublicFlags(prev => ({ ...prev, [question.id]: e.target.checked }))}
                        style={{ width: 'auto', cursor: 'pointer' }}
                      />
                      Share this response publicly (visible on the portal)
                    </label>
                    <button onClick={() => handleSubmit(question.id)} style={{ background: 'var(--clr-accent)' }}>
                      Post Response →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          This portal is a tribute to <strong>Dr. B.R. Ambedkar</strong> (1891–1956) —
          architect of the Indian Constitution and champion of social justice.
        </div>
      </footer>
    </div>
  );
}

export default MentorDashboard;

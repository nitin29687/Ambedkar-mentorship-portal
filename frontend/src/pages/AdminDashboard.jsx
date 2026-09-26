import { useEffect, useState } from 'react';
import axios from 'axios';

const TAB = { QUESTIONS: 'questions', PENDING: 'pending', ALL_MENTORS: 'all_mentors' };

function StatusBadge({ status }) {
  const cls = `badge status-${status}`;
  return <span className={cls}>{status}</span>;
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value || '—'}</div>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState(TAB.QUESTIONS);
  const [questions, setQuestions] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [expandedMentor, setExpandedMentor] = useState(null);
  const [assignMap, setAssignMap] = useState({});

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const notify = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  };

  const fetchData = () => {
    axios.get('/api/admin/questions', { headers: authHeader }).then(r => setQuestions(r.data)).catch(() => {});
    axios.get('/api/admin/mentors/pending', { headers: authHeader }).then(r => setPendingMentors(r.data)).catch(() => {});
    axios.get('/api/admin/mentors/all', { headers: authHeader }).then(r => setAllMentors(r.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const approveMentor = async (id) => {
    await axios.post(`/api/admin/mentors/${id}/approve`, {}, { headers: authHeader });
    notify('Mentor approved.');
    fetchData();
  };

  const disapproveMentor = async (id) => {
    await axios.post(`/api/admin/mentors/${id}/disapprove`, {}, { headers: authHeader });
    notify('Mentor disapproved.');
    fetchData();
  };

  const deleteMentor = async (id) => {
    if (!window.confirm('Permanently delete this mentor? This cannot be undone.')) return;
    await axios.delete(`/api/admin/mentors/${id}`, { headers: authHeader });
    notify('Mentor deleted.');
    setExpandedMentor(null);
    fetchData();
  };

  const assignQuestion = async (questionId) => {
    const mentorId = assignMap[questionId];
    if (!mentorId) return notify('Please select a mentor first.', 'error');
    await axios.post(`/api/admin/questions/${questionId}/assign`, { mentorId }, { headers: authHeader });
    notify('Question assigned to mentor.');
    fetchData();
  };

  const approvedMentors = allMentors.filter(m => m.isApproved);

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--clr-primary) 0%, #122a52 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'rgba(200,216,245,0.7)', fontSize: '0.875rem' }}>Manage questions, mentors, and approvals</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{questions.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.1rem' }}>Questions</div>
            </div>
            <div style={{ background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--clr-accent)' }}>{pendingMentors.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.1rem' }}>Pending</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap">
        {/* Notification */}
        {message && (
          <div className={`notice ${messageType === 'error' ? 'notice-error' : 'notice-success'}`} style={{ marginBottom: '1.25rem' }}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar">
          <button className={tab === TAB.QUESTIONS ? 'active' : ''} onClick={() => setTab(TAB.QUESTIONS)}>
            Questions <span className="badge badge-blue" style={{ marginLeft: '0.4rem' }}>{questions.length}</span>
          </button>
          <button className={tab === TAB.PENDING ? 'active' : ''} onClick={() => setTab(TAB.PENDING)}>
            Pending Approvals
            {pendingMentors.length > 0 && <span className="badge badge-orange" style={{ marginLeft: '0.4rem' }}>{pendingMentors.length}</span>}
          </button>
          <button className={tab === TAB.ALL_MENTORS ? 'active' : ''} onClick={() => setTab(TAB.ALL_MENTORS)}>
            All Mentors <span className="badge badge-gray" style={{ marginLeft: '0.4rem' }}>{allMentors.length}</span>
          </button>
        </div>

        {/* ── Questions Tab ── */}
        {tab === TAB.QUESTIONS && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Click a row to see full contact details. All information is private — never shown publicly.
            </p>
            {questions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📬</div>
                <p>No questions yet.</p>
              </div>
            )}
            {questions.map(q => (
              <div key={q.id} className="expand-row">
                <div
                  className="expand-row-header"
                  onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  style={{ background: expandedQuestion === q.id ? 'var(--clr-primary-faint)' : undefined }}
                >
                  <StatusBadge status={q.status} />
                  <strong style={{ color: 'var(--clr-primary)', minWidth: '120px', fontSize: '0.9rem' }}>{q.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{q.state}</span>
                  {q.category && <span className="badge badge-blue">{q.category}</span>}
                  <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{expandedQuestion === q.id ? '▲' : '▼'}</span>
                </div>

                {expandedQuestion === q.id && (
                  <div className="expand-row-body">
                    <div className="detail-grid">
                      <DetailItem label="Email" value={q.email} />
                      <DetailItem label="Phone" value={q.phone} />
                      <DetailItem label="Village / Town" value={q.place} />
                      <DetailItem label="District" value={q.district} />
                      <DetailItem label="State" value={q.state} />
                      <DetailItem label="Submitted" value={new Date(q.createdAt).toLocaleDateString('en-IN')} />
                    </div>

                    <div className="info-box">
                      <div className="info-label">Full Question</div>
                      <p style={{ lineHeight: 1.75, color: 'var(--text)', fontSize: '0.9rem' }}>{q.question}</p>
                    </div>

                    {q.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          value={assignMap[q.id] || ''}
                          onChange={e => setAssignMap({ ...assignMap, [q.id]: e.target.value })}
                          style={{ flex: 1, minWidth: '220px' }}
                        >
                          <option value="">— Assign to mentor —</option>
                          {approvedMentors.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.expertiseLabel})</option>
                          ))}
                        </select>
                        <button onClick={() => assignQuestion(q.id)}>
                          Assign →
                        </button>
                      </div>
                    )}

                    {q.assignedTo && (
                      <p style={{ color: 'var(--clr-success)', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.75rem' }}>
                        ✓ Assigned to: {q.assignedTo.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Pending Approvals Tab ── */}
        {tab === TAB.PENDING && (
          <div>
            {pendingMentors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <p>No pending mentor approvals.</p>
              </div>
            )}
            {pendingMentors.map(m => (
              <div key={m.id} className="expand-row">
                <div
                  className="expand-row-header"
                  onClick={() => setExpandedMentor(expandedMentor === m.id ? null : m.id)}
                  style={{ background: expandedMentor === m.id ? 'var(--clr-primary-faint)' : undefined }}
                >
                  <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: 'var(--clr-primary)', fontSize: '0.9rem' }}>{m.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.6rem' }}>{m.email}</span>
                  </div>
                  <span className="badge badge-orange">Pending</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{expandedMentor === m.id ? '▲' : '▼'}</span>
                </div>

                {expandedMentor === m.id && (
                  <div className="expand-row-body">
                    <div className="detail-grid">
                      <DetailItem label="Email" value={m.email} />
                      <DetailItem label="Experience" value={m.experience} />
                      <DetailItem label="Expertise" value={m.expertiseLabel} />
                      <DetailItem label="Registered" value={new Date(m.createdAt).toLocaleDateString('en-IN')} />
                    </div>
                    <div className="info-box">
                      <div className="info-label">Education</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{m.education}</p>
                    </div>
                    {m.bio && (
                      <div className="info-box">
                        <div className="info-label">Bio</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{m.bio}</p>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button className="btn-success" onClick={() => approveMentor(m.id)}>✓ Approve</button>
                      <button className="btn-danger" onClick={() => deleteMentor(m.id)}>✕ Reject & Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── All Mentors Tab ── */}
        {tab === TAB.ALL_MENTORS && (
          <div>
            {allMentors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎓</div>
                <p>No mentors registered yet.</p>
              </div>
            )}
            {allMentors.map(m => (
              <div key={m.id} className="expand-row">
                <div
                  className="expand-row-header"
                  onClick={() => setExpandedMentor(expandedMentor === m.id ? null : m.id)}
                  style={{ background: expandedMentor === m.id ? 'var(--clr-primary-faint)' : undefined }}
                >
                  <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', background: m.isApproved ? 'var(--clr-primary)' : '#94a3b8' }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: 'var(--clr-primary)', fontSize: '0.9rem' }}>{m.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.6rem' }}>{m.email}</span>
                  </div>
                  <span className={`badge ${m.isApproved ? 'badge-green' : 'badge-orange'}`}>{m.isApproved ? 'Active' : 'Pending'}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.expertiseLabel}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{expandedMentor === m.id ? '▲' : '▼'}</span>
                </div>

                {expandedMentor === m.id && (
                  <div className="expand-row-body">
                    <div className="detail-grid">
                      <DetailItem label="Email" value={m.email} />
                      <DetailItem label="Experience" value={m.experience} />
                      <DetailItem label="Expertise" value={m.expertiseLabel} />
                      <DetailItem label="Status" value={m.isApproved ? 'Active' : 'Pending'} />
                      <DetailItem label="Registered" value={new Date(m.createdAt).toLocaleDateString('en-IN')} />
                    </div>
                    <div className="info-box">
                      <div className="info-label">Education</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{m.education}</p>
                    </div>
                    {m.bio && (
                      <div className="info-box">
                        <div className="info-label">Bio</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{m.bio}</p>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {m.isApproved
                        ? <button onClick={() => disapproveMentor(m.id)} style={{ background: '#d97706' }}>Disapprove</button>
                        : <button className="btn-success" onClick={() => approveMentor(m.id)}>✓ Approve</button>
                      }
                      <button className="btn-danger" onClick={() => deleteMentor(m.id)}>Delete Permanently</button>
                    </div>
                  </div>
                )}
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

export default AdminDashboard;

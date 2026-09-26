import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const QUOTES = [
  { text: "I measure the progress of a community by the degree of progress which women have achieved.", author: "Dr. B.R. Ambedkar" },
  { text: "Education is the milk of a lioness. Whoever drinks it will roar.", author: "Dr. B.R. Ambedkar" },
  { text: "Life should be great rather than long.", author: "Dr. B.R. Ambedkar" },
  { text: "Be educated, be organised, be agitated.", author: "Dr. B.R. Ambedkar" },
  { text: "Cultivation of mind should be the ultimate aim of human existence.", author: "Dr. B.R. Ambedkar" },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '✍️', title: 'Submit Your Question', desc: 'Describe your situation — education path, exam prep, career doubt, or rights issue. No cost, no sign-up required.' },
  { step: '02', icon: '🔍', title: 'Expert Matches You', desc: 'Our admin team reviews and assigns your question to a volunteer mentor with the right expertise.' },
  { step: '03', icon: '💬', title: 'Receive Personal Guidance', desc: 'Your mentor responds with tailored advice and shares their contact for a deeper conversation.' },
];

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Home() {
  const [questions, setQuestions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    axios.get('/api/questions').then(res => setQuestions(res.data)).catch(() => {});
    axios.get('/api/mentors').then(res => setMentors(res.data)).catch(() => {});

    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => { setQuoteIdx(i => (i + 1) % QUOTES.length); setQuoteVisible(true); }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = questions.length;
  const answered = questions.filter(q => q.status === 'RESPONDED' || q.status === 'CLOSED').length;
  const pending = questions.filter(q => q.status === 'PENDING').length;
  const totalMentors = mentors.length;
  const quote = QUOTES[quoteIdx];

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(140deg, var(--clr-primary) 0%, #0d2552 55%, #1a1a5e 100%)',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', border: '80px solid rgba(255,153,51,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', border: '60px solid rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '4rem 2rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {/* Portrait */}
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{
              width: '170px',
              height: '210px',
              borderRadius: '16px',
              border: '3px solid var(--clr-accent)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 0 0 6px rgba(255,153,51,0.15)',
              overflow: 'hidden',
              background: '#0d2347',
            }}>
              <img
                src="/ambedkar-home-photo.jpg"
                alt="Dr. B.R. Ambedkar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
              Dr. B.R. Ambedkar · 1891 – 1956
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,153,51,0.15)',
              border: '1px solid rgba(255,153,51,0.35)',
              borderRadius: '100px',
              padding: '0.3rem 0.9rem',
              fontSize: '0.78rem',
              color: 'var(--clr-accent)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}>
              🔵 A tribute to Babasaheb Ambedkar
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', lineHeight: 1.18, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Free Mentorship for<br />
              <span style={{ color: 'var(--clr-accent)' }}>Every Student,</span> Everywhere
            </h1>

            <p style={{ color: 'rgba(200,216,245,0.9)', lineHeight: 1.75, fontSize: '1rem', marginBottom: '2rem', maxWidth: '520px' }}>
              Connecting rural, SC/ST, and backward-class students with volunteer mentors
              across education, careers, competitive exams, and legal rights — completely free, always.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link to="/ask">
                <button style={{ background: 'var(--clr-accent)', color: '#fff', padding: '0.8rem 1.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', boxShadow: 'var(--shadow-accent)', border: 'none' }}>
                  Get Guidance →
                </button>
              </Link>
              <Link to="/mentor/register">
                <button style={{ background: 'transparent', color: '#fff', padding: '0.8rem 1.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.35)', boxShadow: 'none' }}>
                  Become a Mentor
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rotating Quote ── */}
      <section style={{ background: 'var(--clr-accent-light)', borderTop: '3px solid var(--clr-accent)', padding: '1.75rem 2rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--clr-accent)', lineHeight: 1, marginBottom: '0.75rem', opacity: 0.6 }}>"</div>
          <p style={{
            fontSize: '1.08rem',
            fontStyle: 'italic',
            color: '#2d1a00',
            lineHeight: 1.7,
            fontWeight: 500,
            transition: 'opacity 0.4s',
            opacity: quoteVisible ? 1 : 0,
            minHeight: '2.5rem',
          }}>
            {quote.text}
          </p>
          <p style={{ color: 'var(--clr-accent-dark)', fontWeight: 700, marginTop: '0.6rem', fontSize: '0.875rem', letterSpacing: '0.03em', opacity: quoteVisible ? 1 : 0, transition: 'opacity 0.4s' }}>
            — {quote.author}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: 'var(--clr-primary-faint)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-primary)', letterSpacing: '-0.02em' }}>Impact at a Glance</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.9rem' }}>Live data from our mentorship community</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatCard label="Questions Received" value={totalQuestions} color="var(--clr-primary)" icon="📬" />
            <StatCard label="Answered" value={answered} color="var(--clr-success)" icon="✅" />
            <StatCard label="Awaiting Mentor" value={pending} color="var(--clr-accent-dark)" icon="⏳" />
            <StatCard label="Active Mentors" value={totalMentors} color="#7c3aed" icon="🎓" />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-primary)', letterSpacing: '-0.02em' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>Simple, transparent, and completely free</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  fontSize: '3rem', fontWeight: 900, color: 'var(--clr-primary-faint)',
                  lineHeight: 1, userSelect: 'none',
                }}>{step.step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{step.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Q + Mentor Spotlight ── */}
      <section style={{ background: 'var(--clr-primary-faint)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>

          {/* Recent Questions */}
          <div className="panel">
            <div className="section-header">
              <h3>Recent Questions</h3>
              <Link to="/ask" style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 600 }}>Ask yours →</Link>
            </div>
            {questions.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No questions yet. Be the first to ask!</p>
              : questions.slice(0, 5).map(q => (
                <div key={q.id} style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{q.name}</span>
                    {q.category && (
                      <span className="badge badge-blue" style={{ flexShrink: 0 }}>{q.category}</span>
                    )}
                  </div>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.55 }}>
                    {q.question.length > 115 ? q.question.slice(0, 115) + '…' : q.question}
                  </p>
                </div>
              ))
            }
          </div>

          {/* Mentor Spotlight */}
          <div className="panel">
            <div className="section-header">
              <h3>Mentor Spotlight</h3>
              <Link to="/mentors" style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 600 }}>View all →</Link>
            </div>
            {mentors.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No approved mentors yet.</p>
              : mentors.slice(0, 4).map(m => (
                <div key={m.id} style={{ display: 'flex', gap: '0.85rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                  <div className="avatar" style={{ background: `hsl(${m.id * 47}, 55%, 38%)` }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--clr-primary)' }}>{m.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-accent-dark)', fontWeight: 600, marginTop: '0.1rem' }}>{m.expertiseLabel}</div>
                    {m.bio && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                        {m.bio.length > 80 ? m.bio.slice(0, 80) + '…' : m.bio}
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: 'var(--clr-primary)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Are you a professional who wants to give back?
          </h2>
          <p style={{ color: 'rgba(200,216,245,0.85)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
            Join our volunteer mentor network. A few hours of your expertise can change the course of a student's life.
          </p>
          <Link to="/mentor/register">
            <button style={{ background: 'var(--clr-accent)', color: '#fff', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', boxShadow: 'var(--shadow-accent)', border: 'none' }}>
              Register as a Mentor →
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔵</div>
          This portal is a tribute to <strong>Dr. B.R. Ambedkar</strong> (1891–1956) —<br />
          architect of the Indian Constitution and champion of social justice.
        </div>
      </footer>
    </div>
  );
}

export default Home;

import { Link } from 'react-router-dom';

const WHAT_WE_DO = [
  { icon: '🎓', title: 'Free Mentorship', desc: 'Connect students from rural and SC/ST communities with volunteer mentors — completely free, no strings attached.' },
  { icon: '📋', title: 'Wide Coverage', desc: 'UPSC, NEET, JEE, Law, Scholarships, Government Schemes, Legal Rights, Agriculture — we cover every path.' },
  { icon: '🔒', title: 'Private & Safe', desc: 'Student contact details are kept private and shared only with the assigned mentor. No public exposure of personal data.' },
  { icon: '🌐', title: 'Nationwide', desc: 'Students from any state can submit questions and receive guidance from mentors who understand their context.' },
];

const TEAM_ROLES = ['Engineers', 'Civil Servants', 'Lawyers', 'Educators', 'Doctors', 'Advocates'];

function About() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(140deg, var(--clr-primary) 0%, #0d2552 55%, #1a1a5e 100%)', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '340px', height: '340px', border: '70px solid rgba(255,153,51,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔵</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            About This Portal
          </h1>
          <p style={{ color: 'rgba(200,216,245,0.85)', lineHeight: 1.75, fontSize: '1rem' }}>
            A free, community-driven mentorship platform built as a tribute to Dr. B.R. Ambedkar —
            architect of the Indian Constitution and a lifelong champion of social justice and education.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="page-wrap" style={{ maxWidth: '880px' }}>

        {/* Our Initiative */}
        <div className="panel" style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ color: 'var(--clr-primary)', marginBottom: '1.25rem', fontSize: '1.3rem', fontWeight: 800 }}>Our Initiative</h2>
          <p style={{ lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            This portal was conceived and built by students and alumni from <strong style={{ color: 'var(--text)' }}>IIMs, IITs, and NITs</strong> across India —
            individuals who believe that the privilege of a premier education carries with it a responsibility to give back.
          </p>
          <p style={{ lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Inspired by Dr. Ambedkar's belief that <em>"Education is the milk of a lioness — whoever drinks it will roar,"</em>{' '}
            we set out to build a bridge between India's most talented volunteers and its most underserved students.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
            {TEAM_ROLES.map(role => (
              <span key={role} className="badge badge-blue">{role}</span>
            ))}
          </div>
        </div>

        {/* Tribute */}
        <div style={{ background: 'var(--clr-accent-light)', border: '2px solid var(--clr-accent)', borderRadius: 'var(--radius-xl)', padding: '2rem 2.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '80px', height: '100px', borderRadius: '10px', border: '2px solid var(--clr-accent)', overflow: 'hidden', background: '#0d2347' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bhimrao_Ambedkar.jpg/400px-Bhimrao_Ambedkar.jpg"
                  alt="Dr. B.R. Ambedkar"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#7a4000', textAlign: 'center', marginTop: '0.35rem', fontWeight: 600 }}>1891 – 1956</div>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{ color: 'var(--clr-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 800 }}>A Tribute to Babasaheb</h2>
              <p style={{ lineHeight: 1.85, color: '#5a3000', marginBottom: '0.85rem', fontSize: '0.9rem' }}>
                Dr. Bhimrao Ramji Ambedkar (1891–1956) was born into a family considered "untouchable" under the caste system.
                Despite facing severe discrimination, he earned doctorates from Columbia University and the London School of Economics.
              </p>
              <p style={{ lineHeight: 1.85, color: '#5a3000', marginBottom: '0.85rem', fontSize: '0.9rem' }}>
                He drafted the Constitution of India, fought for the rights of Dalits and backward communities, and devoted
                his life to proving that education and equal opportunity could transform society.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--clr-accent)', margin: '1rem 0 0', paddingLeft: '1rem', fontStyle: 'italic', color: '#3d2000', fontSize: '0.9rem' }}>
                "Cultivation of mind should be the ultimate aim of human existence."
                <br /><strong style={{ color: 'var(--clr-primary)', fontStyle: 'normal' }}>— Dr. B.R. Ambedkar</strong>
              </blockquote>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="panel" style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ color: 'var(--clr-primary)', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 800 }}>What We Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {WHAT_WE_DO.map(item => (
              <div key={item.title} style={{ background: 'var(--clr-primary-faint)', border: '1px solid #dbeafe', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{item.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Get Involved */}
        <div style={{ background: 'var(--clr-primary)', borderRadius: 'var(--radius-xl)', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>Get Involved</h2>
          <p style={{ color: 'rgba(200,216,245,0.85)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Are you a professional who shares Ambedkar's vision? Join us as a mentor, spread the word, or reach out to collaborate.
            All mentors give their time freely.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/mentor/register">
              <button style={{ background: 'var(--clr-accent)', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 700, boxShadow: 'var(--shadow-accent)' }}>
                Become a Mentor →
              </button>
            </Link>
            <Link to="/ask">
              <button style={{ background: 'transparent', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.35)', boxShadow: 'none' }}>
                Ask a Question
              </button>
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1.25rem', fontStyle: 'italic' }}>
            "Be educated, be organised, be agitated." — Dr. B.R. Ambedkar
          </p>
        </div>

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

export default About;

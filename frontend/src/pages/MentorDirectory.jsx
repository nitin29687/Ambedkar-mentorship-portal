import { useEffect, useState } from 'react';
import axios from 'axios';
import { expertiseList } from '../data/expertiseList';

const CATEGORY_COLORS = ['#1a3a6b', '#7c3aed', '#16a34a', '#dc2626', '#0891b2', '#d97706', '#be185d', '#059669'];

function MentorCard({ mentor, colorIdx }) {
  const color = CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length];
  const initials = mentor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Card top band */}
      <div style={{ height: '6px', background: color, borderRadius: '12px 12px 0 0', margin: '-1.5rem -1.5rem 1.25rem', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} />

      {/* Avatar + name */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        {mentor.photo ? (
          <img
            src={mentor.photo}
            alt={mentor.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${color}22`, flexShrink: 0 }}
          />
        ) : (
          <div className="avatar avatar-lg" style={{ background: color }}>
            {initials}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--clr-primary)' }}>{mentor.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>⏱</span> {mentor.experience}
          </div>
        </div>
      </div>

      {/* Expertise chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
        {(mentor.expertiseLabel || '').split(',').map((label, i) => (
          <span key={i} className="chip" style={{ background: `${color}18`, color, fontSize: '0.75rem' }}>
            {label.trim()}
          </span>
        ))}
      </div>

      {/* Education */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
        <span style={{ flexShrink: 0 }}>🎓</span>
        <span>{mentor.education}</span>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
          {mentor.bio.length > 120 ? mentor.bio.slice(0, 120) + '…' : mentor.bio}
        </p>
      )}
    </div>
  );
}

function MentorDirectory() {
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('/api/mentors').then(res => setMentors(res.data)).catch(() => {});
  }, []);

  const categories = ['All', ...expertiseList.map(e => e.label)];

  const filtered = filter && filter !== 'All'
    ? mentors.filter(m => {
        const cat = expertiseList.find(e => e.label === filter);
        return cat && m.expertisePath?.startsWith(cat.value);
      })
    : mentors;

  return (
    <div>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, var(--clr-primary) 0%, #122a52 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Find a Mentor</h1>
          <p style={{ color: 'rgba(200,216,245,0.8)', fontSize: '1rem' }}>
            {mentors.length} volunteer mentor{mentors.length !== 1 ? 's' : ''} ready to guide you
          </p>
        </div>
      </div>

      <div className="page-wrap">
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.3rem 0.2rem', alignSelf: 'center', whiteSpace: 'nowrap' }}>Filter by area:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat === 'All' ? '' : cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: (filter === cat || (cat === 'All' && !filter)) ? 'var(--clr-primary)' : 'var(--clr-primary-faint)',
                color: (filter === cat || (cat === 'All' && !filter)) ? '#fff' : 'var(--clr-primary)',
                border: 'none',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'var(--clr-primary)', marginBottom: '0.5rem' }}>No mentors found</h3>
            <p>Try a different filter or check back later.</p>
          </div>
        ) : (
          <div className="card-list">
            {filtered.map((mentor, i) => (
              <MentorCard key={mentor.id} mentor={mentor} colorIdx={i} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          This portal is a tribute to <strong>Dr. B.R. Ambedkar</strong> (1891–1956) —
          architect of the Indian Constitution and champion of social justice.
        </div>
      </footer>
    </div>
  );
}

export default MentorDirectory;

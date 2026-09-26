import { useState } from 'react';
import axios from 'axios';
import { expertiseList } from '../data/expertiseList';

function MentorRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    education: '', experience: '', bio: '',
  });
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [expertiseItems, setExpertiseItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const parentCategory = expertiseList.find(e => e.value === selectedParent);
  const subCategories = parentCategory?.children || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExpertise = (parentVal, subVal) => {
    const pVal = parentVal ?? selectedParent;
    const sVal = subVal ?? selectedSub;
    if (!pVal || !sVal) return;
    const parent = expertiseList.find(e => e.value === pVal);
    const sub = parent?.children.find(s => s.value === sVal);
    const path = `${pVal}.${sVal}`;
    if (!sub || expertiseItems.find(e => e.path === path)) return;
    setExpertiseItems(prev => [...prev, { path, label: sub.label }]);
    setSelectedParent('');
    setSelectedSub('');
  };

  const handleSubChange = (e) => {
    const subVal = e.target.value;
    setSelectedSub(subVal);
    if (subVal) addExpertise(selectedParent, subVal);
  };

  const removeExpertise = (path) => setExpertiseItems(expertiseItems.filter(e => e.path !== path));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expertiseItems.length === 0) {
      setIsError(true);
      setMessage('Please add at least one area of expertise.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('expertisePath', expertiseItems.map(e => e.path).join('|'));
    data.append('expertiseLabel', expertiseItems.map(e => e.label).join(', '));
    if (photo) data.append('photo', photo);

    try {
      await axios.post('/api/auth/mentor/register', data);
      setIsError(false);
      setSuccess(true);
      setMessage('Your profile is under review. Admin will approve shortly.');
      setForm({ name: '', email: '', password: '', education: '', experience: '', bio: '' });
      setExpertiseItems([]);
      setPhoto(null);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, var(--clr-primary) 0%, #122a52 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Become a Mentor</h1>
          <p style={{ color: 'rgba(200,216,245,0.8)' }}>
            Join our volunteer network and help students from underserved communities find their path.
          </p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth: '780px' }}>
        {success ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: 'var(--clr-primary)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Registration Submitted!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 2rem' }}>
              Thank you for volunteering your expertise. Our admin team will review your profile
              and you'll be notified once approved.
            </p>
            <button onClick={() => setSuccess(false)} className="btn-outline">Register another mentor</button>
          </div>
        ) : (
          <div className="panel">
            {/* Value proposition */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: '🆓', text: '100% volunteer, no payment' },
                { icon: '⏱', text: 'Flexible — your own time' },
                { icon: '🌍', text: 'Help students across India' },
              ].map(item => (
                <div key={item.text} style={{ background: 'var(--clr-primary-faint)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--clr-primary)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                  <span style={{ fontWeight: 600 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="form-grid">

              <label>
                Full Name <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Dr. / Mr. / Ms. Your Name" />
              </label>

              <label>
                Email <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
              </label>

              <label>
                Password <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 8 characters" minLength={8} />
              </label>

              <label>
                Profile Photo
                <input type="file" accept="image/png,image/jpeg" onChange={e => setPhoto(e.target.files[0])} />
                <small>JPG or PNG, max 2 MB</small>
              </label>

              <label style={{ gridColumn: '1 / -1' }}>
                Education Background <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <textarea name="education" value={form.education} onChange={handleChange} required rows={3}
                  placeholder="e.g. M.A. Political Science, Delhi University — IAS officer (2012 batch)" />
              </label>

              <label>
                Years of Experience <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input name="experience" value={form.experience} onChange={handleChange} required placeholder="e.g. 5 years" />
              </label>

              {/* Expertise section */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
                  Areas of Expertise <span style={{ color: 'var(--clr-danger)' }}>*</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.4rem' }}>Select a topic to auto-add · you can add multiple</span>
                </div>

                {expertiseItems.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    {expertiseItems.map(item => (
                      <span key={item.path} className="chip">
                        {item.label}
                        <button type="button" onClick={() => removeExpertise(item.path)}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
                  <select value={selectedParent} onChange={e => { setSelectedParent(e.target.value); setSelectedSub(''); }}>
                    <option value="">— Select Area —</option>
                    {expertiseList.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                  <select value={selectedSub} onChange={handleSubChange} disabled={!selectedParent}>
                    <option value="">— Select Topic (auto-adds) —</option>
                    {subCategories.map(sub => <option key={sub.value} value={sub.value}>{sub.label}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => addExpertise()}
                    disabled={!selectedParent || !selectedSub}
                    style={{ whiteSpace: 'nowrap', padding: '0.65rem 1rem' }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              <label style={{ gridColumn: '1 / -1' }}>
                Short Bio
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  placeholder="Tell students about yourself, your journey, and how you can help them." />
              </label>

              <button type="submit" disabled={submitting} style={{ gridColumn: '1 / -1', background: 'var(--clr-accent)', padding: '0.85rem', fontSize: '0.95rem' }}>
                {submitting ? 'Submitting…' : 'Register as Mentor →'}
              </button>
            </form>

            {message && !success && (
              <div className={`notice ${isError ? 'notice-error' : 'notice-success'}`} style={{ marginTop: '1.25rem' }}>
                {message}
              </div>
            )}
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

export default MentorRegister;

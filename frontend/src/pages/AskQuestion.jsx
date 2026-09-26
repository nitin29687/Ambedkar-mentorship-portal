import { useState } from 'react';
import axios from 'axios';
import { expertiseList } from '../data/expertiseList';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

function AskQuestion() {
  const [form, setForm] = useState({
    name: '', place: '', district: '', state: '',
    email: '', phone: '', question: '', category: '',
  });
  const [selectedParent, setSelectedParent] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const parentCategory = expertiseList.find(e => e.value === selectedParent);
  const subCategories = parentCategory?.children || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleParentChange = (e) => { setSelectedParent(e.target.value); setForm({ ...form, category: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await axios.post('/api/questions', form);
      setIsError(false);
      setSubmitted(true);
      setMessage('Your question has been submitted. A mentor will review it soon.');
      setForm({ name: '', place: '', district: '', state: '', email: '', phone: '', question: '', category: '' });
      setSelectedParent('');
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, var(--clr-primary) 0%, #122a52 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Ask a Question</h1>
          <p style={{ color: 'rgba(200,216,245,0.8)' }}>
            Free guidance from volunteer mentors — no account needed.
          </p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth: '820px' }}>

        {submitted ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: 'var(--clr-primary)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Question Submitted!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 2rem' }}>
              Your question is now in our queue. Our team will assign a matching mentor
              who will reach out to you directly. This typically takes 1–3 days.
            </p>
            <button onClick={() => setSubmitted(false)} style={{ background: 'var(--clr-accent)', color: '#fff' }}>
              Submit another question
            </button>
          </div>
        ) : (
          <div className="panel">
            {/* Privacy note */}
            <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--clr-primary-faint)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.9rem 1rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🔒</span>
              <p style={{ color: 'var(--clr-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                <strong>Your privacy is protected.</strong> Contact details are shared only with your assigned mentor — never shown publicly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Full Name <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Priya Kumari" />
              </label>

              <label>
                Email <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
              </label>

              <label>
                Village / Town <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input name="place" value={form.place} onChange={handleChange} required placeholder="e.g. Bhojpur" />
              </label>

              <label>
                District <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <input name="district" value={form.district} onChange={handleChange} required placeholder="e.g. Patna" />
              </label>

              <label>
                State <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <select name="state" value={form.state} onChange={handleChange} required>
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label>
                Phone <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" />
              </label>

              {/* Category */}
              <label style={{ gridColumn: '1 / -1' }}>
                Category <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <select value={selectedParent} onChange={handleParentChange}>
                    <option value="">— Select Area —</option>
                    {expertiseList.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                  <select name="category" value={form.category} onChange={handleChange} required disabled={!selectedParent}>
                    <option value="">— Select Topic —</option>
                    {subCategories.map(sub => <option key={sub.value} value={sub.value}>{sub.label}</option>)}
                  </select>
                </div>
              </label>

              {/* Question */}
              <label style={{ gridColumn: '1 / -1' }}>
                Your Question <span style={{ color: 'var(--clr-danger)' }}>*</span>
                <textarea
                  name="question"
                  rows="6"
                  value={form.question}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  placeholder="Describe your situation in detail. The more context you give, the better guidance you'll receive."
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <small style={{ color: form.question.length > 900 ? 'var(--clr-danger)' : 'var(--text-light)' }}>
                    {form.question.length}/1000
                  </small>
                </div>
              </label>

              <button type="submit" disabled={submitting} style={{ gridColumn: '1 / -1', background: 'var(--clr-accent)', padding: '0.8rem', fontSize: '0.95rem' }}>
                {submitting ? 'Submitting…' : 'Submit Question →'}
              </button>
            </form>

            {message && (
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

export default AskQuestion;

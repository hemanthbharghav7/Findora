/**
 * Register.jsx
 * ------------
 * AAA Premium, Detective-themed registration page for Findora.
 * POSTs to /api/auth/register, stores token in localStorage on success.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // Premium CSS styles matching the login aesthetic

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── Password strength scorer ─────────────────────────────── */
function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3); // 1=weak, 2=medium, 3=strong
}

const STRENGTH_META = [
  { label: '', cls: '' },
  { label: 'Weak', cls: 'weak' },
  { label: 'Medium', cls: 'medium' },
  { label: 'Strong', cls: 'strong' },
];

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const strength = scorePassword(form.password);

  const handleChange = (e) => {
    setError(''); // Clear errors when typing
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!form.name || !form.email || !form.password || !form.confirm || !form.securityQuestion || !form.securityAnswer) {
      setError('Please fill in all fields to open your detective file.');
      return;
    }
    if (form.password.length < 6) {
      setError('Your passcode must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passcodes do not match. Check your clues.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          securityQuestion: form.securityQuestion,
          securityAnswer: form.securityAnswer,
        }),
      });

      // Safely parse JSON
      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('Server returned an invalid response.');
      }

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      // Store token and user info
      localStorage.setItem('findora_token', data.token);
      localStorage.setItem('findora_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
      }));

      setSuccess('Case file created! Redirecting to headquarters…');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page-container">
      {/* Forensic grid overlay & spotlights */}
      <div className="register-grid-overlay" />
      <div className="register-spotlight" />

      <div className="register-card-wrapper">
        <div className="register-card">
          
          {/* Circular badge with inner glow and pulse */}
          <div className="register-badge-container">
            <div className="register-icon-badge">
              <svg className="register-badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="3" />
                <path d="M8 17c0-2 2-3 4-3s4 1 4 3" />
              </svg>
            </div>
            <div className="badge-pulse" />
          </div>

          <header className="register-header">
            <h1 className="register-title">Open a Case File</h1>
            <p className="register-subtitle">Create your Findora detective account.</p>
          </header>

          {/* Feedback banners */}
          {error && <div className="register-error-banner" role="alert">⚠️ {error}</div>}
          {success && <div className="register-success-banner" role="status">✅ {success}</div>}

          <form className="register-form" onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-name">Full Name</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="reg-name"
                  className="register-form-input"
                  type="text"
                  name="name"
                  placeholder="Detective Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-email">Email Address</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="reg-email"
                  className="register-form-input"
                  type="email"
                  name="email"
                  placeholder="detective@findora.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-password">Password</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="reg-password"
                  className="register-form-input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="register-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password && (
                <div className="strength-container">
                  <div className="strength-bar-wrap" aria-hidden="true">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`strength-segment ${strength >= i ? STRENGTH_META[strength].cls : ''}`}
                      />
                    ))}
                  </div>
                  <span className={`strength-label ${STRENGTH_META[strength].cls}-text`}>
                    {STRENGTH_META[strength].label} passcode
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </span>
                <input
                  id="reg-confirm"
                  className="register-form-input"
                  type={showConf ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="register-pw-toggle"
                  onClick={() => setShowConf(v => !v)}
                  aria-label={showConf ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConf ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Security Question */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-question">Security Question</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <select
                  id="reg-question"
                  name="securityQuestion"
                  value={form.securityQuestion}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a security question...</option>
                  <option value="Who is your favorite fictional detective?">Who is your favorite fictional detective? (e.g. Sherlock Holmes)</option>
                  <option value="What was the name of your first childhood pet?">What was the name of your first childhood pet?</option>
                  <option value="In what city were you born?">In what city were you born?</option>
                  <option value="What was the model of your first car?">What was the model of your first car?</option>
                  <option value="What was your first investigative case subject?">What was your first investigative case subject?</option>
                </select>
                <span className="register-select-arrow">▼</span>
              </div>
            </div>

            {/* Security Answer */}
            <div className="register-form-group">
              <label className="register-form-label" htmlFor="reg-answer">Security Answer</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </span>
                <input
                  id="reg-answer"
                  className="register-form-input"
                  type="text"
                  name="securityAnswer"
                  placeholder="Your secret answer"
                  value={form.securityAnswer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="reg-submit"
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="register-spinner-container">
                  <div className="register-btn-spinner" />
                  <span>Enrolling Dossier…</span>
                </div>
              ) : (
                '🕵️ Enlist as Detective'
              )}
            </button>

          </form>

          <div className="register-divider">
            <span>or</span>
          </div>

          <footer className="register-footer">
            Already have a badge?{' '}
            <Link to="/login" className="register-login-link">
              Sign in →
            </Link>
          </footer>

        </div>
      </div>
    </main>
  );
}

export default Register;
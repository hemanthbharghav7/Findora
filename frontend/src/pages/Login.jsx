/**
 * Login.jsx
 * ---------
 * AAA Premium, Detective-themed login page for Findora.
 * POSTs to /api/auth/login, stores token in localStorage on success.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Premium CSS styles for edge lighting and grid overlays

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!form.email || !form.password) {
      setError('Please enter your email and password to retrieve case logs.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // Safely parse JSON
      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('Server returned an invalid response.');
      }

      if (!res.ok) {
        setError(data.message || 'Verification failed. Please check your credentials.');
        return;
      }

      // Store token and user info
      localStorage.setItem('findora_token', data.token);
      localStorage.setItem('findora_user', JSON.stringify({
        _id: data._id, name: data.name, email: data.email,
      }));

      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page-container">
      {/* Forensic grid overlay & spotlights */}
      <div className="login-grid-overlay" />
      <div className="login-spotlight" />

      <div className="login-card-wrapper">
        <div className="login-card">
          
          {/* Circular magnifying glass badge with inner glow and pulse */}
          <div className="login-badge-container">
            <div className="login-icon-badge">
              <svg className="login-badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
                <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
              </svg>
            </div>
            <div className="badge-pulse" />
          </div>

          <header className="login-header">
            <h1 className="login-title">Welcome Back, Detective</h1>
            <p className="login-subtitle">Sign in to continue your investigation.</p>
          </header>

          {/* Feedback Banner */}
          {error && <div className="login-error-banner" role="alert">⚠️ {error}</div>}

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Email Field */}
            <div className="login-form-group">
              <label className="login-form-label" htmlFor="login-email">Email Address</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  className="login-form-input"
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

            {/* Password Field */}
            <div className="login-form-group">
              <div className="login-password-header">
                <label className="login-form-label" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  className="login-form-input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="login-spinner-container">
                  <div className="login-btn-spinner" />
                  <span>Verifying Clearance…</span>
                </div>
              ) : (
                '🕵️ Sign In'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <footer className="login-footer">
            No account yet?{' '}
            <Link to="/register" className="login-register-link">
              Open a new case file →
            </Link>
          </footer>

        </div>
      </div>
    </main>
  );
}

export default Login;

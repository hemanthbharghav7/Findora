/**
 * ForgotPassword.jsx
 * -----------------
 * Password reset page for Findora using the Security Question flow.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Get Question, 2 = Verify & Reset
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);

  // Step 1: Submit email to retrieve security question
  const handleRetrieveQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please provide your agent email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Could not find your credentials. Double-check your email.');
        return;
      }

      setSecurityQuestion(data.question);
      setStep(2);
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify answer and set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!securityAnswer || !newPassword || !confirmPassword) {
      setError('Please fill in all recovery fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Your new password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Check your clues.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          securityAnswer,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Recovery failed. Incorrect security answer.');
        return;
      }

      setSuccess('Clearance granted! Password reset successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Icon */}
        <div className="auth-logo">🔓</div>

        <h1 className="auth-title">Recover Case File</h1>
        <p className="auth-subtitle">
          {step === 1 
            ? 'Verify your identity to decrypt your credentials.' 
            : 'Provide your security answer to overwrite password files.'}
        </p>

        {/* Banners */}
        {error && <div className="form-error" role="alert">⚠️ {error}</div>}
        {success && <div className="form-success" role="status">✅ {success}</div>}

        {step === 1 ? (
          /* STEP 1: Retrieve Question */
          <form className="auth-form" onSubmit={handleRetrieveQuestion} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="recovery-email">Agent Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="recovery-email"
                  className="form-input"
                  type="email"
                  placeholder="detective@findora.com"
                  value={email}
                  onChange={(e) => {
                    setError('');
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><div className="spinner" /> Sifting files...</> : '🔍 Pull Security Record'}
            </button>
          </form>
        ) : (
          /* STEP 2: Answer Question & Set New Password */
          <form className="auth-form" onSubmit={handleResetPassword} noValidate>
            
            {/* Display Question */}
            <div className="form-group">
              <span className="form-label">Configured Security Question</span>
              <div 
                style={{ 
                  background: 'rgba(255, 159, 10, 0.05)', 
                  border: '1px solid rgba(255, 159, 10, 0.25)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  color: 'var(--clr-text)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginTop: '0.25rem',
                  marginBottom: '1rem'
                }}
              >
                🕵️ "{securityQuestion}"
              </div>
            </div>

            {/* Answer */}
            <div className="form-group">
              <label className="form-label" htmlFor="recovery-answer">Security Answer</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  id="recovery-answer"
                  className="form-input"
                  type="text"
                  placeholder="Your configured answer"
                  value={securityAnswer}
                  onChange={(e) => {
                    setError('');
                    setSecurityAnswer(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="recovery-password">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="recovery-password"
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setError('');
                    setNewPassword(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="recovery-confirm">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  id="recovery-confirm"
                  className="form-input"
                  type={showConf ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError('');
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowConf(v => !v)}
                  aria-label={showConf ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConf ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><div className="spinner" /> Rewriting logs...</> : '💾 Apply New Credentials'}
            </button>
          </form>
        )}

        <div className="auth-divider">or</div>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">← Return to Headquarters (Sign In)</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;

/**
 * ReportItem.jsx
 * --------------
 * Premium detective-themed form to report a lost or found item.
 * Sends FormData (multipart) to POST /api/items with a JWT Bearer token via Axios.
 * Dynamic labels and text elements update based on the selected Case Type.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ReportItem.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { value: 'Electronics', icon: '💻' },
  { value: 'Clothing', icon: '👕' },
  { value: 'Documents', icon: '📄' },
  { value: 'Keys', icon: '🔑' },
  { value: 'Wallet', icon: '👛' },
  { value: 'Jewellery', icon: '💍' },
  { value: 'Bag', icon: '🎒' },
  { value: 'Other', icon: '📦' },
];

const STEPS = ['Case Type', 'Item Info', 'Details', 'Submit'];

function ReportItem() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: 'Lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
  });

  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const nextStep = () => {
    if (step === 0 && !form.type) {
      setError('Please choose a case type.'); return;
    }
    if (step === 1) {
      if (!form.title.trim()) { setError('Please enter an item title.'); return; }
      if (!form.category) { setError('Please select a category.'); return; }
    }
    if (step === 2) {
      if (!form.location.trim()) { setError('Please enter the location.'); return; }
      if (!form.date) { setError('Please enter the date.'); return; }
      if (!form.description.trim()) { setError('Please add a description.'); return; }
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('findora_token');
    if (!token) { setError('You must be logged in to file a report.'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type',        form.type);
      formData.append('title',       form.title);
      formData.append('description', form.description);
      formData.append('category',    form.category);
      formData.append('location',    form.location);
      formData.append('date',        form.date);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${API}/api/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to submit report.');
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="report-page">
        <div className="report-card success-card">
          <div className="police-warning-tape" />
          <div className="success-icon">✅</div>
          <h1 className="report-title">Case Filed!</h1>
          <p className="report-subtitle">Your evidence has been securely logged in the Findora mainframe. Redirecting to HQ…</p>
          <div className="success-bar"><div className="success-bar-fill" /></div>
        </div>
      </main>
    );
  }

  // Dynamic content based on Case Type (Lost/Found)
  const isLost = form.type === 'Lost';
  const pageHeadingText = isLost ? 'File a Lost Case' : 'Log Found Evidence';
  const pageSubText = isLost 
    ? 'Every clue matters. Help us locate your lost item.' 
    : 'Every clue matters. Help us return this found evidence.';

  const locationPlaceholder = isLost 
    ? 'e.g. "Central Station Platform 4"' 
    : 'e.g. "Near Central Park north entrance"';

  const descPlaceholder = isLost
    ? 'Describe distinguishing marks, colors, brand, serial numbers, or key contents...'
    : 'Describe item condition, key markings, where it was spotted, or how to claim...';

  return (
    <main className="report-page">
      <div className="report-card">
        
        {/* Police warning stripe & watermark & barcode */}
        <div className="police-warning-tape" />
        <div className="report-watermark">CLASSIFIED</div>
        
        <div className="report-barcode" aria-hidden="true">
          <div className="barcode-lines">
            <span className="line-w-1" /><span className="line-w-2" /><span className="line-w-1" /><span className="line-w-3" />
            <span className="line-w-2" /><span className="line-w-1" /><span className="line-w-1" /><span className="line-w-2" />
          </div>
          <span className="barcode-label">FID-CASE_INIT</span>
        </div>

        {/* Back Link */}
        <Link to="/dashboard" className="back-link">← Back to HQ</Link>

        {/* Header Badge */}
        <div className="report-logo-container">
          <div className="report-logo-badge">
            <svg className="report-badge-svg" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="logo-pulse" />
        </div>

        <h1 className="report-title">{pageHeadingText}</h1>
        <p className="report-subtitle">{pageSubText}</p>

        {/* Step progress */}
        <div className="step-progress">
          {STEPS.map((label, i) => (
            <div key={label} className={`step-item ${i <= step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
              <div className="step-circle">
                {i < step ? '✓' : i + 1}
              </div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'filled' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <div className="form-error shake" role="alert">⚠️ {error}</div>}

        <form className="report-form" onSubmit={handleSubmit} noValidate>

          {/* ── Step 0: Case Type ─────────────────────── */}
          <div className={`form-step ${step === 0 ? 'visible' : 'hidden'}`}>
            <p className="step-question">Are you reporting a lost item or filing found evidence?</p>
            <div className="type-toggle">
              {[
                { value: 'Lost', icon: '🔴', desc: 'I lost something' },
                { value: 'Found', icon: '🟢', desc: 'I found something' },
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-card ${form.type === t.value ? 'active' : ''} ${t.value.toLowerCase()}`}
                  onClick={() => { setForm(p => ({ ...p, type: t.value })); setError(''); }}
                >
                  <span className="type-card-icon">{t.icon}</span>
                  <span className="type-card-value">{t.value}</span>
                  <span className="type-card-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Step 1: Item Info ─────────────────────── */}
          <div className={`form-step ${step === 1 ? 'visible' : 'hidden'}`}>
            <div className="form-group">
              <label className="form-label" htmlFor="report-title">Item Designation (Title)</label>
              <div className="input-wrapper">
                <span className="input-icon">🏷️</span>
                <input
                  id="report-title"
                  className="form-input"
                  type="text"
                  name="title"
                  placeholder='e.g. "Vintage Leather Briefcase"'
                  value={form.title}
                  onChange={handleChange}
                  autoFocus={step === 1}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Evidence Category</label>
              <div className="category-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-btn ${form.category === cat.value ? 'active' : ''}`}
                    onClick={() => { setForm(p => ({ ...p, category: cat.value })); setError(''); }}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-label">{cat.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Step 2: Details & Media ───────────────── */}
          <div className={`form-step ${step === 2 ? 'visible' : 'hidden'}`}>
            <div className="form-row">
              <div className="form-group half-width">
                <label className="form-label" htmlFor="report-location">
                  {isLost ? 'Last Known Location' : 'Location Recovered'}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    id="report-location"
                    className="form-input"
                    type="text"
                    name="location"
                    placeholder={locationPlaceholder}
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group half-width">
                <label className="form-label" htmlFor="report-date">
                  Date {isLost ? 'Lost' : 'Found'}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📅</span>
                  <input
                    id="report-date"
                    className="form-input"
                    type="date"
                    name="date"
                    value={form.date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="report-description">
                {isLost ? 'Dossier Notes & Clues' : 'Evidence Markings & Condition'}
              </label>
              <textarea
                id="report-description"
                className="form-input form-textarea"
                name="description"
                placeholder={descPlaceholder}
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Evidence Image Upload */}
            <div className="form-group">
              <label className="form-label">Photographic Evidence (Optional)</label>
              <div className={`file-upload-wrapper ${imagePreview ? 'has-image' : ''}`}>
                {!imagePreview ? (
                  <>
                    <span className="upload-icon">📷</span>
                    <p className="upload-text">Click to browse or drag image here</p>
                    <input
                      id="report-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input-hidden"
                    />
                  </>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Evidence Preview" className="image-preview" />
                    <button type="button" className="btn-remove-image" onClick={removeImage}>
                      ✖ Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Step 3: Review & Submit ───────────────── */}
          <div className={`form-step ${step === 3 ? 'visible' : 'hidden'}`}>
            <p className="step-question">Review your dossier before filing:</p>
            <div className="review-grid">
              {[
                { label: 'Type', value: form.type, icon: isLost ? '🔴' : '🟢' },
                { label: 'Title', value: form.title, icon: '🏷️' },
                { label: 'Category', value: form.category, icon: '📂' },
                { label: 'Location', value: form.location, icon: '📍' },
                { label: 'Date', value: form.date, icon: '📅' },
                { label: 'Photo', value: imageFile ? 'Attached' : 'None', icon: '📷' }
              ].map(row => (
                <div key={row.label} className="review-row">
                  <span className="review-icon">{row.icon}</span>
                  <div>
                    <div className="review-label">{row.label}</div>
                    <div className="review-value">{row.value || '—'}</div>
                  </div>
                </div>
              ))}
              <div className="review-row review-desc">
                <span className="review-icon">📝</span>
                <div>
                  <div className="review-label">{isLost ? 'Dossier Notes & Clues' : 'Evidence Condition & Markings'}</div>
                  <div className="review-value">{form.description || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Navigation buttons ────────────────────── */}
          <div className="step-nav">
            {step > 0 && (
              <button type="button" className="btn btn-outline step-back-btn" onClick={prevStep} disabled={loading}>
                ← Back
              </button>
            )}

            {step < 3 ? (
              <button type="button" className="btn btn-primary step-next-btn" onClick={nextStep}>
                Next Step →
              </button>
            ) : (
              <button
                id="report-submit"
                type="submit"
                className="btn btn-primary step-next-btn"
                disabled={loading}
              >
                {loading ? <><div className="spinner" /> Filing Data…</> : '📋 File Official Report'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default ReportItem;
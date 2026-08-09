/**
 * ItemDetails.jsx
 * -------------
 * Full "FID Crime Dossier" view for a single lost or found item.
 * Includes the Claims System (Submit claim, Approve/Reject claims).
 * Structured in a clean two-column grid.
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ItemDetails.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORY_ICONS = {
  Electronics: '💻', Clothing: '👕', Documents: '📄',
  Keys: '🔑', Wallet: '👛', Jewellery: '💍', Bag: '🎒', Other: '📦',
};

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const [claimMessage, setClaimMessage] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  const getStoredUser = () => {
    try {
      const u = localStorage.getItem('findora_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  };

  const storedUser = getStoredUser();
  const token = localStorage.getItem('findora_token');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res  = await fetch(`${API}/api/items/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Item not found');
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    setClaiming(true);
    setClaimError('');

    try {
      const res = await fetch(`${API}/api/items/${item._id}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: claimMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit claim');
      setItem(data);
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  const handleClaimStatus = async (claimId, status) => {
    try {
      const res = await fetch(`${API}/api/items/${item._id}/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update claim');
      setItem(data);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-loader">
          <div className="detail-spinner" />
          <span>Retrieving case file from FID archives…</span>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="detail-page">
        <div className="detail-error-box">
          <span className="detail-error-icon">🔎</span>
          <h2>Case File Not Found</h2>
          <p>{error || 'This case does not exist in our records.'}</p>
          <Link to="/browse" className="btn btn-primary">Return to Evidence Room</Link>
        </div>
      </main>
    );
  }

  const reportedOn = new Date(item.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  
  const isOwner = storedUser && storedUser._id === item.owner._id;
  const myClaim = storedUser && item.claims ? item.claims.find(c => {
    const claimUserId = c.user && c.user._id ? c.user._id : c.user;
    return claimUserId === storedUser._id;
  }) : null;
  const imageUrl = item.image ? (item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${API}${item.image}`) : null;
  const caseSerial = `FID-${item._id.slice(-8).toUpperCase()}`;

  return (
    <main className="detail-page">
      <div className="dossier-wrapper">
        <div className={`dossier-folder ${item.type.toLowerCase()}`}>
          
          {/* Police Warning Tape stripe */}
          <div className="police-warning-tape" />

          {/* Background Watermark */}
          <div className="confidential-watermark">CONFIDENTIAL</div>

          {/* Header Banner */}
          <div className="dossier-banner">
            <div className="banner-text-wrapper">
              <div className="banner-icon-badge">
                <svg className="banner-badge-svg" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <div className="banner-text">
                <span className="banner-classification">🕵️ FID FEDERAL INTELLIGENCE DOSSIER // UNIT 9</span>
                <h1 className="banner-title">{item.type.toUpperCase()} ITEM METADATA</h1>
                <span className="banner-restricted-notice">ACCESS RESTRICTED // MONITORED CONNECTION</span>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="dossier-barcode" aria-hidden="true">
              <div className="barcode-lines">
                <span className="line-w-1" /><span className="line-w-2" /><span className="line-w-1" /><span className="line-w-3" />
                <span className="line-w-2" /><span className="line-w-1" /><span className="line-w-1" /><span className="line-w-2" />
                <span className="line-w-3" /><span className="line-w-1" /><span className="line-w-2" /><span className="line-w-1" />
              </div>
              <span className="barcode-label">{caseSerial}</span>
            </div>

            <div className="banner-seal">
              <span className={`status-stamp ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* CLASSIFIED Security notice advisory block */}
          <div className="cid-security-notice">
            <div className="notice-header">
              <svg className="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>CLASSIFIED SYSTEM ADVISORY</span>
            </div>
            <p className="notice-text">
              <strong>WARNING:</strong> Central FID Logistics Network. Access to this document is limited to active investigations. 
              Unauthorized replication, electronic transfer, or printing of this dossier is a federal violation under 
              Intel Sec Statute 204. IP address is logged.
            </p>
            <div className="notice-metadata">
              <span>CASE NO: #{caseSerial}</span>
              <span>CLEARANCE: LEVEL-4 RESTRICTED</span>
              <span>HOST: FINDORA_SECURE_VAULT_NODE</span>
            </div>
          </div>

          {/* Dossier Body with two-column layout grid */}
          <div className="dossier-body">
            <div className="dossier-body-grid">
              
              {/* Left Column: Dossier Details & Facts */}
              <div className="dossier-left-column">
                
                {/* Image Evidence styled as a Forensic Scene Capture */}
                <div className="evidence-photo-box">
                  <div className="photo-corners">
                    <span className="corner tl" />
                    <span className="corner tr" />
                    <span className="corner bl" />
                    <span className="corner br" />
                  </div>
                  
                  {imageUrl ? (
                    <div className="photo-container">
                      <img src={imageUrl} alt="Evidence Exhibit" className="evidence-img" />
                      <div className="photo-overlay">FORENSIC ANALYSIS // EVIDENCE CAPTURE</div>
                    </div>
                  ) : (
                    <div className="photo-placeholder">
                      <span className="placeholder-icon">{CATEGORY_ICONS[item.category] || '📦'}</span>
                      <span className="placeholder-text">NO PHOTOGRAPHIC EVIDENCE // REQUIRED</span>
                    </div>
                  )}

                  <div className="photo-tech-data">
                    <span>SYS: FID_CAM_09</span>
                    <span>LOC: {item.location.toUpperCase()}</span>
                  </div>
                </div>

                {/* Case Facts */}
                <div className="detail-card facts-card">
                  <h3 className="detail-card-title">🔎 Case Facts</h3>
                  <div className="facts-grid">
                    {[
                      { label: 'Subject / Title', value: item.title },
                      { label: 'Category', value: item.category },
                      { label: 'Location Logged', value: item.location },
                      { label: 'Date Logged', value: reportedOn },
                    ].map((fact, idx) => (
                      <div key={idx} className="fact-item">
                        <span className="fact-dot" />
                        <div>
                          <p className="fact-label">{fact.label}</p>
                          <p className="fact-value">{fact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="detail-card description-card">
                  <h3 className="detail-card-title">📝 Dossier Notes / Description</h3>
                  <p className="detail-description">{item.description}</p>
                </div>

              </div>

              {/* Right Column: Case Management & Claims */}
              <div className="dossier-right-column">
                
                {/* Reporting Agent Info */}
                <div className="reporter-box">
                  <div className="reporter-header">
                    <h3>FID Reporting Officer</h3>
                  </div>
                  <div className="reporter-info">
                    <div className="reporter-avatar">
                      🕵️‍♂️
                    </div>
                    <div className="reporter-details">
                      <p className="reporter-name">{item.owner.name}</p>
                      <p className="reporter-email">{item.owner.email}</p>
                    </div>
                  </div>
                </div>

                {/* Claims Inbox or Submit Claim Box */}
                <div className="claims-section-card">
                  {isOwner ? (
                    // OWNER VIEW: Claims Inbox
                    <div className="claims-inbox">
                      <h3 className="detail-card-title">📥 Claims Inbox</h3>
                      {!item.claims || item.claims.length === 0 ? (
                        <p className="no-claims-text">No claims have been filed against this dossier.</p>
                      ) : (
                        <div className="claims-list">
                          {item.claims.map(claim => (
                            <div key={claim._id} className={`claim-card status-${claim.status.toLowerCase()}`}>
                              <div className="claim-header">
                                <span className="claim-user">{claim.user.name}</span>
                                <span className={`claim-badge ${claim.status.toLowerCase()}`}>{claim.status}</span>
                              </div>
                              <p className="claim-message">"{claim.message}"</p>
                              
                              {claim.status === 'Approved' && (
                                <div className="claim-contact">
                                  <strong>Contact Claimant:</strong> {claim.user.email}
                                </div>
                              )}

                              {claim.status === 'Pending' && item.status === 'Open' && (
                                <div className="claim-actions">
                                  <button className="btn-approve" onClick={() => handleClaimStatus(claim._id, 'Approved')}>
                                    🟢 Approve
                                  </button>
                                  <button className="btn-reject" onClick={() => handleClaimStatus(claim._id, 'Rejected')}>
                                    🔴 Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // NON-OWNER VIEW: Submit Claim
                    <div className="claim-submission">
                      {myClaim ? (
                        <div className={`my-claim-status ${myClaim.status ? myClaim.status.toLowerCase() : 'pending'}`}>
                          {(!myClaim.status || myClaim.status === 'Pending') && (
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,201,167,0.1)', borderRadius: '8px', border: '1px solid rgba(0,201,167,0.3)' }}>
                              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                              <h3 style={{ color: '#2ecc71', margin: '0 0 0.5rem 0' }}>Claim Filed</h3>
                              <p style={{ margin: 0, fontSize: '0.88rem', color: '#ddd' }}>The case officer is currently reviewing your details.</p>
                            </div>
                          )}
                          
                          <h3>Your Claim Status: <span className={`badge ${myClaim.status ? myClaim.status.toLowerCase() : 'pending'}`}>{myClaim.status || 'Pending'}</span></h3>
                          <p className="my-claim-message">"{myClaim.message}"</p>
                          {myClaim.status === 'Approved' && (
                            <div className="claim-contact mt-3">
                              <strong>Officer Contact:</strong> {item.owner.email}
                              <p className="text-sm mt-1">Contact the case officer to retrieve this item.</p>
                            </div>
                          )}
                          {myClaim.status === 'Rejected' && (
                            <p className="text-sm mt-2 text-danger">The case officer has rejected your claim details.</p>
                          )}
                        </div>
                      ) : (
                        item.status === 'Open' ? (
                          <form className="claim-form" onSubmit={handleSubmitClaim}>
                            <h3 className="detail-card-title">🙋 Submit an Ownership Claim</h3>
                            <p className="claim-help">Provide details of ownership (identifying marks, serials, context) to coordinate item retrieval.</p>
                            {claimError && <div className="form-error">⚠️ {claimError}</div>}
                            <textarea
                              className="claim-textarea"
                              rows="4"
                              placeholder="Describe your item details, identifying marks, where it was lost/found..."
                              value={claimMessage}
                              onChange={(e) => setClaimMessage(e.target.value)}
                              disabled={claiming}
                            />
                            <button type="submit" className="btn btn-primary w-100" disabled={claiming || !claimMessage.trim()}>
                              {claiming ? 'Filing Claim Dossier...' : '🔐 Submit Claim Dossier'}
                            </button>
                          </form>
                        ) : (
                          <div className="item-resolved-notice">
                            <h3>This case is {item.status}</h3>
                            <p>No further claims can be processed on this dossier.</p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Metadata footer */}
            <div className="detail-meta">
              <span>Registry case ID: <code>FID-{item._id.toUpperCase()}</code></span>
              <span>Dossier Created: {reportedOn}</span>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ItemDetails;

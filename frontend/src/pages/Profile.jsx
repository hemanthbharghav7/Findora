/**
 * Profile.jsx
 * -----------
 * Overhauled Profile Agent Credentials view.
 * Features a hyper-skeuomorphic 3D flipping card with dynamic glares/sheens,
 * polaroid-styled forensic photo slots, and terminal-style digital stat boxes.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Profile() {
  const navigate = useNavigate();
  
  const getStoredUser = () => {
    try {
      const u = localStorage.getItem('findora_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  };

  const storedUser = getStoredUser();
  const token = localStorage.getItem('findora_token');

  const [stats, setStats] = useState({ total: 0, open: 0, solved: 0 });
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/api/items/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const cases = await res.json();
          setStats({
            total: cases.length,
            open: cases.filter(c => c.status === 'Open').length,
            solved: cases.filter(c => c.status === 'Resolved').length,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('findora_token');
    localStorage.removeItem('findora_user');
    navigate('/login');
  };

  if (!storedUser) return null;

  const agentId = storedUser._id ? storedUser._id.substring(0, 10).toUpperCase() : 'UNKNOWN';
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();
  const avatarLetter = storedUser.name ? storedUser.name.charAt(0).toUpperCase() : 'A';

  return (
    <main className="profile-page">
      <Link to="/dashboard" className="back-link">← Return to Command Centre</Link>
      
      <div className="profile-container">
        <h1 className="profile-title">AGENT CREDENTIALS</h1>
        <p className="profile-subtitle">Click card to swipe/flip security record</p>

        {/* 3D Scene Wrapper */}
        <div className="card-scene">
          {/* Card Container with Glare Overlays */}
          <div 
            className={`cid-card ${isFlipped ? 'is-flipped' : ''}`} 
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front Card Face */}
            <div className="card-face card-front">
              {/* Dynamic light sheen overlay */}
              <div className="card-glare" />
              
              <div className="card-inner">
                {/* Header */}
                <div className="card-header">
                  <div className="header-seal">
                    <svg className="agency-badge-svg" viewBox="0 0 100 100" style={{ width: '50px', height: '50px' }}>
                      <defs>
                        <path id="badgeTopPath" d="M 16, 50 A 34,34 0 0,1 84,50" fill="none" />
                      </defs>
                      <circle cx="50" cy="50" r="46" fill="#0d0e15" stroke="#d4af37" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="41" fill="none" stroke="#d4af37" strokeDasharray="1.5,1.5" strokeWidth="1" />
                      <path d="M50,26 C57,26 63,29 63,35 C63,47 50,58 50,62 C50,58 37,47 37,35 C37,29 43,26 50,26 Z" fill="#d4af37" />
                      <circle cx="50" cy="38" r="5" fill="#0d0e15" stroke="#d4af37" strokeWidth="1.2" />
                      <line x1="53.5" y1="41.5" x2="58" y2="46" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" />
                      <rect x="36" y="52" width="28" height="6" rx="1.5" fill="#0d0e15" stroke="#d4af37" strokeWidth="1" />
                      <text x="50" y="56.5" fill="#d4af37" fontSize="4.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">FID</text>
                      <text fill="#d4af37" fontSize="6.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        <textPath href="#badgeTopPath" startOffset="50%">
                          FINDORA INTEL
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="header-text">
                    <h2>FINDORA INVESTIGATIVE DIVISION</h2>
                    <span>SPECIAL AGENT CREDENTIALS</span>
                  </div>
                </div>

                {/* Body */}
                {/* Restructured Body (No Photo) */}
                <div className="card-body">
                  <div className="agent-details">
                    <div className="details-col-left">
                      <div className="detail-row">
                        <span className="label">AGENT NAME</span>
                        <span className="value">{storedUser.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">AGENT ID</span>
                        <span className="value serial-font">{agentId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">COMMS DIRECTORY</span>
                        <span className="value">{storedUser.email}</span>
                      </div>
                    </div>
                    
                    <div className="details-col-right">
                      <div className="detail-row">
                        <span className="label">CLEARANCE LEVEL</span>
                        <span className="value text-accent-stamp">LEVEL 3</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">ISSUE DATE</span>
                        <span className="value date-val">{issueDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">SECURITY STATUS</span>
                        <span className="value status-val">ACTIVE // AUTH</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer (Barcode) */}
                <div className="card-footer">
                  <div className="barcode">
                    |||| || ||||| | || |||| | ||| | ||| |||| | ||
                  </div>
                  <div className="signature">
                    Auth: {storedUser.name.split(' ')[0]}
                  </div>
                </div>
                
                {/* Confidential Background watermark */}
                <div className="confidential-watermark-stamp">CONFIDENTIAL</div>
              </div>
            </div>

            {/* Back Card Face (Terminal Vibe) */}
            <div className="card-face card-back">
              {/* Dynamic glare/light sweep */}
              <div className="card-glare" />
              
              <div className="card-inner">
                {/* Realistic Metallic Magnetic Stripe */}
                <div className="magnetic-stripe">
                  <div className="stripe-sheen" />
                </div>

                <div className="back-header">
                  <h3>FID LOGISTICS CORE TERMINAL</h3>
                  <div className="chip">
                    <span className="chip-line" />
                    <span className="chip-line" />
                    <span className="chip-line" />
                  </div>
                </div>

                {/* Recessed Stat Screens */}
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Total Cases</span>
                    <span className="stat-number total-glow">{loading ? '-' : stats.total}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Active</span>
                    <span className="stat-number active-glow">{loading ? '-' : stats.open}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Solved</span>
                    <span className="stat-number solved-glow">{loading ? '-' : stats.solved}</span>
                  </div>
                </div>

                {/* Terminal Actions */}
                <div className="terminal-actions">
                  <button 
                    className="btn-terminal-access" 
                    onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
                  >
                    ACCESS DASHBOARD
                  </button>
                  <button 
                    className="btn-logout-terminal" 
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  >
                    [ TERMINATE SESSION ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;

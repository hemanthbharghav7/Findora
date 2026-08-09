/**
 * Dashboard.jsx
 * -------------
 * The Detective Command Centre. Premium Bento-grid layout.
 * Displays Quick Stats, Investigations, Case Leads, and Live Alerts.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Dashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CAT_ICONS = {
  Electronics: '💻', Clothing: '👕', Documents: '📄', Keys: '🔑',
  Wallet: '👛', Jewellery: '💍', Bag: '🎒', Other: '📦',
};

function Dashboard() {
  const navigate = useNavigate();

  const getStoredUser = () => {
    try {
      const u = localStorage.getItem('findora_user');
      return u ? JSON.parse(u) : {};
    } catch { return {}; }
  };

  const storedUser = getStoredUser();
  const token      = localStorage.getItem('findora_token');

  const [cases, setCases] = useState([]);
  const [leads, setLeads] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  // Fetch Data (Cases, Matches, Notifications)
  useEffect(() => {
    if (!token) return;
    
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Cases
        const resCases = await fetch(`${API}/api/items/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataCases = await resCases.json();
        if (!resCases.ok) throw new Error(dataCases.message || 'Failed to fetch cases.');
        setCases(dataCases);

        // 2. Fetch Notifications
        const resNotifs = await fetch(`${API}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataNotifs = await resNotifs.json();
        if (resNotifs.ok) {
          setNotifications(dataNotifs);
        }

        // 3. Fetch Case Leads (for open cases)
        const openCases = dataCases.filter(c => c.status === 'Open').slice(0, 3);
        const matchResults = await Promise.all(
          openCases.map(async (c) => {
            const r = await fetch(`${API}/api/items/${c._id}/matches`);
            const m = await r.json();
            return { id: c._id, matches: Array.isArray(m) ? m.slice(0, 3) : [] };
          })
        );
        const leadsMap = {};
        matchResults.forEach(({ id, matches }) => {
          if (matches.length > 0) leadsMap[id] = matches;
        });
        setLeads(leadsMap);

      } catch (err) {
        setError(err.message || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token]);

  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('findora_token');
    localStorage.removeItem('findora_user');
    navigate('/login');
  };

  const totalLeads = Object.values(leads).reduce((sum, arr) => sum + arr.length, 0);
  const openCasesCount = cases.filter(c => c.status === 'Open').length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <main className="dashboard-container">
      <div className="dashboard-content-wrapper">
      
      {/* ── Top Navigation / Header ── */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-badge">COMMAND CENTRE</span>
          <h1 className="header-title">Welcome back, Detective {storedUser.name || 'Agent'}</h1>
        </div>
        <div className="header-right" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/profile" className="btn btn-primary action-btn">🪪 View Credentials</Link>
          <button className="btn btn-secondary action-btn" onClick={handleLogout}>🚪 Sign Out</button>
        </div>
      </header>

      {/* ── Bento Grid Layout ── */}
      <div className="bento-grid">
        
        {/* Top Left: Quick Stats */}
        <section className="bento-box stats-box">
          <div className="stat-card">
            <h4>Total Cases</h4>
            <div className="stat-value">{cases.length}</div>
          </div>
          <div className="stat-card active">
            <h4>Active Investigations</h4>
            <div className="stat-value">{openCasesCount}</div>
          </div>
          <div className="stat-card alerts">
            <h4>System Alerts</h4>
            <div className="stat-value">{unreadNotifsCount}</div>
          </div>
          <div className="stat-actions">
            <Link to="/report" className="btn btn-primary">📝 Open New Case</Link>
            <Link to="/browse" className="btn btn-secondary" style={{marginLeft: '0.5rem'}}>🔍 Browse</Link>
          </div>
        </section>

        {/* Right Sidebar (Span rows): Alerts & Intelligence */}
        <aside className="bento-sidebar">
          
          {/* Notifications Panel */}
          <div className="bento-box notifications-box">
            <div className="box-header">
              <h3>🔔 Live Alerts</h3>
              {unreadNotifsCount > 0 && <span className="pulse-badge">{unreadNotifsCount} New</span>}
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <p className="empty-text">No alerts on the wire.</p>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className={`notif-card ${n.isRead ? 'read' : 'unread'}`} onClick={() => markNotificationAsRead(n._id)}>
                    {!n.isRead && (
                      <div className="alert-dot-wrapper">
                        <div className="pulse-dot" />
                      </div>
                    )}
                    <div className="notif-content">
                      <p>{n.message}</p>
                      <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link to={n.link} className="notif-link">View →</Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Case Leads Panel */}
          <div className="bento-box leads-box">
            <div className="box-header">
              <h3>🔎 Case Leads</h3>
              <span className="lead-count">{totalLeads}</span>
            </div>
            <div className="leads-list">
              {totalLeads === 0 ? (
                <p className="empty-text">No cross-matches found for your cases yet.</p>
              ) : (
                cases.filter(c => c.status === 'Open' && leads[c._id]).map(c => (
                  <div key={c._id} className="lead-group-mini">
                    <p className="lead-group-title">Matches for: <strong>{c.title}</strong></p>
                    {leads[c._id].map(match => (
                      <Link to={`/items/${match._id}`} key={match._id} className="lead-mini-card">
                        <span className="lead-icon">{CAT_ICONS[match.category] || '📦'}</span>
                        <div className="lead-meta">
                          <span className={`badge-mini ${match.type.toLowerCase()}`}>{match.type}</span>
                          <span className="lead-title">{match.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

        </aside>

        {/* Bottom Left: My Investigations (Horizontal List) */}
        <section className="bento-box investigations-box">
          <div className="box-header">
            <h3>📁 My Investigations</h3>
          </div>
          
          {loading && <div className="loader">Sifting through archives...</div>}
          {error && <div className="form-error">⚠️ {error}</div>}

          {!loading && !error && cases.length === 0 && (
            <div className="empty-state">
              <p>Your desk is clean. No cases filed yet.</p>
            </div>
          )}

          {!loading && !error && cases.length > 0 && (
            <div className="investigation-rows">
              {cases.map((item) => (
                <div key={item._id} className={`inv-row ${item.type.toLowerCase()}`}>
                  <div className="inv-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`status-dot ${item.status.toLowerCase()}`}></span>
                    <span className={`status-text ${item.status.toLowerCase()}`} style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {item.status}
                    </span>
                  </div>
                  <div className="inv-info">
                    <h4>{item.title}</h4>
                    <span className="inv-meta">{item.category} • {item.location} • {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="inv-type">
                    <span className={`badge-mini ${item.type.toLowerCase()}`}>{item.type}</span>
                  </div>
                  <div className="inv-action">
                    <Link to={`/items/${item._id}`} className="btn-small">Review File →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
      </div>
    </main>
  );
}

export default Dashboard;
/**
 * Sidebar.jsx
 * -----------
 * Vertical left-hand sidebar navigation for the Findora Detective App.
 * Uses react-router-dom NavLink for routing and active states.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Agent', email: '' });

  // Get user details on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('findora_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading user info from localStorage', e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('findora_token');
    localStorage.removeItem('findora_user');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
            <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
          </svg>
          <span className="logo-text">FINDORA</span>
        </div>
        <button className={`hamburger-btn ${isOpen ? 'active' : ''}`} onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

      {/* Main Sidebar Container */}
      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        
        {/* Floating Bubble Background */}
        <div className="sidebar-bubbles" aria-hidden="true">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        
        {/* Logo / Brand Branding */}
        <div className="sidebar-brand">
          <div className="brand-logo-wrapper">
            <svg className="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
              <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text">
            <h2>FINDORA</h2>
            <span>DETECTIVE DIVISION</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <div className="nav-icon-box">
              {/* Radar/Dashboard SVG */}
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            </div>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink 
            to="/browse" 
            className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <div className="nav-icon-box">
              {/* Fingerprint / Browse SVG */}
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2z" />
                <path d="M12 6a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6" />
                <path d="M12 10a2 2 0 0 0-2 2" />
                <path d="M12 14v4" />
                <path d="M14 12h.01" />
              </svg>
            </div>
            <span className="nav-label">Browse Evidence</span>
          </NavLink>

          <NavLink 
            to="/report" 
            className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <div className="nav-icon-box">
              {/* Folder / Open Case SVG */}
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <span className="nav-label">Open Case</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <div className="nav-icon-box">
              {/* Badge / Profile SVG */}
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="3" />
                <path d="M8 17c0-2 2-3 4-3s4 1 4 3" />
              </svg>
            </div>
            <span className="nav-label">Agent Badge</span>
          </NavLink>
        </nav>

        {/* Profile Card / Bottom Actions */}
        <div className="sidebar-footer">
          <div className="agent-profile-mini">
            <div className="agent-avatar">{avatarLetter}</div>
            <div className="agent-info">
              <span className="agent-name">{user.name}</span>
              <span className="agent-rank">Special Agent</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign Out / Close File">
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-label">Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;

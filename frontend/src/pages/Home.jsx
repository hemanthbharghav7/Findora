/**
 * Home.jsx
 * --------
 * Ultra-premium landing page for Findora.
 * UI styles mixed:
 *  - Glassmorphism (hero card, bento cards)
 *  - Bento Grid (feature section)
 *  - Claymorphism (step cards)
 *  - Liquid Glass (CTA section)
 *  - Neomorphism accents (stat items)
 *  - Spatial UI (depth layers, parallax orbs)
 *  - Minimalism (clean typography hierarchy)
 *  - Maximalism (rich particle backgrounds)
 */

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import './Home.css';

/* ── Typewriter hook ──────────────────────────────────────── */
const PHRASES = [
  'Uncover what was lost.',
  'Crack the missing-item case.',
  'Reunite clues with their owners.',
  'Every item has a story to solve.',
  'Your belongings. Found.',
];

function useTypewriter(phrases, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && charIdx === current.length) {
      delay = pause;
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
      return;
    }
    const t = setTimeout(() => {
      setDisplay(current.slice(0, deleting ? charIdx - 1 : charIdx + 1));
      setCharIdx(i => i + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return display;
}

/* ── Animated counter hook ────────────────────────────────── */
function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

/* ── Particle canvas ──────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      opacity: Math.random() * 0.45 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,166,35,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245,166,35,${0.055 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

/* ── Stats data ───────────────────────────────────────────── */
const STATS = [
  { target: 4800, suffix: '+', label: 'Cases Filed',     icon: '📂' },
  { target: 3200, suffix: '+', label: 'Items Recovered', icon: '🔑' },
  { target: 97,   suffix: '%', label: 'Resolution Rate', icon: '✅' },
  { target: 120,  suffix: '+', label: 'Cities Active',   icon: '🌍' },
];

function StatItem({ target, suffix, label, icon, started }) {
  const count = useCountUp(target, 1800, started);
  return (
    <div className="stat-item">
      <span className="stat-icon-wrap">{icon}</span>
      <span className="stat-number">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME COMPONENT
   ══════════════════════════════════════════════════════════ */
function Home() {
  const tagline = useTypewriter(PHRASES, 55, 2200);
  const stepRefs  = useRef([]);
  const statsRef  = useRef(null);
  const bentoRef  = useRef([]);
  const [statsStarted, setStatsStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('findora_token');
      const storedUser = localStorage.getItem('findora_user');
      if (token) {
        setIsLoggedIn(true);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (err) {
      console.error('Error reading auth state on mount:', err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('findora_token');
    localStorage.removeItem('findora_user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const allRefs = [...stepRefs.current, ...bentoRef.current];
    const observers = [];
    allRefs.forEach(el => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); obs.unobserve(el); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ox1 = (mousePos.x - 0.5) * 32;
  const oy1 = (mousePos.y - 0.5) * 32;
  const ox2 = (mousePos.x - 0.5) * -22;
  const oy2 = (mousePos.y - 0.5) * -22;

  return (
    <main className="home-container">

      {/* Particle layer */}
      <ParticleCanvas />

      {/* ══ STICKY NAVIGATION HEADER ═══════════════════════ */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <svg className="landing-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
              <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
            </svg>
            <span className="landing-logo-text">FINDORA</span>
          </div>

          <nav className="landing-nav">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#process" className="landing-nav-link">Process</a>
          </nav>

          <div className="landing-auth-actions">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="btn-nav btn-nav-primary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-nav btn-nav-glass">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-nav btn-nav-glass">
                  Sign In
                </Link>
                <Link to="/register" className="btn-nav btn-nav-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ HERO — Glassmorphism ════════════════════════════ */}
      <section className="hero-section">
        {/* Spatial depth orbs */}
        <div className="hero-orb orb-1" style={{ transform: `translate(${ox1}px,${oy1}px)` }} aria-hidden="true" />
        <div className="hero-orb orb-2" style={{ transform: `translate(${ox2}px,${oy2}px)` }} aria-hidden="true" />
        <div className="hero-orb orb-3" aria-hidden="true" />

        <div className="hero-glass-card">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Live Investigation Platform
            <span className="badge-version">v2.0</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Find<span className="accent-glow">ora</span>
            <span className="hero-emoji"> 🔍</span>
          </h1>

          <p className="hero-subtitle">The world's smartest lost &amp; found platform</p>

          {/* Typewriter */}
          <p className="hero-tagline">
            {tagline}
            <span className="typewriter-cursor" aria-hidden="true" />
          </p>

          {/* CTA */}
          <div className="hero-actions">
            <Link to={isLoggedIn ? "/report" : "/login"} id="hero-report-btn" className="btn btn-primary btn-glow">
              📋 Open a Case
            </Link>
            <Link to={isLoggedIn ? "/browse" : "/login"} id="hero-browse-btn" className="btn btn-glass">
              🔎 Browse Evidence
            </Link>
          </div>

          {/* Trust strip */}
          <div className="hero-trust">
            <div className="trust-avatars">
              {['🕵️','👩‍💼','👨‍🔬','👮','👩‍🏫'].map((e, i) => (
                <span key={i} className="trust-avatar">{e}</span>
              ))}
            </div>
            <span className="trust-text">Trusted by <strong>12,000+</strong> investigators worldwide</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ STATS — Neomorphism ══════════════════════════════ */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {STATS.map(s => (
            <StatItem key={s.label} target={s.target} suffix={s.suffix} label={s.label} icon={s.icon} started={statsStarted} />
          ))}
        </div>
      </section>

      {/* ══ BENTO GRID — Glassmorphism + Maximalism ══════════ */}
      <section id="features" className="bento-section">
        <div className="section-header">
          <span className="section-label">✦ Platform Features</span>
          <h2 className="section-title">Everything you need to<br /><span className="gradient-text">crack the case</span></h2>
          <p className="section-subtitle">A full investigation toolkit built for speed, security, and results.</p>
        </div>

        <div className="bento-grid">

          <div className="bento-card bento-large reveal-card" ref={el => (bentoRef.current[0] = el)}>
            <div className="bento-glow" style={{ '--gc': '#f5a623' }} />
            <span className="bento-tag" style={{ '--tc': '#f5a623' }}>Most Used</span>
            <div className="bento-icon-wrap" style={{ '--ib': 'rgba(245,166,35,0.13)' }}>
              <span role="img" aria-label="Case">📋</span>
            </div>
            <h3>Smart Case Filing</h3>
            <p>AI-assisted reporting with photo uploads, precise location pinning, and intelligent auto-categorization — go live in under 60 seconds.</p>
            <Link to={isLoggedIn ? "/report" : "/login"} className="bento-cta" style={{ '--lc': '#f5a623' }}>File a Report →</Link>
            <div className="bento-deco" />
          </div>

          <div className="bento-card bento-medium reveal-card" ref={el => (bentoRef.current[1] = el)}>
            <div className="bento-glow" style={{ '--gc': '#00c9a7' }} />
            <span className="bento-tag" style={{ '--tc': '#00c9a7' }}>Powerful</span>
            <div className="bento-icon-wrap" style={{ '--ib': 'rgba(0,201,167,0.13)' }}>
              <span role="img" aria-label="Search">🔍</span>
            </div>
            <h3>Live Evidence Search</h3>
            <p>Real-time database with advanced filters — match by category, location, date, and keywords.</p>
            <Link to={isLoggedIn ? "/browse" : "/login"} className="bento-cta" style={{ '--lc': '#00c9a7' }}>Search Now →</Link>
          </div>

          <div className="bento-card bento-small reveal-card" ref={el => (bentoRef.current[2] = el)}>
            <div className="bento-glow" style={{ '--gc': '#a78bfa' }} />
            <div className="bento-icon-wrap" style={{ '--ib': 'rgba(167,139,250,0.13)' }}>
              <span role="img" aria-label="Claim">🤝</span>
            </div>
            <h3>Verified Claims</h3>
            <p>Secure identity checks ensure only rightful owners reclaim belongings.</p>
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="bento-cta" style={{ '--lc': '#a78bfa' }}>Verify Claim →</Link>
          </div>

          <div className="bento-card bento-small reveal-card" ref={el => (bentoRef.current[3] = el)}>
            <div className="bento-glow" style={{ '--gc': '#f97316' }} />
            <div className="bento-icon-wrap" style={{ '--ib': 'rgba(249,115,22,0.13)' }}>
              <span role="img" aria-label="Alerts">🔔</span>
            </div>
            <h3>Instant Alerts</h3>
            <p>Get notified the moment a match surfaces for your lost item.</p>
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="bento-cta" style={{ '--lc': '#f97316' }}>Set Alert →</Link>
          </div>

          <div className="bento-card bento-medium reveal-card" ref={el => (bentoRef.current[4] = el)}>
            <div className="bento-glow" style={{ '--gc': '#22d3ee' }} />
            <span className="bento-tag" style={{ '--tc': '#22d3ee' }}>Visual</span>
            <div className="bento-icon-wrap" style={{ '--ib': 'rgba(34,211,238,0.13)' }}>
              <span role="img" aria-label="Map">🗺️</span>
            </div>
            <h3>Location Heatmap</h3>
            <p>Visual map overlay showing hotspots for lost &amp; found reports near you in real-time.</p>
            <Link to={isLoggedIn ? "/browse" : "/login"} className="bento-cta" style={{ '--lc': '#22d3ee' }}>View Map →</Link>
          </div>

        </div>
      </section>

      {/* ══ HOW IT WORKS — Claymorphism ══════════════════════ */}
      <section id="process" className="how-it-works-section">
        <div className="section-header">
          <span className="section-label">✦ The Investigation Process</span>
          <h2 className="section-title">How to <span className="gradient-text">crack the case</span></h2>
          <p className="section-subtitle">Three focused steps to close the case and reclaim what's yours.</p>
        </div>

        <div className="steps-grid">
          {[
            { n: '01', icon: '📋', title: 'File a Report',       pill: 'Start Here',    desc: 'Provide the clues. Upload photos, write detailed descriptions, and pinpoint the last known location — every detail counts.', path: '/report' },
            { n: '02', icon: '🔎', title: 'Investigate Leads',   pill: 'Dig Deep',      desc: 'Search our live database. Advanced filters let you match descriptions, categories, and locations to track down your belongings.', path: '/browse' },
            { n: '03', icon: '🤝', title: 'Close the Case',      pill: 'Case Closed ✓', desc: 'Submit a secure claim to verify ownership. Recover your item and mark the investigation officially solved.', path: '/dashboard' },
          ].map((step, i) => (
            <div
              key={step.n}
              className="step-card clay-card reveal-card"
              ref={el => (stepRefs.current[i] = el)}
              style={{ '--delay': `${i * 0.12}s` }}
            >
              <div className="step-num">{step.n}</div>
              <div className="step-icon-clay">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              <Link to={isLoggedIn ? step.path : "/login"} className="step-pill-link">
                <div className="step-pill">{step.pill}</div>
              </Link>
              {i < 2 && <div className="step-connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS — Infinite scroll strip ════════════ */}
      <section className="testimonials-section" aria-label="Testimonials">
        <div className="testimonials-track">
          <div className="testimonials-slide">
            {[
              { text: '"Found my laptop in 2 days. Absolute magic."',          name: 'Priya S.',  role: 'Student' },
              { text: '"Reported 14 items for our community. All recovered!"',  name: 'Mark T.',   role: 'Volunteer' },
              { text: '"The fastest lost & found I\'ve ever used."',            name: 'Aisha K.',  role: 'Traveler' },
              { text: '"My wallet was back in 48 hours. Incredible."',          name: 'James R.',  role: 'Professional' },
              { text: '"Staff uses Findora daily. Game changer."',              name: 'Dr. Chen',  role: 'University Admin' },
              { text: '"Found my camera after 3 weeks. Unbelievable!"',         name: 'Sofia M.',  role: 'Photographer' },
              { text: '"Found my laptop in 2 days. Absolute magic."',          name: 'Priya S.',  role: 'Student' },
              { text: '"Reported 14 items for our community. All recovered!"',  name: 'Mark T.',   role: 'Volunteer' },
              { text: '"The fastest lost & found I\'ve ever used."',            name: 'Aisha K.',  role: 'Traveler' },
              { text: '"My wallet was back in 48 hours. Incredible."',          name: 'James R.',  role: 'Professional' },
              { text: '"Staff uses Findora daily. Game changer."',              name: 'Dr. Chen',  role: 'University Admin' },
              { text: '"Found my camera after 3 weeks. Unbelievable!"',         name: 'Sofia M.',  role: 'Photographer' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card" aria-hidden={i >= 6}>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <strong className="testimonial-name">{t.name}</strong>
                  <span className="testimonial-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA — Liquid Glass ═══════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-liquid-card">
          <div className="cta-orb cta-orb-1" aria-hidden="true" />
          <div className="cta-orb cta-orb-2" aria-hidden="true" />
          <div className="cta-orb cta-orb-3" aria-hidden="true" />
          <div className="cta-inner">
            <span className="section-label">✦ Ready to Begin?</span>
            <h2 className="cta-title">
              Start your<br /><span className="gradient-text">investigation today</span>
            </h2>
            <p className="cta-desc">
              Join 12,000+ detectives already using Findora. Free to use. No case too small.
            </p>
            <div className="hero-actions">
              <Link to={isLoggedIn ? "/dashboard" : "/register"} id="cta-register-btn" className="btn btn-primary btn-glow">
                🕵️ Join Findora — It's Free
              </Link>
              <Link to={isLoggedIn ? "/dashboard" : "/login"} id="cta-login-btn" className="btn btn-glass">
                Sign In
              </Link>
            </div>
            <p className="cta-footnote">No credit card required · Free forever · Instant access</p>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
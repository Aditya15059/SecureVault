import { useNavigate } from 'react-router-dom';
import '../pages/Web3Landing.css';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AntigravityParticles } from './ui/AntigravityParticles';
import { AntigravityElement } from './ui/AntigravityElement';

gsap.registerPlugin(ScrollTrigger);

/* ── Chevron-down SVG icon (14×14) ── */
const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Pill Button component ── */
const PillButton = ({ children, variant = 'dark', className = '', onClick, ...props }) => (
  <AntigravityElement strength={20} radius={150}>
    <button className={`w3-pill-btn w3-pill-btn--${variant} ${className}`} onClick={onClick} {...props}>
      <span className="w3-pill-inner">{children}</span>
    </button>
  </AntigravityElement>
);

/* ── Nav Link ── */
const NavLink = ({ label, href }) => (
  <a href={href || '#'} className="w3-nav-link">
    {label}
    <ChevronDown />
  </a>
);

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4';

const Web3Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the whole hero while scaling content
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
        scale: 0.85,
        opacity: 0,
        y: -100,
        ease: 'power2.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w3-hero-root" ref={heroRef} style={{ position: 'relative' }}>
      {/* ---------- Visual Layers ---------- */}
      <div className="w3-bg-overlay" />
      <div className="w3-grid-warp" />
      
      {/* Antigravity Particles Layer inserted between background graphics and HUD */}
      <AntigravityParticles count={30} />
      
      {/* ---------- HUD / System Specs (New Feature) ---------- */}
      <div className="w3-hud-layer">
        <div className="w3-hud-corner w3-hud-tl">
          <span className="w3-hud-label">// SYSTEM_ORCHESTRATION</span>
          <span className="w3-hud-value">STATUS: ACTIVE_VAULT</span>
        </div>
        <div className="w3-hud-corner w3-hud-tr">
          <span className="w3-hud-label">Uptime: 99.998%</span>
          <div className="w3-hud-bars">
            <div className="w3-hud-bar" style={{ height: '40%' }}></div>
            <div className="w3-hud-bar" style={{ height: '70%' }}></div>
            <div className="w3-hud-bar" style={{ height: '50%' }}></div>
          </div>
        </div>
        <div className="w3-hud-corner w3-hud-bl">
          <span className="w3-hud-label">ENCRYPTION_PROTOCOL</span>
          <span className="w3-hud-value">AES-256-GCM / X25519</span>
        </div>
        <div className="w3-hud-corner w3-hud-br">
          <span className="w3-hud-label">CLOUD_NODE_LINKED</span>
          <span className="w3-hud-value">SECURE_VAULT_v3.2.0</span>
        </div>
      </div>

      <div className="w3-vignette" />
      <div className="w3-grain-overlay" />
      
      {/* -------- Navbar -------- */}
      <nav className="w3-navbar w3-navbar-animate">
        <div className="w3-nav-left">
          {/* Logo wordmark */}
          <div className="w3-logo">
            <svg width="187" height="25" viewBox="0 0 187 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="19" fill="white" fontFamily="'General Sans', sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.08em">SECUREVAULT</text>
            </svg>
          </div>

          {/* Nav links — hidden on mobile via CSS */}
          <div className="w3-nav-links">
            <NavLink label="Features" href="#features" />
            <NavLink label="Security" href="#security" />
            <NavLink label="How It Works" href="#how-it-works" />
            <NavLink label="Docs" href="#docs" />
          </div>
        </div>

        {/* Right — CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <PillButton variant="dark" onClick={() => navigate('/login')}>Sign In</PillButton>
          <PillButton variant="light" onClick={() => navigate('/register')}>Get Started</PillButton>
        </div>
      </nav>

      {/* -------- Hero Content -------- */}
      <section className="w3-hero-content" ref={contentRef}>
        {/* Badge pill */}
        <div className="w3-badge w3-animate-in w3-delay-1">
          <span className="w3-badge-dot" />
          <span className="w3-badge-text">AI-Powered Secret Communication</span>
          <span className="w3-badge-date">&nbsp;Secured by Cloud</span>
        </div>

        {/* Heading (Feature 03) */}
        <h1 className="hero-heading-oversized w3-animate-in w3-delay-2">
          Hiding <span className="two-tone-text">Secrets</span> in Plain Sight
        </h1>

        {/* Subtitle */}
        <p className="w3-subtitle w3-animate-in w3-delay-3">
          SecureVault combines advanced steganography, AI-driven threat detection, 
          and military-grade encryption to protect your communications — invisible 
          to everyone except those who matter.
        </p>

        {/* CTA */}
        <div className="w3-animate-in w3-delay-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <AntigravityElement strength={40} radius={250}>
            <button className="btn" onClick={() => navigate('/register')}>Start Secure Now</button>
          </AntigravityElement>
          <AntigravityElement strength={30} radius={200}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => navigate('/login')}>Sign In →</button>
          </AntigravityElement>
        </div>
      </section>
    </div>
  );
};

export default Web3Hero;

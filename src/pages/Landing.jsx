import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Web3Hero from '../components/Web3Hero';
import { AntigravityElement } from '../components/ui/AntigravityElement';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { GlowCardGrid } from '../components/ui/GlowCardGrid';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────── Feature Card ─────────── */
const FeatureCard = ({ icon, title, description, delay }) => (
  <AntigravityElement strength={25} radius={200} style={{ display: 'block', height: '100%' }}>
    <SpotlightCard glowColor="purple" size="lg" style={{ height: '100%', padding: '1rem', boxSizing: 'border-box' }}>
      <div className="lp-feature-icon" style={{ background: 'rgba(124,58,237,0.1)' }}>{icon}</div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{description}</p>
    </SpotlightCard>
  </AntigravityElement>
);

/* ─────────── Step Card ─────────── */
const StepCard = ({ number, title, description }) => (
  <div className="lp-step">
    <div className="lp-step-number">{number}</div>
    <div className="lp-step-content">
      <h4 className="lp-step-title">{title}</h4>
      <p className="lp-step-desc">{description}</p>
    </div>
  </div>
);

/* ─────────── Stat Item ─────────── */
const Stat = ({ value, label }) => (
  <div className="lp-stat">
    <span className="lp-stat-value">{value}</span>
    <span className="lp-stat-label">{label}</span>
  </div>
);

/* ─────────── Main Landing Page ─────────── */
const Landing = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const containerRef = useRef(null);
  
  // --- Tech Specs Slider State ---
  const [activeSpec, setActiveSpec] = useState(0);
  const [specDir, setSpecDir] = useState('next');

  const techFeatures = [
    { tag: "AI NEURAL SHIELD", icon: "🧠", desc: "TensorFlow-powered anomaly detection identifies steganographic fingerprint signatures with 99% accuracy.", stat: "Active Detectors", value: "1.2k" },
    { tag: "LSB ANALYSIS ENGINE", icon: "⬛", desc: "Examines Least Significant Bits across all colour channels to detect hidden data insertion patterns.", stat: "Bits Scanned/sec", value: "4.8M" },
    { tag: "SPECTRAL TRIAGE", icon: "〰️", desc: "Multi-spectral scanning detects noise inconsistencies invisible to the human eye but clear to our AI.", stat: "Spectrum Layers", value: "12" },
    { tag: "AES-256 ENCRYPTION", icon: "🔐", desc: "Military-grade AES-256-CBC encryption with unique per-message keys. Zero knowledge architecture.", stat: "Encryption Strength", value: "256-bit" },
    { tag: "AWS KMS VAULT", icon: "🗝️", desc: "Hardware Security Module-backed key management via AWS KMS. Keys never touch our servers.", stat: "Key Rotation", value: "Auto" },
  ];

  const goNextSpec = () => {
    setSpecDir('next');
    setActiveSpec(i => (i + 1) % techFeatures.length);
  };

  const goPrevSpec = () => {
    setSpecDir('prev');
    setActiveSpec(i => (i - 1 + techFeatures.length) % techFeatures.length);
  };

  useEffect(() => {
    const t = setInterval(goNextSpec, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') goNextSpec();
      if (e.key === 'ArrowLeft') goPrevSpec();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  let touchStartX = 0;
  const onTouchStart = e => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) goNextSpec();
    if (diff < -50) goPrevSpec();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal Feature Cards - More dramatic
      gsap.from('.lp-feature-card', {
        scrollTrigger: {
          trigger: '.lp-features-grid',
          start: 'top 85%',
        },
        y: 100,
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out',
      });

      // Reveal Section Titles - Move up + Fade
      gsap.from('.lp-section-header', {
        scrollTrigger: {
          trigger: '.lp-section-header',
          start: 'top 90%',
        },
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      });

      // Diagram Animation - Sweep in
      gsap.from('.lp-arch-node', {
        scrollTrigger: {
          trigger: '.lp-arch-diagram',
          start: 'top 85%',
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: '🔐',
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption ensures your messages are completely secure before being embedded.',
    },
    {
      icon: '🖼️',
      title: 'LSB Steganography',
      description: 'Embeds your encrypted messages invisibly within image carrier files using optimized LSB techniques.',
    },
    {
      icon: '🤖',
      title: 'AI Steganalysis',
      description: 'Advanced machine learning models analyze incoming payloads for hidden threats instantly.',
    }
  ];

  const steps = [
    { number: '01', title: 'Create Your Vault', description: 'Register and receive your unique encrypted key-pair, secured by AWS KMS.' },
    { number: '02', title: 'Compose Your Message', description: 'Write your secret payload and our AI selects the optimal steganography strategy.' },
    { number: '03', title: 'Encode & Transmit', description: 'Your message is invisibly embedded into a carrier image and end-to-end encrypted.' },
    { number: '04', title: 'Recipient Decodes', description: 'The recipient opens SecureVault, the AI extracts and decrypts your hidden message.' },
  ];

  const faqs = [
    { q: 'What is steganography?', a: 'Steganography is the practice of hiding information within a non-secret carrier — like embedding a text message inside an image\'s pixel data, invisible to the naked eye.' },
    { q: 'How does AI detection work?', a: 'Our ML model analyses image fingerprints, statistical anomalies, and noise patterns to detect hidden payloads — alerting you to suspicious content before you open it.' },
    { q: 'Is my data stored on your servers?', a: 'All content is encrypted client-side before upload. Only you hold decryption keys, stored in AWS KMS under your account. We can never read your messages.' },
    { q: 'Can I use SecureVault on mobile?', a: 'SecureVault is fully responsive and works on any modern mobile browser. A native app is on our roadmap.' },
  ];

  return (
    <div className="lp-root">
      {/* ═══════════ SECTION 1: Web3 Hero ═══════════ */}
      <Web3Hero />

      {/* ═══════════ NEW: TECH SPECIFICATIONS (TWO COLUMN STACK) ═══════════ */}
      <section className="w3-tech-specs" style={{ height: 'auto', padding: '120px 0' }}>
        <div className="w3-slide-bg-text">SPECIFICATIONS</div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px', padding: '0 2rem', position: 'relative', zIndex: 10, alignItems: 'center' }}>
          
          {/* LEFT COLUMN: Controls & Text */}
          <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
            <span className="lp-section-badge">CORE INFRASTRUCTURE</span>
            <h2 className="lp-section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>The <span className="lp-gradient-text">Engine</span> Behind SecureVault</h2>
            <p className="lp-section-subtitle" style={{ textAlign: 'left', margin: '0 0 32px 0' }}>
              Swipe through the modular layers of our high-fidelity security stack.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2rem' }}>
              <button onClick={goPrevSpec} style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid rgba(124,58,237,0.4)',
                background: 'rgba(124,58,237,0.1)',
                color: '#a78bfa', fontSize: '18px', cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>←</button>

              {techFeatures.map((_, i) => (
                <div key={i} onClick={() => setActiveSpec(i)} style={{
                  width: i === activeSpec ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === activeSpec
                    ? 'linear-gradient(90deg,#7c3aed,#3b82f6)'
                    : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }} />
              ))}

              <button onClick={goNextSpec} style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid rgba(124,58,237,0.4)',
                background: 'rgba(124,58,237,0.1)',
                color: '#a78bfa', fontSize: '18px', cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>→</button>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '16px', fontWeight: 'bold' }}>
              {String(activeSpec + 1).padStart(2, '0')} / {String(techFeatures.length).padStart(2, '0')}
            </p>
          </div>

          {/* RIGHT COLUMN: Auto-Animated Slider */}
          <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '260px', overflow: 'hidden' }}>
            <div 
              key={activeSpec} 
              className={`card-enter-${specDir}`} 
              onTouchStart={onTouchStart} 
              onTouchEnd={onTouchEnd}
              style={{
                background: 'rgba(20, 13, 48, 0.8)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                padding: '2rem',
                boxShadow: '0 0 40px rgba(124,58,237,0.15)',
                minHeight: '220px',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start'
              }}
            >
              <div className="w3-spec-icon">{techFeatures[activeSpec].icon}</div>
              <div className="w3-spec-info">
                <h4 className="w3-spec-title">{techFeatures[activeSpec].tag}</h4>
                <p className="w3-spec-desc">{techFeatures[activeSpec].desc}</p>
                <div className="w3-spec-stat">{techFeatures[activeSpec].stat}: {techFeatures[activeSpec].value}</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ═══════════ SECTION 2: Stats Bar ═══════════ */}
      <section className="lp-stats-bar">
        <div className="lp-stats-inner">
          <Stat value="256-bit" label="Encryption Standard" />
          <div className="lp-stat-divider" />
          <Stat value="< 50ms" label="Processing Latency" />
          <div className="lp-stat-divider" />
          <Stat value="99.9%" label="Uptime SLA" />
          <div className="lp-stat-divider" />
          <Stat value="0-Trust" label="Security Model" />
        </div>
      </section>

      {/* ═══════════ SECTION 3: Features ═══════════ */}
      <section id="features" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <span className="lp-section-badge">CAPABILITIES</span>
            <h2 className="lp-section-title">Everything You Need to <span className="lp-gradient-text">Communicate Securely</span></h2>
            <p className="lp-section-subtitle">
              A unified platform combining steganography, encryption, and AI detection — 
              powered by enterprise cloud infrastructure.
            </p>
          </div>

          <GlowCardGrid columns={3}>
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={0.1 * i} />
            ))}
          </GlowCardGrid>
        </div>
      </section>

      {/* ═══════════ SECTION 4: How It Works ═══════════ */}
      <section id="how-it-works" className="lp-section lp-section--alt">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <span className="lp-section-badge">WORKFLOW</span>
            <h2 className="lp-section-title">How <span className="lp-gradient-text">SecureVault</span> Works</h2>
            <p className="lp-section-subtitle">
              Four simple steps to hide, send, and receive a message — completely invisible to the outside world.
            </p>
          </div>

          <div className="lp-steps-track">
            {steps.map((s) => (
              <StepCard key={s.number} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 5: Security Deep Dive ═══════════ */}
      <section id="security" className="lp-section">
        <div className="lp-section-inner lp-security-split">
          {/* Left: text */}
          <div className="lp-security-text">
            <span className="lp-section-badge">ZERO-TRUST SECURITY</span>
            <h2 className="lp-section-title" style={{ textAlign: 'left', maxWidth: '480px' }}>
              Engineered for <span className="lp-gradient-text">Paranoid-Level</span> Privacy
            </h2>
            <p className="lp-section-subtitle" style={{ textAlign: 'left', maxWidth: '440px' }}>
              We don't just encrypt — we make your messages structurally undetectable. 
              Even if someone intercepts your image, they see nothing suspicious.
            </p>
            <ul className="lp-security-list">
              {[
                'AES-256-GCM + RSA-4096 dual-layer encryption',
                'LSB steganography with randomised pixel selection',
                'On-device ML anomaly detector (TensorFlow Lite)',
                'AWS KMS envelope key management',
                'End-to-end encrypted image pipeline',
                'Real-time stego-attack detection & alerts',
              ].map((item) => (
                <li key={item} className="lp-security-item">
                  <span className="lp-security-check">✓</span> {item}
                </li>
              ))}
            </ul>
            <button className="lp-cta-btn" onClick={() => navigate('/register')}>
              Start Protecting Now
            </button>
          </div>

          {/* Right: visual diagram */}
          <div className="lp-security-visual">
            <div className="lp-arch-diagram">
              {[
                { label: 'Your Message', color: '#ffffff', icon: '✉️' },
                { label: 'AES-256 Encrypt', color: '#7c3aed', icon: '🔐' },
                { label: 'Steganography Embed', color: '#a855f7', icon: '🖼️' },
                { label: 'Secure Transmit', color: '#3b82f6', icon: '📡' },
                { label: 'AI Decode & Verify', color: '#7c3aed', icon: '🤖' },
              ].map((node, i) => (
                <React.Fragment key={node.label}>
                  <div className="lp-arch-node" style={{ borderColor: node.color, boxShadow: `0 0 20px ${node.color}33` }}>
                    <span className="lp-arch-icon">{node.icon}</span>
                    <span className="lp-arch-label" style={{ color: node.color }}>{node.label}</span>
                  </div>
                  {i < 4 && <div className="lp-arch-arrow">↓</div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 6: FAQ ═══════════ */}
      <section className="lp-section lp-section--alt">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <span className="lp-section-badge">FAQ</span>
            <h2 className="lp-section-title">Got <span className="lp-gradient-text">Questions?</span></h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`lp-faq-item ${activeFaq === i ? 'lp-faq-item--open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="lp-faq-q">
                  {faq.q}
                  <span className="lp-faq-icon">{activeFaq === i ? '−' : '+'}</span>
                </div>
                {activeFaq === i && <p className="lp-faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 7: Final CTA ═══════════ */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow lp-cta-glow--left" />
        <div className="lp-cta-glow lp-cta-glow--right" />
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">Ready to <span className="lp-gradient-text">Go Invisible?</span></h2>
          <p className="lp-cta-subtitle">
            Join thousands of users who protect their communications with SecureVault. 
            No subscription required for basic access.
          </p>
          <div className="lp-cta-actions">
            <button className="lp-cta-btn lp-cta-btn--primary" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
            <button className="lp-cta-btn lp-cta-btn--ghost" onClick={() => navigate('/login')}>
              Sign In →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-footer-logo">SecureVault</span>
          </div>
          <div className="lp-footer-links">
            <span>&copy; {new Date().getFullYear()} SECUREVAULT ENGINE. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

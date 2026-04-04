import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, User, Zap, ArrowRight, ArrowLeft, Eye, EyeOff, LockKeyhole, LockKeyholeOpen, KeyRound } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import { TypewriterText } from '../components/animations/TypewriterText';
import { KineticButton } from '../components/animations/KineticButton';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const getStrength = (pass) => {
    let s = 0;
    if (pass.length > 5) s += 25;
    if (pass.length >= 8) s += 25;
    if (/[A-Z]/.test(pass)) s += 25;
    if (/[!@#$%^&*0-9]/.test(pass)) s += 25;
    return s;
  };

  const strength = getStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const stepIcons = [
    { icon: <User size={14} />, label: 'Identity' },
    { icon: <KeyRound size={14} />, label: 'Security' },
  ];

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground particleCount={60} />
      
      <div style={{ 
        position: 'absolute', width: '600px', height: '600px', 
        background: 'radial-gradient(circle, var(--color-tertiary-dim) 0%, transparent 60%)', 
        filter: 'blur(90px)', borderRadius: '50%', top: '40%', left: '40%', opacity: 0.8,
        animation: 'glowPulse 10s ease-in-out infinite alternate'
      }}></div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          <TypewriterText text="NEW" showCursor={false} style={{ color: 'var(--color-text)' }} />
          <TypewriterText text=" NODE" delay={400} className="text-neon" />
        </h1>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 1.0, type: 'spring' }}
        className="glass-panel-elevated" style={{ 
        width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', 
        position: 'relative', zIndex: 10,
        border: '1px solid var(--color-primary-dim)',
      }}>
        
        {/* Step Progress Bar with Icons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', alignItems: 'center' }}>
          {stepIcons.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > i ? 'var(--color-primary)' : 'var(--color-surface-container-lowest)',
                color: step > i ? '#000' : 'var(--color-text-dim)',
                border: step === i + 1 ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}>
                {step > i + 1 ? <ShieldCheck size={14} /> : s.icon}
              </div>
              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: step >= i + 1 ? 'var(--color-primary)' : 'var(--color-text-dim)', fontWeight: 600 }}>{s.label}</span>
              <div style={{ width: '100%', height: '3px', background: step > i ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.3s' }}></div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" onSubmit={handleNext} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Master Codename</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} className="icon-cyber" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                  <input type="text" className="input-control" placeholder="operator_7" style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.3)' }} required />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                <label>Secure Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="icon-cyber" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                  <input type="email" className="input-control" placeholder="operator@securevault.io" style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.3)' }} required />
                </div>
              </div>

              <KineticButton type="submit" style={{ width: '100%', padding: '1.1rem' }}>
                Continue to Security <ArrowRight size={18} />
              </KineticButton>
            </motion.form>
          ) : (
            <motion.form key="step2" onSubmit={handleRegister} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <ArrowLeft size={16} /> Back
              </button>

              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label>Master Password</label>
                <div style={{ position: 'relative' }}>
                  <motion.div 
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: passwordFocused ? 'var(--color-primary)' : 'var(--color-text-dim)', zIndex: 2 }}
                    animate={{ scale: passwordFocused ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {passwordFocused ? <LockKeyholeOpen size={16} className="icon-glow-pulse" /> : <LockKeyhole size={16} />}
                  </motion.div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="input-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ paddingLeft: '2.5rem', paddingRight: '3rem', background: 'rgba(0,0,0,0.3)' }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} className="icon-cyber" /> : <Eye size={16} className="icon-cyber" />}
                  </button>
                </div>
                
                {/* Strength Meter */}
                {password && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
                      <span>Security Grade</span>
                      {strength < 50 ? <span>Weak</span> : strength < 100 ? <span>Moderate</span> : <span style={{color: 'var(--color-primary)'}}>Cryptographic</span>}
                    </div>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                        transition={{ ease: 'easeOut' }}
                        style={{ height: '100%', background: strength < 50 ? 'var(--color-danger)' : strength < 100 ? '#eab308' : 'var(--color-primary)' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                <label>Verify Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                  <input 
                    type={showConfirm ? 'text' : 'password'} 
                    className="input-control" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ 
                      paddingLeft: '2.5rem', paddingRight: '3rem',
                      background: 'rgba(0,0,0,0.3)', 
                      borderBottomColor: confirmPassword && !passwordsMatch ? 'var(--color-danger)' : confirmPassword && passwordsMatch ? 'var(--color-primary)' : 'var(--color-outline-variant)' 
                    }}
                    required 
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                    {showConfirm ? <EyeOff size={16} className="icon-cyber" /> : <Eye size={16} className="icon-cyber" />}
                  </button>
                </div>
                {confirmPassword && passwordsMatch && (
                  <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} className="icon-bounce" /> Signatures Match
                  </motion.span>
                )}
              </div>

              <KineticButton type="submit" loading={loading} disabled={!passwordsMatch || strength < 50} style={{ width: '100%', padding: '1.1rem' }}>
                Initialize Vault <Zap size={18} fill="currentColor" />
              </KineticButton>
            </motion.form>
          )}
        </AnimatePresence>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
            Already have a vault? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, borderBottom: '1px solid' }}>Authenticate</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

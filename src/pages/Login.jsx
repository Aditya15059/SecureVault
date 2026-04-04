import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, LockKeyholeOpen, Shield, Zap, Eye, EyeOff, Mail } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import { TypewriterText } from '../components/animations/TypewriterText';
import { KineticButton } from '../components/animations/KineticButton';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

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
          <TypewriterText text="SECURE" showCursor={false} style={{ color: 'var(--color-text)' }} />
          <TypewriterText text="VAULT" delay={600} className="text-neon" />
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: 0.8 }}>
          <Zap size={14} color="var(--color-secondary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-secondary)' }}>Operator Uplink</span>
          <Zap size={14} color="var(--color-secondary)" />
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 1.2, type: 'spring', damping: 25 }}
        className="glass-panel-elevated" style={{ 
        width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', 
        position: 'relative', zIndex: 10,
        border: '1px solid var(--color-primary-dim)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        
        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Secure Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input 
                type="email" 
                className="input-control" 
                placeholder="operator@securevault.io" 
                style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.3)' }}
                required 
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <label>Master Password</label>
              <a href="#" style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              {/* Animated LockKeyhole */}
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
                placeholder="••••••••" 
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem', background: 'rgba(0,0,0,0.3)' }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} className="icon-cyber" /> : <Eye size={16} className="icon-cyber" />}
              </button>
            </div>
          </div>

          <KineticButton type="submit" loading={loading} style={{ 
            width: '100%', padding: '1.1rem', fontSize: '1.05rem', letterSpacing: '0.05em'
          }}>
            <Zap size={18} fill="currentColor" /> Initialize Session
          </KineticButton>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
            Unregistered operator? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, borderBottom: '1px solid' }}>Deploy new vault</Link>
          </p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }} style={{ 
        marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', 
        fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em'
      }}>
        <Shield size={14} className="text-neon" />
        <span>CYBERPUNK PROTOCOL v3.0 ACTIVE</span>
      </motion.div>

    </div>
  );
};

export default Login;

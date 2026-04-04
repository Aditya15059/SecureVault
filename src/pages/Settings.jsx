import React, { useState, useEffect } from 'react';
import { User, Mail, KeyRound, Cloud, CheckCircle2, Save, Eye, EyeOff, Shield, BrainCircuit, CloudCog } from 'lucide-react';
import { Fingerprint } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { KineticButton } from '../components/animations/KineticButton';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [score, setScore] = useState(0);
  const targetScore = 98;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        if (prev >= targetScore) {
          clearInterval(interval);
          return targetScore;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1000);
  };

  const systemStatus = [
    { icon: <Fingerprint size={22} weight="duotone" />, label: 'Identity Auth', status: 'Active', color: 'var(--color-primary)' },
    { icon: <CloudCog size={20} />, label: 'Cloud Config', status: 'Connected', color: 'var(--color-secondary)' },
    { icon: <BrainCircuit size={20} />, label: 'AI Engine', status: 'Running', color: 'var(--color-success)' },
  ];

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <header style={{ marginBottom: '2.5rem' }}>
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Profile Settings</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-dim">Manage your operator identity and monitor system status.</motion.p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) minmax(300px, 0.8fr)', gap: '2.5rem' }}>
        
        {/* Left Col - Operator Profile */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card" style={{ height: 'fit-content' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 25px var(--color-primary-glow)',
            }}>
              <User size={28} color="#000" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Operator Profile</h2>
              <p className="text-dim" style={{ fontSize: '0.8125rem', margin: 0 }}>Update your terminal credentials</p>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label>Codename / Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} className="icon-cyber" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input type="text" className="input-control" defaultValue="Agent007" style={{ paddingLeft: '2.75rem', background: 'rgba(0,0,0,0.2)' }} />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} className="icon-cyber" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input type="email" className="input-control" defaultValue="agent@secure.sys" style={{ paddingLeft: '2.75rem', background: 'rgba(0,0,0,0.2)' }} />
              </div>
            </div>

            <div className="input-group">
              <label>Reset Master Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={15} className="icon-cyber" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input type={showPassword ? 'text' : 'password'} className="input-control" placeholder="Update password..." style={{ paddingLeft: '2.75rem', paddingRight: '3rem', background: 'rgba(0,0,0,0.2)' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={16} className="icon-cyber" /> : <Eye size={16} className="icon-cyber" />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <KineticButton loading={loading} success={saved} type="submit" style={{ padding: '0.8rem 2rem' }}>
                <Save size={16} className="icon-cyber" /> Update Profile
              </KineticButton>
            </div>
          </form>
        </motion.section>

        {/* Right Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Security Score Widget */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Terminal Security Score</h3>
            
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <motion.circle 
                  cx="80" cy="80" r={radius} 
                  fill="none" stroke="var(--color-primary)" 
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - (targetScore / 100) * circumference }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ filter: 'drop-shadow(0 0 8px var(--color-primary-glow))' }}
                />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Shield size={24} color="var(--color-primary)" className="icon-glow-pulse" style={{ marginBottom: '4px' }} />
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{score}</span>
              </div>
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
              Excellent Protocol Grade
            </p>
          </motion.section>

          {/* System Status - Unique Icons */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Live Protocols</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {systemStatus.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i !== systemStatus.length - 1 ? '1px solid var(--color-outline)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-cyber" style={{ 
                      width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
                      background: `${item.color}15`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.label}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.6rem', background: 'rgba(57, 255, 20, 0.08)', borderRadius: 'var(--radius-full)' }}>
                    <div className="status-orb status-orb--active"></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default Settings;

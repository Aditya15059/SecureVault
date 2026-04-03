import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Key, User } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: '#3b82f6', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', zIndex: -1 }}></div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--color-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 15px var(--color-primary-dim)' }}>
            <ShieldCheck size={24} color="#000" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Initialize <span className="text-neon">Account</span></h1>
          <p className="text-dim">Generate your encryption keys & access profile.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="input-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input type="text" className="input-control" placeholder="Agent007" style={{ paddingLeft: '2.75rem' }} required />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input type="email" className="input-control" placeholder="agent@secure.sys" style={{ paddingLeft: '2.75rem' }} required />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Master Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input type="password" className="input-control" placeholder="••••••••" style={{ paddingLeft: '2.75rem' }} required />
            </div>
            {/* Password strength indicator mock */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--color-success)', borderRadius: '2px' }}></div>
              <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--color-success)', borderRadius: '2px' }}></div>
              <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--color-bg-border)', borderRadius: '2px' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Strong password required.</span>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', padding: '0.875rem', fontSize: '1.125rem' }}>
            Create Secure Profile
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-bg-border)' }}>
          <p className="text-dim" style={{ fontSize: '0.875rem' }}>
            Already have clearance? <Link to="/login" style={{ fontWeight: 600 }}>Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

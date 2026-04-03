import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Key } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Background shape */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'var(--color-primary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', zIndex: -1 }}></div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--color-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 15px var(--color-primary-dim)' }}>
            <Lock size={24} color="#000" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Access <span className="text-neon">Vault</span></h1>
          <p className="text-dim">Enter your credentials to proceed.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="input-group">
            <label>Username or Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input type="text" className="input-control" placeholder="user@example.com" style={{ paddingLeft: '2.75rem' }} required />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <a href="#" style={{ fontSize: '0.875rem' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input type="password" className="input-control" placeholder="••••••••" style={{ paddingLeft: '2.75rem' }} required />
            </div>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', padding: '0.875rem', fontSize: '1.125rem' }}>
            Log In Subsystem
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-bg-border)' }}>
          <p className="text-dim" style={{ fontSize: '0.875rem' }}>
            Don't have an access key? <Link to="/register" style={{ fontWeight: 600 }}>Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

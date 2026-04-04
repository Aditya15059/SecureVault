import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lock, Unlock, Image, ShieldAlert, Settings, LogOut, Fingerprint, Users } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Encrypt Message', path: '/encrypt', icon: <Lock size={20} /> },
    { name: 'Decrypt Message', path: '/decrypt', icon: <Unlock size={20} /> },
    { name: 'Hide in Image', path: '/steganography', icon: <Image size={20} /> },
    { name: 'Detect Stego (AI)', path: '/detection', icon: <ShieldAlert size={20} /> },
    { name: 'Team & About', path: '/about', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        margin: '12px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(6, 14, 32, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--color-outline)',
        position: 'sticky',
        top: '12px',
        height: 'calc(100vh - 24px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary-fixed), var(--color-primary-container))',
            width: '34px', height: '34px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px var(--color-primary-glow)',
          }}>
            <Fingerprint size={18} color="#022100" />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.5px', fontFamily: 'var(--font-display)' }}>
            <span className="text-neon">Secure</span>Vault
          </h2>
        </div>

        {/* Section Label */}
        <p style={{
          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--color-text-dim)', padding: '0 0.5rem', marginBottom: '0.75rem',
        }}>Operations</p>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  backgroundColor: 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9375rem',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none',
                  position: 'relative',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
              >
                <span className={isActive ? 'icon-glow-pulse' : 'icon-cyber'} style={{
                  display: 'flex',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'opacity 0.25s',
                  color: isActive ? 'var(--color-primary)' : 'inherit',
                }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-outline)' }}>
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '0.75rem 0.75rem',
            color: 'var(--color-danger)', fontWeight: 500, fontSize: '0.9375rem',
            opacity: 0.8, transition: 'opacity 0.25s', textDecoration: 'none',
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
          >
            <LogOut size={20} className="icon-cyber" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '12px 12px 12px 0' }}>
        <div style={{
          minHeight: 'calc(100vh - 24px)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          background: 'var(--color-surface-container-low)',
          border: '1px solid var(--color-outline)',
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

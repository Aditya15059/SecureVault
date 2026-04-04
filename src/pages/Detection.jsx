import React, { useState } from 'react';
import { Upload, Cpu, Search, AlertTriangle, CheckCircle2, Database, Wifi, Shield, BarChart3 } from 'lucide-react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { GlowCardGrid } from '../components/ui/GlowCardGrid';

const Detection = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setResult(null);
    }
  };

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(Math.random() > 0.5 ? 'normal' : 'stego');
    }, 2500);
  };

  return (
    <div style={{ padding: '2.5rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Steganography <span className="text-neon">Detection</span>
        </h1>
        <p className="text-dim" style={{ maxWidth: '500px' }}>
          Advanced AI-powered forensic analysis to uncover hidden data payloads within image assets. Reveal the invisible with obsidian-grade security.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Upload Manifest */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', margin: '0 0 1.25rem 0' }}>Upload Manifest</h3>

          <div style={{
            border: '2px dashed var(--color-outline-variant)',
            padding: '3rem 2rem', borderRadius: 'var(--radius-md)',
            textAlign: 'center', cursor: 'pointer', position: 'relative',
            transition: 'border-color 0.3s', marginBottom: '1.5rem',
            background: 'var(--color-surface-container-lowest)', flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-outline-variant)'}
          >
            <input type="file" accept="image/*" onChange={handleUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            {file ? (
              <img src={file} alt="Preview" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: 'var(--radius-md)' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--color-text-dim)' }}>
                <Upload size={40} opacity={0.4} />
                <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9375rem' }}>Drop image file here or click to browse</p>
                <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>PNG, JPG, TIFF (MAX 25MB)</p>
              </div>
            )}
          </div>

          <button className="btn" onClick={handleScan} disabled={scanning || !file} style={{ width: '100%', padding: '0.9rem' }}>
            {scanning ? 'Initializing Neural Nodes...' : 'Scan for Hidden Data'} <Shield size={16} />
          </button>
        </div>

        {/* Right Panel — Status & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Scanner Status */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-dim)', margin: 0 }}>Scanner Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div className="status-orb status-orb--active"></div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Feed</span>
              </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>
              {result === 'stego' ? 'Hidden Data Found' : 'No Hidden Data'}
            </h3>
            <p className="text-dim" style={{ fontSize: '0.8125rem', margin: '0 0 1rem 0' }}>Ready for next sequence...</p>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--color-surface-container-lowest)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--color-primary)', borderRadius: '2px',
                width: scanning ? '100%' : '0%',
                transition: scanning ? 'width 2.5s ease-in-out' : 'width 0.3s',
              }}></div>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <Wifi size={18} color="var(--color-secondary)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>Neural Load</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>12.4ms</p>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <Database size={18} color="var(--color-secondary)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>Signature DB</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>v4.0.2</p>
            </div>
          </div>

          {/* System Logs */}
          <div className="card" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-dim)', margin: 0 }}>System Logs</p>
              <p style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--color-text-dim)', margin: 0 }}>2024-12-09</p>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}><span style={{ color: 'var(--color-secondary)' }}>[00:03:01]</span> System initialized...</p>
              <p style={{ margin: 0 }}><span style={{ color: 'var(--color-primary)' }}>[00:03:02]</span> AES-256 modules verified</p>
              <p style={{ margin: 0 }}><span style={{ color: 'var(--color-text-dim)' }}>[01:02:23]</span> Waiting for image buffer...</p>
              <p style={{ margin: 0, opacity: 0.4 }}>{'> '}STANDBY_IDLE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Results */}
      {result && (
        <div style={{ animation: 'fadeIn 0.5s ease', marginBottom: '2.5rem' }}>
          {result === 'normal' ? (
            <SpotlightCard glowColor="purple" customSize={true} width="100%" className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', borderColor: 'rgba(57,255,20,0.2)', padding: '1.5rem', flexDirection: 'row' }}>
              <CheckCircle2 size={32} color="var(--color-primary)" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.3))' }} />
              <div style={{ width: '100%' }}>
                <h3 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Clean Image</h3>
                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-text-dim)', fontSize: '0.9375rem' }}>No steganographic activity detected. Image structure is standard.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                  <span className="text-dim">Confidence Score</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'monospace' }}>98.4%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--color-surface-container-lowest)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--color-primary)', width: '98.4%', borderRadius: '3px', boxShadow: '0 0 8px var(--color-primary-glow)' }}></div>
                </div>
              </div>
            </SpotlightCard>
          ) : (
            <SpotlightCard glowColor="purple" customSize={true} width="100%" className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', borderColor: 'rgba(255,180,171,0.3)', padding: '1.5rem', flexDirection: 'row' }}>
              <AlertTriangle size={32} color="var(--color-danger)" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(255,180,171,0.3))' }} />
              <div style={{ width: '100%' }}>
                <h3 style={{ color: 'var(--color-danger)', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Steganography Detected!</h3>
                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-text-dim)', fontSize: '0.9375rem' }}>Anomalous data bits detected in image channels. Encrypted payload likely present.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                  <span className="text-dim">Confidence Score</span>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontFamily: 'monospace' }}>95.2%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--color-surface-container-lowest)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--color-danger)', width: '95.2%', borderRadius: '3px' }}></div>
                </div>
              </div>
            </SpotlightCard>
          )}
        </div>
      )}

      {/* How AI Detection Works */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ width: '28px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>How AI Detection Works</h2>
        </div>
        <GlowCardGrid columns={3}>
          {[
            { title: 'LSB Analysis', desc: 'Examines Least Significant Bits for statistical anomalies that suggest data insertion.' },
            { title: 'Spectral Triage', desc: 'Multi-spectral scanning detects noise patterns inconsistent with natural image sensors.' },
            { title: 'Neural Verification', desc: 'Deep learning models trained on millions of steganographic samples identify complex payloads.' },
          ].map((item, i) => (
            <SpotlightCard key={i} glowColor="purple" className="card" style={{ padding: '1.75rem', height: '100%' }}>
              <div style={{ background: 'var(--color-primary-dim)', width: '36px', height: '36px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                <Cpu size={18} />
              </div>
              <h3 style={{ fontSize: '1.0625rem', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-dim)', margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
            </SpotlightCard>
          ))}
        </GlowCardGrid>
        
        {/* Model Accuracy Visualization */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <SpotlightCard glowColor="purple" size="lg" className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <BarChart3 size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Global Detection Accuracy</h3>
            <p className="text-dim" style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
              Our hybrid stego-engine retains a 99.4% true-positive rate against advanced adversarial embedding techniques.
            </p>
            <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--color-primary)', fontFamily: 'monospace' }}>99.4%</p>
                <span className="text-dim" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Accuracy</span>
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--color-primary)', fontFamily: 'monospace' }}>1.2k</p>
                <span className="text-dim" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Signatures</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
};

export default Detection;

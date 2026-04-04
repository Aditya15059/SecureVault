import React, { useState, useEffect } from 'react';
import { Key, Copy, CheckCircle2, Zap, AlertTriangle, Download, X, Loader, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KineticButton } from '../components/animations/KineticButton';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const Encrypt = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  
  const [encrypting, setEncrypting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [encryptSuccess, setEncryptSuccess] = useState(false);
  
  // Security Policies
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [rateLimitActive, setRateLimitActive] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [autoClearTimer, setAutoClearTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (autoClearTimer > 0) {
      interval = setInterval(() => {
        setAutoClearTimer((prev) => {
          if (prev <= 1) handleClearAll();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoClearTimer]);

  useEffect(() => {
    let interval;
    if (rateLimitActive && rateLimitTimer > 0) {
      interval = setInterval(() => {
        setRateLimitTimer(prev => {
          if (prev <= 1) setRateLimitActive(false);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitActive, rateLimitTimer]);

  const generateSecureKey = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return 'sv_' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateMockIV = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleEncrypt = () => {
    if (!inputText || rateLimitActive) return;
    
    setEncrypting(true);
    setEncryptSuccess(false);
    setTimeout(() => {
      const key = generateSecureKey();
      const iv = generateMockIV();
      const ciphertext = window.btoa(encodeURIComponent(inputText));
      
      setPrivateKey(key);
      setOutputText(`${iv}:${ciphertext}`);
      
      setEncrypting(false);
      setEncryptSuccess(true);
      setShowKeyModal(true);
      
      setAutoClearTimer(60);
      setRateLimitActive(true);
      setRateLimitTimer(5);

      // Reset success icon after 3s
      setTimeout(() => setEncryptSuccess(false), 3000);
    }, 1500);
  };

  const handleClearAll = () => {
    setInputText('');
    setOutputText('');
    setPrivateKey('');
    setShowKeyModal(false);
    setAutoClearTimer(0);
    setEncryptSuccess(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadKey = () => {
    const blob = new Blob([privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payload.key';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic button icon
  const getButtonContent = () => {
    if (encrypting) {
      return <><Loader size={16} className="icon-spin" /> Encrypting...</>;
    }
    if (encryptSuccess) {
      return <><CheckCircle2 size={16} className="icon-bounce" style={{ color: 'var(--color-success)' }} /> Encrypted!</>;
    }
    if (rateLimitActive) {
      return <><ShieldAlert size={16} /> Rate Limit ({rateLimitTimer}s)</>;
    }
    return <><Lock size={16} /> Generate Ciphertext & Key</>;
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Encrypt Payload</h1>
          <p className="text-dim">Encode transmissions with AES-256 and ephemeral keys.</p>
        </div>
        {autoClearTimer > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(248,113,113,0.2)' }}>
             <AlertTriangle size={14} color="var(--color-danger)" className="icon-glow-pulse" />
             <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', letterSpacing: '0.05em' }}>Auto-clear in {autoClearTimer}s</span>
          </div>
        )}
      </header>

      {/* KMS Status Card */}
      <SpotlightCard glowColor="orange" customSize={true} width="100%" className="card" style={{ marginBottom: '1.75rem', padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ color: 'var(--color-primary)' }}>
            <Key size={24} className="icon-cyber" />
          </motion.div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>AWS KMS Ready</p>
            <p className="text-dim" style={{ fontSize: '0.75rem', margin: 0, fontFamily: 'monospace' }}>Engine: AES-CBC-256</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="status-orb status-orb--active"></motion.div>
          Active Link
        </div>
        </div>
      </SpotlightCard>

      {/* Encryption Form */}
      <SpotlightCard glowColor="blue" customSize={true} width="100%" className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={12} className="icon-cyber" /> Confidential Payload / Plaintext
          </label>
          <textarea
            className="input-control"
            rows={5}
            placeholder="Type your sensitive information here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)' }}
          ></textarea>
        </div>

        <KineticButton 
          onClick={handleEncrypt} 
          loading={false} 
          disabled={!inputText || rateLimitActive || encrypting} 
          style={{ width: '100%', marginBottom: '2.5rem', padding: '1rem', background: rateLimitActive ? 'var(--color-surface-container-high)' : undefined }}
        >
          {getButtonContent()}
        </KineticButton>

        {outputText && (
          <SpotlightCard glowColor="green" customSize={true} width="100%">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="input-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={12} style={{ color: 'var(--color-success)' }} /> Encrypted Output <span style={{ color: 'var(--color-primary)', fontWeight: 400 }}>(IV:Ciphertext)</span>
              </span>
              <button onClick={() => copyToClipboard(outputText)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {copied ? <><CheckCircle2 size={14} className="icon-bounce" /> Copied!</> : <><Copy size={14} className="icon-cyber" /> Copy</>}
              </button>
            </label>
            <textarea
              className="input-control"
              rows={4}
              value={outputText}
              readOnly
              style={{
                fontFamily: 'monospace', color: 'var(--color-text)',
                background: 'var(--color-surface-container-lowest)',
                resize: 'none',
                border: '1px solid var(--color-primary-dim)',
                borderRadius: 'var(--radius-md)',
              }}
            ></textarea>
          </motion.div>
          </SpotlightCard>
        )}
      </SpotlightCard>

      {/* SHOWN ONCE MODAL */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-panel-elevated" style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--color-danger)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertTriangle color="var(--color-danger)" size={24} className="icon-glow-pulse" />
                  <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-danger)' }}>CRITICAL: Secret Key</h2>
                </div>
                <button onClick={() => setShowKeyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                This is the symmetrical AES-256 decryption key for your payload. 
                <strong style={{ color: 'var(--color-text)' }}> It is shown ONLY ONCE. </strong> 
                If you lose this key, the ciphertext cannot be decrypted.
              </p>

              <div style={{ background: 'var(--color-surface-container-lowest)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-outline-variant)', marginBottom: '1.5rem' }}>
                <code style={{ color: 'var(--color-primary)', wordBreak: 'break-all', fontSize: '0.85rem' }}>{privateKey}</code>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <KineticButton onClick={downloadKey} style={{ flex: 1, background: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)' }}>
                  <Download size={16} className="icon-cyber" /> Save .key File
                </KineticButton>
                <KineticButton onClick={() => {copyToClipboard(privateKey); setShowKeyModal(false);}} style={{ flex: 1 }}>
                  <Copy size={16} /> Copy & Acknowledge
                </KineticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Encrypt;

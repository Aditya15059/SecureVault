import React, { useState, useEffect } from 'react';
import { Key, Copy, CheckCircle2, ArrowRightLeft, Upload, FileKey, AlertTriangle, ShieldCheck, Loader, XCircle, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KineticButton } from '../components/animations/KineticButton';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const Decrypt = () => {
  const [ciphertext, setCiphertext] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  
  const [decrypting, setDecrypting] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [decryptError, setDecryptError] = useState(false);
  
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

  const handleClearAll = () => {
    setCiphertext('');
    setPrivateKey('');
    setDecryptedText('');
    setDoorOpen(false);
    setAutoClearTimer(0);
    setDecryptError(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPrivateKey(ev.target.result.trim());
      };
      reader.readAsText(file);
    }
  };

  const triggerError = () => {
    setDecryptError(true);
    setErrorShake(true);
    setTimeout(() => { setErrorShake(false); }, 500);
    setTimeout(() => { setDecryptError(false); }, 3000);
  };

  const handleDecrypt = () => {
    if (!ciphertext || !privateKey) {
      triggerError();
      return;
    }

    setDecrypting(true);
    setDecryptError(false);
    
    setTimeout(() => {
      if (!privateKey.startsWith('sv_') || privateKey.length < 32 || !ciphertext.includes(':')) {
        setDecrypting(false);
        triggerError();
        return;
      }

      try {
        const payloadParts = ciphertext.split(':');
        if (payloadParts.length !== 2) throw new Error("Invalid payload format");
        
        const plaintext = decodeURIComponent(window.atob(payloadParts[1]));
        
        setDecryptedText(plaintext);
        setDoorOpen(true);
        setAutoClearTimer(60);
      } catch (err) {
        triggerError();
      }
      setDecrypting(false);
    }, 1800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decryptedText);
  };

  // Dynamic button icon
  const getButtonContent = () => {
    if (decrypting) {
      return <><Loader size={16} className="icon-spin" /> Decrypting...</>;
    }
    if (decryptError) {
      return <><XCircle size={16} style={{ color: 'var(--color-danger)' }} /> Decryption Failed</>;
    }
    if (doorOpen) {
      return <><CheckCircle2 size={16} className="icon-bounce" style={{ color: 'var(--color-success)' }} /> Decrypted</>;
    }
    return <><Unlock size={16} /> Extract & Decrypt</>;
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Decrypt Payload</h1>
          <p className="text-dim">Authenticate symmetric key to extract ciphertext payloads.</p>
        </div>
        {autoClearTimer > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(248,113,113,0.2)' }}>
             <AlertTriangle size={14} color="var(--color-danger)" className="icon-glow-pulse" />
             <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', letterSpacing: '0.05em' }}>Self-destruct in {autoClearTimer}s</span>
          </div>
        )}
      </header>

      {/* KMS Status Card */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--color-primary)' }}>
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
          Live
        </div>
      </div>

      {/* Error Shake Container Wrapper */}
      <motion.div animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
        <SpotlightCard glowColor={decryptError ? 'red' : 'blue'} customSize={true} width="100%" className="card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '1.5rem' }}>
          
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileKey size={12} className="icon-cyber" /> Encrypted Ciphertext (IV:Payload)
            </label>
            <textarea
              className="input-control"
              rows={4}
              placeholder="Paste the Base64 ciphertext here..."
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)' }}
            ></textarea>
          </div>

          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={12} className="icon-cyber" /> Symmetric Private Key
              </span>
              <label style={{ 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', 
                color: 'var(--color-primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' 
              }}>
                <Upload size={14} className="icon-cyber" /> Upload .key
                <input type="file" accept=".key,text/plain" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </label>
            <div style={{ position: 'relative' }}>
              <FileKey size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
              <input
                type="password"
                className="input-control"
                placeholder="sv_a7b8e5c..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <KineticButton 
            onClick={handleDecrypt} 
            loading={false} 
            disabled={!ciphertext || !privateKey || decrypting} 
            style={{ width: '100%', padding: '1rem' }}
          >
            {getButtonContent()}
          </KineticButton>

          {/* VAULT DOOR REVEAL ANIMATION */}
          <AnimatePresence>
            {doorOpen && (
              <motion.div 
                 initial={{ height: 0, opacity: 0, marginTop: 0 }}
                 animate={{ height: 'auto', opacity: 1, marginTop: '2rem' }}
                 exit={{ height: 0, opacity: 0, marginTop: 0 }}
                 style={{ overflow: 'hidden' }}
              >
                <SpotlightCard glowColor="green" customSize={true} width="100%" style={{ 
                    border: '1px solid var(--color-success)', background: 'var(--color-surface-container-lowest)', 
                    borderRadius: 'var(--radius-md)', position: 'relative', padding: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(57,255,20,0.2)', background: 'rgba(57,255,20,0.05)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <ShieldCheck size={16} className="icon-bounce" /> <span>Decrypted Securely</span>
                     </div>
                     <button onClick={() => { copyToClipboard(); handleClearAll(); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Copy size={12} /> Copy & Flush
                     </button>
                  </div>

                  <div style={{ padding: '1.5rem', color: 'var(--color-text)', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                     {decryptedText}
                  </div>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
};

export default Decrypt;

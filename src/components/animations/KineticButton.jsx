import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

export const KineticButton = ({ 
  children, 
  onClick, 
  className = '', 
  loading = false, 
  success = false,
  disabled = false,
  variant = 'primary', // 'primary' or 'secondary' or 'icon'
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  // Handles ink-ripple click effect
  const handlePointerDown = (e) => {
    if (disabled || loading || success) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    if (onClick) onClick(e);
  };

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600); // Wait for animation flush
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const btnClass = variant === 'primary' ? 'btn' : variant === 'secondary' ? 'btn btn-secondary' : 'btn-icon';

  return (
    <motion.button
      onPointerDown={handlePointerDown}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || loading || success}
      className={`${btnClass} ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Loader2 className="animate-spin" size={20} />
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: "spring" }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}
          >
            <Check size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple renderer */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 50,
              height: 50,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

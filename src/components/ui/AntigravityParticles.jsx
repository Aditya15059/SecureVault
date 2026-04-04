import React, { useMemo } from 'react';
import { AntigravityElement } from './AntigravityElement';
import './AntigravityParticles.css';

export function AntigravityParticles({ count = 25 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      left: Math.random() * 100, // 0 to 100vw
      top: Math.random() * 100, // 0 to 100vh
      duration: Math.random() * 20 + 20, // 20s to 40s drift
      delay: Math.random() * -40, // start at different points in animation
      color: Math.random() > 0.5 ? '#7c3aed' : '#22d3ee', // Purple or Cyan
      opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
    }));
  }, [count]);

  return (
    <div className="antigravity-particles-layer">
      {particles.map((p) => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}vw`,
            top: `${p.top}vh`,
            pointerEvents: 'none',
            animation: `float-particle ${p.duration}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <AntigravityElement strength={60} radius={250}>
            <div 
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: '50%',
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          </AntigravityElement>
        </div>
      ))}
    </div>
  );
}

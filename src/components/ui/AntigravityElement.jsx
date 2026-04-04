import React from 'react';
import { useAntigravity } from '../../hooks/useAntigravity';

/**
 * Antigravity Wrapper Element
 * Wraps any internal element with the antigravity floating repulsion effect
 */
export function AntigravityElement({ 
  children, 
  strength = 40, 
  radius = 300, 
  disabled = false,
  className = '',
  ...props
}) {
  const ref = useAntigravity(strength, radius, disabled);

  return (
    <div 
      ref={ref} 
      className={`antigravity-element ${className}`}
      style={{ 
        willChange: 'transform', 
        display: 'inline-block' 
      }} 
      {...props}
    >
      {children}
    </div>
  );
}

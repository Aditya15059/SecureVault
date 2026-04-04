import React, { useRef, useState } from 'react';
import './SpotlightCard.css';

export function SpotlightCard({
  children,
  glowColor = 'purple',
  size = 'md', // sm, md, lg
  customSize = false,
  className = '',
  width,
  style = {},
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const colors = {
    purple: 'rgba(123, 47, 190, 0.4)', // #7B2FBE matching Vortex
    blue: 'rgba(2, 179, 228, 0.4)',    // #02B3E4
    green: 'rgba(16, 185, 129, 0.4)',
    red: 'rgba(239, 68, 68, 0.4)',
    orange: 'rgba(249, 115, 22, 0.4)'
  };

  const color = colors[glowColor] || colors.purple;
  const sizeClass = customSize ? '' : `spotlight-card--${size}`;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${sizeClass} ${className}`}
      style={{
        ...style,
        width: customSize && width ? width : undefined,
      }}
    >
      <div
        className="spotlight-card-glow"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${color}, transparent 40%)`,
        }}
      />
      <div className="spotlight-card-content">{children}</div>
    </div>
  );
}

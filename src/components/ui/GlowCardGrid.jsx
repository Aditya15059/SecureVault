import React from 'react';

export function GlowCardGrid({ children, className = '', columns = 3 }) {
  // Translate columns prop to CSS Grid template
  const gridTemplateColumns = 
    columns === 3 ? 'repeat(auto-fit, minmax(300px, 1fr))' :
    columns === 2 ? 'repeat(auto-fit, minmax(350px, 1fr))' :
    '1fr';

  return (
    <div 
      className={`glow-card-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: '1.5rem',
        width: '100%',
        alignItems: 'stretch'
      }}
    >
      {children}
    </div>
  );
}

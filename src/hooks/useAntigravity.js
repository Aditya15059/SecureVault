import { useEffect, useRef } from 'react';

// Shared global state for pointer parsing multiple elements
let globalPointer = { x: -1000, y: -1000 };
let isTracking = false;

function initGlobalPointerTracking() {
  if (isTracking || typeof window === 'undefined') return;
  
  const handlePointerMove = (e) => {
    // Can be touch or mouse since we bind pointermove
    globalPointer.x = e.clientX;
    globalPointer.y = e.clientY;
  };
  
  // Clean up if it moves off
  const handlePointerLeave = () => {
    globalPointer.x = -1000;
    globalPointer.y = -1000;
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  
  isTracking = true;
}

/**
 * useAntigravity Hook
 * Calculates distance from cursor and applies a repulsion transform
 * @param {number} strength - Maximum translation px (default: 40)
 * @param {number} radius - Active radius in px (default: 300)
 * @param {boolean} disabled - Toggle effect
 */
export function useAntigravity(strength = 40, radius = 300, disabled = false) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (disabled) {
      if (elementRef.current) {
         elementRef.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
      return;
    }
    
    initGlobalPointerTracking();

    let animationFrameId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    const damping = 0.1; // Lerp smoothing

    const render = () => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const dx = elCenterX - globalPointer.x;
      const dy = elCenterY - globalPointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Calculate repulsion distance based on proximity
        const force = (radius - dist) / radius; // 0 to 1
        const pushDist = force * strength;
        
        // Normalize vector
        const nx = dist === 0 ? 0 : dx / dist;
        const ny = dist === 0 ? 0 : dy / dist;
        
        targetX = nx * pushDist;
        targetY = ny * pushDist;
      } else {
        targetX = 0;
        targetY = 0;
      }

      // Linear interpolation for smooth floating back and forth
      currentX += (targetX - currentX) * damping;
      currentY += (targetY - currentY) * damping;

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [strength, radius, disabled]);

  return elementRef;
}

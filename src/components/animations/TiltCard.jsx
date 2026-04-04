import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const TiltCard = ({ children, className = '', tiltStrength = 15 }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for resetting
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation (capped by tiltStrength)
  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltStrength, tiltStrength]);

  const handlePointerMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5 relative to center
    x.set(px / rect.width - 0.5);
    y.set(py / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      animate={{
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(57, 255, 20, 0.15)' 
          : '0 0px 0px rgba(57, 255, 20, 0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`card ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};

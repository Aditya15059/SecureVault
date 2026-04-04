import React, { useRef, useEffect, useCallback } from 'react';

const ParticleBackground = ({ 
  particleCount = 80, 
  color = '#7c3aed', 
  glowColor = 'rgba(124, 58, 237, 0.15)', 
  connectDistance = 140, 
  speed = 0.3 
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  // Eased mouse position for the foggy glow + trail array
  const mouseRef = useRef({ x: -1000, y: -1000, easedX: -1000, easedY: -1000, trail: [] });
  const animFrameRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const sizeMultiplier = Math.random(); // For depth effect
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * (sizeMultiplier + 0.5),
        vy: (Math.random() - 0.5) * speed * (sizeMultiplier + 0.5),
        radius: sizeMultiplier * 2.5 + 0.5,
        opacity: sizeMultiplier * 0.5 + 0.1,
        zDepth: sizeMultiplier, // 0 to 1 mapping depth
      });
    }
    return particles;
  }, [particleCount, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    setSize();
    particlesRef.current = initParticles(width, height);

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      // Initialize eased positions if they are off screen
      if (mouseRef.current.easedX === -1000) {
        mouseRef.current.easedX = mouseRef.current.x;
        mouseRef.current.easedY = mouseRef.current.y;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      // We don't reset eased position so it slowly drifts away or stays static
    };

    const hexToRgb = (hex) => {
      let c = hex.slice(1);
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(color);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Ease mouse position for smooth foggy glow tracking
      if (mouse.x !== -1000) {
        mouse.easedX += (mouse.x - mouse.easedX) * 0.15;
        mouse.easedY += (mouse.y - mouse.easedY) * 0.15;
        mouse.trail.push({ x: mouse.easedX, y: mouse.easedY, alpha: 0.5 });
      }

      // Draw Moving Cyber Grid
      const time = Date.now() * 0.001;
      const gridSize = 60;
      const offsetY = (time * 15) % gridSize;
      
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`;
      ctx.lineWidth = 1;
      // Vertical
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal (Moving Down)
      for (let y = offsetY; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw the ambient mouse fog (Antigravity glow effect)
      if (mouse.easedX !== -1000 && mouse.x !== -1000) {
        const gradient = ctx.createRadialGradient(
          mouse.easedX, mouse.easedY, 0,
          mouse.easedX, mouse.easedY, 400
        );
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Cursor Trail Line
      if (mouse.trail && mouse.trail.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < mouse.trail.length; i++) {
          const pt = mouse.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
          pt.alpha -= 0.02; // Fade out speed
        }
        
        // Remove dead points
        mouse.trail = mouse.trail.filter(pt => pt.alpha > 0);
        
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 30;
        ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction with mouse (subtle magnetic push on nearby elements)
        if (mouse.x !== -1000) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            // Push depending on depth (foreground moves more)
            const force = (150 - dist) / 150;
            p.vx -= (dx / dist) * force * 0.03 * p.zDepth;
            p.vy -= (dy / dist) * force * 0.03 * p.zDepth;
          }
        }

        // Return to natural speed smoothly via friction
        const naturalSpeed = speed * (p.zDepth + 0.5);
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > naturalSpeed) {
            p.vx *= 0.98;
            p.vy *= 0.98;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges smoothly
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Base opacity + extra glow if near mouse
        let adjustedOpacity = p.opacity;
        if (mouse.easedX !== -1000) {
           const distToEasedMouse = Math.sqrt(
               Math.pow(p.x - mouse.easedX, 2) + Math.pow(p.y - mouse.easedY, 2)
           );
           if (distToEasedMouse < 250) {
               adjustedOpacity = Math.min(1, p.opacity + (250 - distToEasedMouse) / 250 * 0.6);
           }
        }
        
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${adjustedOpacity})`;
        // Add Bloom to particles
        ctx.shadowBlur = 12 * p.zDepth;
        ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${adjustedOpacity})`;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines

        // Draw connections for Parallax Depth network
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          // Only connect if they are somewhat on the same visual plane
          if (Math.abs(p.zDepth - p2.zDepth) > 0.35) continue;

          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectDistance) {
            let lineOpacity = (1 - cdist / connectDistance) * 0.15;
            
            // Illuminate lines heavily near the mouse for the Antigravity effect
            if (mouse.easedX !== -1000) {
                const midX = (p.x + p2.x) / 2;
                const midY = (p.y + p2.y) / 2;
                const distToMouse = Math.sqrt(Math.pow(midX - mouse.easedX, 2) + Math.pow(midY - mouse.easedY, 2));
                if (distToMouse < 250) {
                    lineOpacity = Math.min(0.85, lineOpacity + (250 - distToMouse) / 250 * 0.5);
                }
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineOpacity})`;
            ctx.lineWidth = Math.max(0.3, p.zDepth * 1.2); 
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setSize();
      particlesRef.current = initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color, glowColor, connectDistance, particleCount, initParticles, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Crucial to allow user input to pass through to buttons
        zIndex: -1, // Keep behind all UI content
      }}
    />
  );
};

export default ParticleBackground;

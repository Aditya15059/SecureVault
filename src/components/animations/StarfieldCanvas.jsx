/**
 * StarfieldCanvas — Feature 01
 * Warp-speed star tunnel: stars spawn near centre, accelerate outward.
 * • Motion trails: white→purple gradient per star
 * • Far stars = white, close/fast stars = purple tint (#a855f7)
 * • Scroll tuning: warp speed 1x → 4x as user scrolls
 * • Mouse parallax: field drifts toward cursor
 */
import React, { useEffect, useRef, useCallback } from 'react';

const NUM_STARS   = 200;
const BASE_SPEED  = 0.35;
const MAX_Z       = 1000;

function makestar(w, h) {
  return {
    x: (Math.random() - 0.5) * w,
    y: (Math.random() - 0.5) * h,
    z: Math.random() * MAX_Z,
    pz: 0,
  };
}

const StarfieldCanvas = ({ style, className }) => {
  const canvasRef   = useRef(null);
  const starsRef    = useRef([]);
  const scrollRef   = useRef(0);        // 0-1 ratio
  const mouseRef    = useRef({ x: 0, y: 0 });
  const rafRef      = useRef(null);
  const sizeRef     = useRef({ w: 0, h: 0 });

  /* ──────────── resize ──────────── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;
    sizeRef.current = { w, h };
    starsRef.current = Array.from({ length: NUM_STARS }, () => makestar(w, h));
  }, []);

  /* ──────────── draw loop ──────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const { w, h } = sizeRef.current;
    const cx   = w / 2;
    const cy   = h / 2;

    // scroll-driven warp multiplier
    const scrollRatio = scrollRef.current;           // 0→1
    const warpMul     = 1 + scrollRatio * 3;         // 1x → 4x
    const speed       = BASE_SPEED * warpMul;
    const trailBase   = 3 + scrollRatio * 12;        // trail length scale

    // mouse parallax drift (very subtle)
    const mx = mouseRef.current.x * 0.04;
    const my = mouseRef.current.y * 0.04;

    // fade trail (semi-transparent clear preserves motion blur)
    ctx.fillStyle = 'rgba(6, 3, 15, 0.25)';
    ctx.fillRect(0, 0, w, h);

    const stars = starsRef.current;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.pz = s.z;
      s.z  -= speed;

      if (s.z <= 0) {
        stars[i] = makestar(w, h);
        stars[i].pz = MAX_Z;
        continue;
      }

      // project to 2D
      const scale = MAX_Z / s.z;
      const sx = (s.x + mx) * scale + cx;
      const sy = (s.y + my) * scale + cy;

      const pscale = MAX_Z / s.pz;
      const px     = (s.x + mx) * pscale + cx;
      const py     = (s.y + my) * pscale + cy;

      // out-of-bounds → reset
      if (sx < 0 || sx > w || sy < 0 || sy > h) {
        stars[i] = makestar(w, h);
        continue;
      }

      // brightness / color based on depth (closeness = purple tint)
      const closeness = 1 - (s.z / MAX_Z);         // 0=far, 1=close
      const size      = Math.max(0.4, closeness * 2.5);

      // gradient trail
      const grd = ctx.createLinearGradient(px, py, sx, sy);
      const alpha = 0.3 + closeness * 0.7;

      if (closeness > 0.55) {
        // close, fast → purple (#a855f7)
        grd.addColorStop(0, `rgba(168, 85, 247, 0)`);
        grd.addColorStop(1, `rgba(168, 85, 247, ${alpha})`);
      } else if (closeness > 0.3) {
        // mid → blend purple→white
        grd.addColorStop(0, `rgba(168, 85, 247, 0)`);
        grd.addColorStop(1, `rgba(220, 200, 255, ${alpha})`);
      } else {
        // far → white
        grd.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grd.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.7})`);
      }

      // draw trail
      const trailLen = trailBase * warpMul * closeness;
      const ang      = Math.atan2(sy - py, sx - px);
      const tx = sx - Math.cos(ang) * trailLen;
      const ty = sy - Math.sin(ang) * trailLen;

      const trail = ctx.createLinearGradient(tx, ty, sx, sy);
      if (closeness > 0.55) {
        trail.addColorStop(0, `rgba(168, 85, 247, 0)`);
        trail.addColorStop(1, `rgba(168, 85, 247, ${alpha})`);
      } else if (closeness > 0.3) {
        trail.addColorStop(0, `rgba(200, 160, 255, 0)`);
        trail.addColorStop(1, `rgba(200, 160, 255, ${alpha})`);
      } else {
        trail.addColorStop(0, `rgba(255, 255, 255, 0)`);
        trail.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.6})`);
      }

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = trail;
      ctx.lineWidth   = size;
      ctx.stroke();

      // star dot
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
      if (closeness > 0.55) {
        ctx.fillStyle = `rgba(200, 130, 255, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  /* ──────────── events ──────────── */
  useEffect(() => {
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
    };

    const handleMouse = (e) => {
      const { w, h } = sizeRef.current;
      mouseRef.current = {
        x: e.clientX - w / 2,
        y: e.clientY - h / 2,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  /* ──────────── mount / unmount ──────────── */
  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current.parentElement);

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [resize, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default StarfieldCanvas;

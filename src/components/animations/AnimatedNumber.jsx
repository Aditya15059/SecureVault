import React, { useEffect, useRef, useState } from 'react';
import { useInView, useSpring, motion } from 'framer-motion';

export const AnimatedNumber = ({ value, duration = 2000, format = (v) => Math.round(v) }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    duration: duration
  });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(format(latest));
    });
  }, [springValue, format]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

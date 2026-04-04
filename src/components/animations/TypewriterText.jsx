import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TypewriterText = ({ text, delay = 0, style, className, showCursor = true }) => {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05 } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, display: 'none' },
    visible: { opacity: 1, display: 'inline' }
  };

  return (
    <span style={{ ...style, display: 'inline-block' }} className={className}>
      {isStarted && (
        <motion.span variants={containerVariants} initial="hidden" animate="visible">
          {text.split('').map((char, index) => (
            <motion.span key={`${char}-${index}`} variants={childVariants}>
              {char}
            </motion.span>
          ))}
          {showCursor && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.5 }} // Start blinking after typing starts
              style={{ display: 'inline-block', width: '8px', height: '1em', background: 'currentColor', marginLeft: '4px', verticalAlign: 'middle' }}
            />
          )}
        </motion.span>
      )}
    </span>
  );
};

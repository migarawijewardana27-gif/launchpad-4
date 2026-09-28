"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FloatingLogos = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -150]);

  const logoSrc = "/icon white.png";

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {/* Logo 1 - Large, slow moving, blurred */}
      <motion.img 
        src={logoSrc}
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          opacity: 0.1,
          y: y1,
          filter: 'blur(4px)'
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Logo 2 - Medium, fast moving */}
      <motion.img 
        src={logoSrc}
        style={{
          position: 'absolute',
          top: '40%',
          right: '10%',
          width: '150px',
          opacity: 0.15,
          y: y2
        }}
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Logo 3 - Small, subtle */}
      <motion.img 
        src={logoSrc}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '30%',
          width: '100px',
          opacity: 0.2,
          y: y3
        }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FloatingLogos;

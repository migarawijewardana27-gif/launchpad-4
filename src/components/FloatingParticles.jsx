"use client";

import React, { useMemo } from 'react';
import './FloatingParticles.css';

const FloatingParticles = () => {
  const iconSrc = '/icon white.png';

  // Generate 12 particles with random but deterministic properties
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: 20 + (i % 4) * 15, // 20–65px
      left: `${(i * 8.5) % 100}%`,
      animDuration: 18 + (i % 5) * 6, // 18–42s
      animDelay: (i * 2.3) % 10, // stagger
      startY: `${(i * 12) % 100}%`,
      rotateStart: (i * 37) % 360,
    }));
  }, []);

  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map(p => (
        <img
          key={p.id}
          src={iconSrc}
          alt=""
          className="floating-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.startY,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            '--rotate-start': `${p.rotateStart}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;

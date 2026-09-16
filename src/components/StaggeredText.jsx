"use client";

import React from 'react';
import { motion } from 'framer-motion';

const StaggeredText = ({ text, className = '', tag = 'h2', delay = 0 }) => {
  const letters = text.split('');
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      }
    }
  };

  const Tag = tag;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Tag className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={child}
            style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};

export default StaggeredText;

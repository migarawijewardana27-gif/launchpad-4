import React from 'react';

// Diagonal cut section divider
const SectionDivider = ({ flip = false, altColor = false }) => {
  return (
    <div className={`section-divider ${altColor ? 'divider-alt' : ''}`} style={flip ? { transform: 'scaleY(-1)' } : {}}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L1440 60 L1440 60 L0 60 Z" />
      </svg>
    </div>
  );
};

export default SectionDivider;

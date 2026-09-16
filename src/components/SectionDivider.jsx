import React from 'react';

// Diagonal cut section divider
const SectionDivider = ({ flip = false, fillColor = 'var(--color-bg-primary)' }) => {
  return (
    <div className="section-divider" style={flip ? { transform: 'scaleY(-1)' } : {}}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L1440 60 L1440 60 L0 60 Z" style={{ fill: fillColor }} />
      </svg>
    </div>
  );
};

export default SectionDivider;

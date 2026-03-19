import React from 'react';
import './MovingBorder.css';

const MovingBorder = ({
  children,
  duration = 3000,
  rx = "50px",
  color = "var(--primary-gold)",
  background = "#0D0D0D",
  className = ""
}) => {
  return (
    <div className={`moving-border-wrapper ${className}`} style={{ borderRadius: rx }}>
      <div 
        className="moving-border-track" 
        style={{ 
          animationDuration: `${duration}ms`,
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent 25%)`
        }} 
      />
      <div className="moving-border-content" style={{ borderRadius: rx, background: background }}>
        {children}
      </div>
    </div>
  );
};

export default MovingBorder;

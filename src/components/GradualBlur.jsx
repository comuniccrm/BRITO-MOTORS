import React from 'react';

const GradualBlur = ({ 
  target = "parent", 
  position = "bottom", 
  height = "7rem", 
  strength = 2, 
  divCount = 5, 
  curve = "bezier", 
  exponential = false, 
  opacity = 1,
  blurColor = "transparent" // Can be hex like #000 for fade-to-black
}) => {
  const isTop = position === "top";
  
  // Create steps for the blur layers
  const layers = Array.from({ length: divCount }).map((_, i) => {
    const progress = (i + 1) / divCount;
    
    // Calculate blur amount based on curve/exponential
    let blurValue;
    if (exponential) {
      blurValue = Math.pow(progress, 2) * strength;
    } else {
      blurValue = progress * strength;
    }

    // Stacked layers for smooth transition
    const layerHeight = `calc(${height} * ${progress})`;
    const layerOpacity = opacity * progress;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          [position]: 0,
          height: layerHeight,
          backdropFilter: `blur(${blurValue}px)`,
          WebkitBackdropFilter: `blur(${blurValue}px)`,
          pointerEvents: 'none',
          zIndex: 10 + i,
          opacity: layerOpacity,
          maskImage: isTop 
            ? `linear-gradient(to bottom, black, transparent)` 
            : `linear-gradient(to top, black, transparent)`,
          WebkitMaskImage: isTop 
            ? `linear-gradient(to bottom, black, transparent)` 
            : `linear-gradient(to top, black, transparent)`,
        }}
      />
    );
  });

  return (
    <div 
      className="gradual-blur-container"
      style={{
        position: target === "parent" ? 'absolute' : 'fixed',
        left: 0,
        right: 0,
        [position]: 0,
        height: height,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
        background: blurColor !== "transparent" ? `linear-gradient(${isTop ? 'to bottom' : 'to top'}, ${blurColor}, transparent)` : 'transparent'
      }}
    >
      {layers}
    </div>
  );
};

export default GradualBlur;

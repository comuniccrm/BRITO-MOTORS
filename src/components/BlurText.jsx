import React from 'react';
import { motion } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 200, // in ms
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
  style = {}
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const itemVariants = {
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      y: direction === 'top' ? -20 : 20 
    },
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  return (
    <div 
      className={`blur-text-container ${className}`} 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        ...style 
      }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          transition={{
            delay: (index * delay) / 1000,
            duration: 0.8,
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
          style={{ 
            display: 'inline-block', 
            whiteSpace: 'pre',
            willChange: 'transform, filter, opacity',
          }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;

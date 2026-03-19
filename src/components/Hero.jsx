import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BorderGlow from './BorderGlow';
import { useSettings } from '../hooks/useSettings.jsx';
import { useCars } from '../hooks/useCars';

const Hero = () => {
  const { cars: CARS, loading } = useCars();
  const [activeCar, setActiveCar] = useState(null);
  const settings = useSettings();
  
  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Set first car as active when cars are loaded
  useEffect(() => {
    if (CARS.length > 0 && !activeCar) {
      setActiveCar(CARS[0]);
    }
  }, [CARS, activeCar]);

  // Handle auto-scroll with interaction support
  useEffect(() => {
    let animationFrame;
    const scroll = () => {
      if (scrollRef.current && !isInteracting) {
        scrollRef.current.scrollLeft += 0.8; // Speed factor
        
        // Loop reset logic: if we reach halfway (duplicated content), jump back to start
        if (scrollRef.current.scrollLeft >= (scrollRef.current.scrollWidth / 2)) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    
    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInteracting, CARS]);

  if (loading || !activeCar) {
    return <div style={{ height: '80vh', background: '#050505' }} />;
  }

  const handleWhatsApp = (car) => {
    const message = `🚀 *Interesse em Veículo - Brito Motors* 🚀\n\n` +
                   `Olá! Gostaria de mais informações e simular um financiamento para este veículo:\n\n` +
                   `🚗 *Modelo:* ${car.name}\n` +
                   `🏷️ *Marca:* ${car.brand}\n` +
                   `📅 *Ano:* ${car.year}\n` +
                   `🛣️ *Km:* ${car.km}\n` +
                   `⚙️ *Motor:* ${car.engine}\n` +
                   `💰 *Valor:* ${car.price}\n\n` +
                   `Vi no site e aguardo seu retorno! ✨`;
    window.open(`https://wa.me/${settings.whatsapp_number || '5511995819077'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="hero" style={{ position: 'relative', height: '85vh', overflow: 'hidden' }}>
      {/* Background with Overlay and Cinematic Zoom */}
      <AnimatePresence mode='wait'>
        <motion.div
           key={activeCar.id}
          initial={{ opacity: 0, scale: 1.05, x: -30 }}
          animate={{ opacity: 1, scale: 1.12, x: 30 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 8, ease: "linear" },
            x: { duration: 8, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.15) 85%), url(${settings.hero_bg || activeCar.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        />
      </AnimatePresence>

      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        zIndex: 10
      }}>
        {/* Carousel Miniatures at the bottom - Infinite Scroll */}
        <div className="hero-carousel" style={{ 
          width: '100%', 
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div 
            ref={scrollRef}
            className="hero-carousel-list" 
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              paddingBottom: '0',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              width: '100%',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab'
            }}
          >
            {[...CARS, ...CARS].map((car, index) => (
              <motion.div
                key={`${car.id}-${index}`}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCar(car)}
                style={{
                  minWidth: '220px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'border 0.3s ease, box-shadow 0.3s ease',
                  border: activeCar.id === car.id ? '2px solid var(--primary-gold)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeCar.id === car.id ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '130px', background: '#000' }}>
                  <img 
                    src={car.image} 
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '130px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />
                  {/* Info Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{car.name}</span>
                    <span style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', fontWeight: 500 }}>{car.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-carousel-list::-webkit-scrollbar {
          display: none;
        }
        .hero-carousel-list {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .hero-carousel-list {
            padding-bottom: 0px !important;
          }
          .hero-actions {
            flex-direction: column;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100% !important;
            justify-content: center;
          }
        }
      `}} />
    </section>
  );
};

export default Hero;

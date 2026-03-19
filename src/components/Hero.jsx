import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BorderGlow from './BorderGlow';
import BlurText from './BlurText';
import { useSettings } from '../hooks/useSettings.jsx';
import { useCars } from '../hooks/useCars';

const Hero = () => {
  const { cars: CARS, loading } = useCars();
  const [activeCar, setActiveCar] = useState(null);
  const settings = useSettings();
  
  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const heroTexts = [
    { text: settings.hero_text_1, size: settings.hero_text_1_size, color: settings.hero_text_1_color, id: 1 },
    { text: settings.hero_text_2, size: settings.hero_text_2_size, color: settings.hero_text_2_color, id: 2 },
    { text: settings.hero_text_3, size: settings.hero_text_3_size, color: settings.hero_text_3_color, id: 3 }
  ].filter(t => t.text && t.text.trim() !== '');

  useEffect(() => {
    if (heroTexts.length <= 1) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroTexts]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
      if (scrollRef.current) {
        // Only auto-increment if NOT interacting
        if (!isInteracting) {
          scrollRef.current.scrollLeft += 1.5; // Increased speed for visibility
        }
        
        // Loop reset logic: ALWAYS check this so they don't hit the end while dragging
        // Use half width since we duplicated the items [...CARS, ...CARS]
        const half = scrollRef.current.scrollWidth / 2;
        if (scrollRef.current.scrollLeft >= half) {
          scrollRef.current.scrollLeft -= half;
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
        {isMobile && settings.banner_url_mobile ? (
          <motion.div
            key="mobile-banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${settings.banner_url_mobile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1
            }}
          />
        ) : (
          <motion.div
            key={activeCar.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" }
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
        )}
      </AnimatePresence>

      {/* Alternating Texts Overlay */}
      {heroTexts.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          textAlign: 'center',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          <BlurText
            key={`${textIndex}-${heroTexts[textIndex].id}`}
            text={heroTexts[textIndex].text}
            delay={50}
            animateBy="letters"
            direction="top"
            className="hero-blur-text"
            style={{ 
              color: heroTexts[textIndex].color || '#ffffff',
              transform: `scale(${heroTexts[textIndex].size || 1})`
            }}
          />
        </div>
      )}

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
            onTouchCancel={() => setIsInteracting(false)}
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
          .hero-blur-text {
            font-size: 2.2rem !important;
            line-height: 1.2;
            color: #fff;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 30px rgba(0,0,0,0.8);
          }
        }
        @media (min-width: 769px) {
          .hero-blur-text {
            font-size: 4.5rem !important;
            line-height: 1.1;
            color: #fff;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 8px;
            text-shadow: 0 0 40px rgba(0,0,0,0.8);
          }
        }
      `}} />
    </section>
  );
};

export default Hero;

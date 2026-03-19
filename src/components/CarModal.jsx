import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Zap, Cog, Phone, MessageCircle, Maximize2 } from 'lucide-react';
import GlareHover from './GlareHover';
import './CarModal.css';

const CarModal = ({ car, isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState(car?.image);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync active image when car changes
  useEffect(() => {
    if (car) {
      setActiveImage(car.image);
    }
  }, [car]);

  if (!car) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop"
          />

          {/* Modal Wrapper for Centering */}
          <div className="modal-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="modal-content glass-effect"
            >
            <button className="modal-close" onClick={onClose}>
              <X size={24} strokeWidth={1.5} />
            </button>

            <div className="modal-grid">
              {/* Gallery Section */}
              <div className="modal-gallery">
                <div className="main-image-container" onClick={() => setIsZoomed(true)}>
                  <img src={activeImage} alt={car.name} className="main-image" />
                  <div className="zoom-hint">
                    <Maximize2 size={20} strokeWidth={1.5} />
                    <span>Clique para expandir</span>
                  </div>
                </div>
                
                <div className="thumbnail-row">
                  {car.gallery?.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt={`${car.name} ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="modal-details">
                <span className="modal-brand">{car.brand}</span>
                <h2 className="modal-title">{car.name}</h2>
                <p className="modal-description">{car.description}</p>

                <div className="modal-specs-grid">
                  <div className="modal-spec-item">
                    <Calendar size={20} strokeWidth={1.5} className="gold-text" />
                    <div>
                      <span className="spec-label">Ano</span>
                      <span className="spec-value">{car.year}</span>
                    </div>
                  </div>
                  <div className="modal-spec-item">
                    <Gauge size={20} strokeWidth={1.5} className="gold-text" />
                    <div>
                      <span className="spec-label">Quilometragem</span>
                      <span className="spec-value">{car.km}</span>
                    </div>
                  </div>
                  <div className="modal-spec-item">
                    <Zap size={20} strokeWidth={1.5} className="gold-text" />
                    <div>
                      <span className="spec-label">Motor</span>
                      <span className="spec-value">{car.engine}</span>
                    </div>
                  </div>
                  <div className="modal-spec-item">
                    <Cog size={20} strokeWidth={1.5} className="gold-text" />
                    <div>
                      <span className="spec-label">Câmbio</span>
                      <span className="spec-value">{car.transmission}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="modal-price-container">
                    <span className="price-label">Valor sugerido</span>
                    <span className="modal-price">{car.price}</span>
                  </div>
                  
                  <div className="modal-actions">
                    <GlareHover borderRadius="12px" width="100%">
                      <button 
                        className="contact-btn saiba-mais-btn" 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '10px',
                          width: '100%' 
                        }}
                        onClick={() => {
                          const message = `Olá! Gostaria de fazer uma simulação para o veículo:\n\n` +
                                         `*CARRO:* ${car.name}\n` +
                                         `*MARCA:* ${car.brand}\n` +
                                         `*ANO:* ${car.year}\n` +
                                         `*PREÇO:* ${car.price}\n` +
                                         `*KM:* ${car.km}\n` +
                                         `*MOTOR:* ${car.engine}\n` +
                                         `*CÂMBIO:* ${car.transmission}\n\n` +
                                         `Vi no site e quero simular o financiamento.`;
                          window.open(`https://wa.me/5511995819077?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.5-16.4-14.7-27.5-32.8-30.7-38.3-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        SIMULAR AGORA
                      </button>
                    </GlareHover>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>

          {/* Lightbox / Zoomed Image */}
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lightbox-overlay"
                onClick={() => setIsZoomed(false)}
              >
                <motion.img
                  layoutId="active-car-image"
                  src={activeImage}
                  alt={car.name}
                  className="lightbox-image"
                />
                <button className="lightbox-close" onClick={() => setIsZoomed(false)}>
                  <X size={32} strokeWidth={1.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default CarModal;

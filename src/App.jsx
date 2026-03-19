import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovingBorder from './components/MovingBorder';
import BorderGlow from './components/BorderGlow';
import GlareHover from './components/GlareHover';
import CarModal from './components/CarModal';
import ProfileCard from './components/ProfileCard';
import BlurText from './components/BlurText';
import SellerFormModal from './components/SellerFormModal';
import GradualBlur from './components/GradualBlur';
import WhatsAppButton from './components/WhatsAppButton';
import { useCars } from './hooks/useCars';
import { useSettings } from './hooks/useSettings.jsx';

import { Phone, MapPin, Instagram, Facebook, Mail, Calendar, Gauge, Zap, Cog } from 'lucide-react';

function App() {
  const [selectedBrand, setSelectedBrand] = useState('Todos');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const { cars: CARS, brands: BRANDS } = useCars();
  const settings = useSettings();
  const whatsappNumber = settings.whatsapp_number || '5511995819077';

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredCars = selectedBrand === 'Todos' 
    ? CARS 
    : CARS.filter(car => car.brand === selectedBrand);

  const whatsappUrl = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="app">
      <Navbar setSelectedBrand={setSelectedBrand} />

      <main>
        <Hero />

        {/* Brand Ribbon - Harmonic Symbols Only */}
        <section className="brand-ribbon glass-effect" style={{ 
          padding: '12px 0', 
          borderTop: 'none', 
          borderLeft: 'none', 
          borderRight: 'none',
          position: 'relative',
          zIndex: 20
        }}>
          <div className="container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '6px', 
            flexWrap: 'wrap' 
          }}>
            {BRANDS.map((brand, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.15, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  document.getElementById('estoque')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: selectedBrand === brand.name ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '0',
                }}
              >
                {brand.name === 'Todos' ? (
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '0.8rem', 
                    color: selectedBrand === 'Todos' ? '#fff' : 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Todos
                  </span>
                ) : (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-logo"
                    style={{ 
                      filter: selectedBrand === brand.name 
                        ? 'brightness(1.2) contrast(1.1)' 
                        : 'brightness(0.8) grayscale(0.2)',
                      transition: 'filter 0.3s ease',
                      maxHeight: '34px',
                      objectFit: 'contain'
                    }} 
                  />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Inventory Section */}
        <section id="estoque" className="section-padding">
          <div className="container">
            <motion.div layout className="car-grid">
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                      <div 
                        className="card-image-wrapper" 
                        style={{ cursor: 'pointer', position: 'relative', height: '160px', flexShrink: 0, overflow: 'hidden' }}
                        onClick={() => handleOpenModal(car)}
                      >
                        <div className="card-badge" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5, background: 'var(--primary-gold)', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>{car.year}</div>
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="card-image" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                      </div>
                      <div 
                        className="card-content" 
                        style={{ padding: '15px', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        onClick={() => handleOpenModal(car)}
                      >
                        <div>
                          <div style={{ marginBottom: '15px' }}>
                            <span className="card-brand" style={{ color: 'var(--primary-gold)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{car.brand}</span>
                            <h3 className="card-title" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{car.name}</h3>
                          </div>
                          
                          <div className="card-specs" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                          <div className="spec-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                            <Gauge size={14} strokeWidth={1.5} />
                            <span>{car.km} km</span>
                          </div>
                          <div className="spec-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                            <Zap size={14} strokeWidth={1.5} />
                            <span>{car.engine}</span>
                          </div>
                        </div>
                      </div>
                        
                        <div className="card-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor</span>
                            <p className="card-price" style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '2px 0' }}>{car.price}</p>
                          </div>
                          
                          <div style={{ width: '100%' }}>
                            <MovingBorder 
                              duration={4000} 
                              rx="50px"
                              color="var(--primary-gold)"
                              background="#0A0A0A"
                            >
                              <button 
                                className="card-button" 
                                style={{ 
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--primary-gold)',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  gap: '8px',
                                  width: '100%',
                                  height: '44px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const message = `Olá! Vi o ${car.name} no site e gostaria de simular um financiamento.`;
                                  window.open(whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : `https://wa.me/5511995819077?text=${encodeURIComponent(message)}`, '_blank');
                                }}
                              >
                                SIMULAR AGORA
                              </button>
                            </MovingBorder>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Sell Your Car Dedicated Section */}
        <section id="vender" style={{ 
          padding: '100px 0', 
          background: `linear-gradient(90deg, transparent, rgba(var(--primary-gold-rgb), 0.12), transparent)`,
          position: 'relative',
          zIndex: 5,
          borderTop: `1px solid rgba(var(--primary-gold-rgb), 0.22)`,
          borderBottom: `1px solid rgba(var(--primary-gold-rgb), 0.22)`
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 700, 
                color: '#fff', 
                marginBottom: '15px',
                letterSpacing: '3px'
              }}>
                QUER <span className="gold-text">VENDER SEU CARRO?</span>
              </h2>
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '1rem', 
                fontWeight: 300,
                letterSpacing: '1px'
              }}>
                Avaliação justa e pagamento imediato na Brito Motors.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GlareHover borderRadius="50px" glareOpacity={0.4} width="max-content">
                <motion.button 
                  className="cta-button" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    letterSpacing: '1.5px',
                    fontWeight: 600,
                    background: '#d4af37',
                    color: '#000',
                    border: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.2)'
                  }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      '0 8px 25px rgba(212, 175, 55, 0.2)',
                      '0 8px 35px rgba(212, 175, 55, 0.4)',
                      '0 8px 25px rgba(212, 175, 55, 0.2)'
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onClick={() => setIsSellerModalOpen(true)}
                >
                  <svg viewBox="0 0 448 512" width="18" height="18" fill="#000">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0-39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.5-16.4-14.7-27.5-32.8-30.7-38.3-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  {settings.btn_sell || 'VENDA SEU CARRO AQUI'}
                </motion.button>
              </GlareHover>
            </div>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section id="clientes" className="section-padding" style={{ background: '#080808', paddingTop: '40px' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="section-title" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>
                <BlurText
                  text="Clientes Satisfeitos"
                  delay={150}
                  animateBy="words"
                  direction="top"
                />
              </h2>
            </div>
            
            <div className="customer-grid" style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center', 
              gap: '20px',
              padding: '0 20px'
            }}>
              <ProfileCard 
                name="Ricardo Santos"
                title="Proprietário de Range Rover Sport"
                handle="ricardo.brito"
                status="Cliente VIP"
                contactText="WhatsApp"
                avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                innerGradient="linear-gradient(145deg, #1a1a1a 0%, #d4af3722 100%)"
                behindGlowColor="rgba(212, 175, 55, 0.3)"
                className="testimonial-card"
              />
              <ProfileCard 
                name="Juliana Lima"
                title="Proprietária de Porsche 911"
                handle="juli_motors"
                status="Membro Platinum"
                contactText="WhatsApp"
                avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"
                innerGradient="linear-gradient(145deg, #1a1a1a 0%, #d4af3722 100%)"
                behindGlowColor="rgba(212, 175, 55, 0.3)"
                className="testimonial-card"
              />
              <ProfileCard 
                name="Marcos Oliveira"
                title="Proprietário de Mercedes G63"
                handle="oliveira_amg"
                status="Colecionador"
                contactText="WhatsApp"
                avatarUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
                innerGradient="linear-gradient(145deg, #1a1a1a 0%, #d4af3722 100%)"
                behindGlowColor="rgba(212, 175, 55, 0.3)"
                className="testimonial-card"
              />
            </div>
          </div>
        </section>

        {/* ContactSection */}
        <section id="contato" className="section-padding glass-effect" style={{ margin: '0 2%', borderRadius: '15px' }}>
          <div className="container">
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <div className="logo" style={{ marginBottom: '40px' }}>
                  {settings.logo_url ? (
                    <img 
                      src={settings.logo_url} 
                      alt={settings.logo_text || settings.site_name} 
                      style={{ 
                        height: `${(settings.logo_size || 1) * 50}px`, 
                        maxHeight: '120px',
                        objectFit: 'contain' 
                      }} 
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: settings.logo_text ? settings.logo_text.replace('Motors', '<span className="gold-text">Motors</span>') : 'Brito <span className="gold-text">Motors</span>' }} />
                  )}
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '25px', fontWeight: 700 }}>VISITE <span className="gold-text">NOSSA LOJA</span></h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <MapPin size={20} strokeWidth={1.5} className="gold-text" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 300 }}>Av. das Nações Unidas, 12551 - SP</p>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Phone size={20} strokeWidth={1.5} className="gold-text" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 300 }}>(11) 99581-9077</p>
                  </div>
                </div>

                {/* Social Media Row */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="gold-hover" style={{ color: 'var(--primary-gold)', transition: 'all 0.3s ease' }}>
                    <Instagram size={24} strokeWidth={1.5} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="gold-hover" style={{ color: 'var(--primary-gold)', transition: 'all 0.3s ease' }}>
                    <Facebook size={24} strokeWidth={1.5} />
                  </a>
                  <a href="mailto:contato@britomotors.com.br" className="gold-hover" style={{ color: 'var(--primary-gold)', transition: 'all 0.3s ease' }}>
                    <Mail size={24} strokeWidth={1.5} />
                  </a>
                </div>
              </div>

              <div style={{ height: '350px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.0512270908!2d-46.6945890251!3d-23.6025134789!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50cb680a6711%3A0x1c8b323c9603058a!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%2012551%20-%20Brooklin%20Novo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004578-903!5e0!3m2!1spt-BR!2sbr!4v1710688000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', width: '100%', display: 'block' }}>
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.logo_text || settings.site_name} 
                  style={{ 
                    height: `${(settings.logo_size || 1) * 40}px`, 
                    maxHeight: '100px',
                    objectFit: 'contain' 
                  }} 
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: settings.logo_text ? settings.logo_text.replace('Motors', '<span className="gold-text">Motors</span>') : 'Brito <span className="gold-text">Motors</span>' }} />
              )}
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>© 2024 {settings.site_name || 'Brito Motors'}. Todos os direitos reservados. Design Profissional.</p>
        </div>
      </footer>

      <CarModal 
        car={selectedCar} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
      <SellerFormModal 
        isOpen={isSellerModalOpen} 
        onClose={() => setIsSellerModalOpen(false)} 
      />
      <WhatsAppButton />
      
      {/* Cinematic Bottom Blur Overlay */}
      <GradualBlur
        target="window"
        position="bottom"
        height="6rem"
        strength={6}
        divCount={8}
        exponential
        opacity={1}
        blurColor="#050505"
      />
    </div>
  );
}

export default App;

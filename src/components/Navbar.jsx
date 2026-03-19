import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import MovingBorder from './MovingBorder';
import GlareHover from './GlareHover';
import { useSettings } from '../hooks/useSettings.jsx';
import './Navbar.css';

const Navbar = ({ setSelectedBrand }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const settings = useSettings();

    const handleHomeClick = (e) => {
        // Only trigger if setSelectedBrand is available
        if (setSelectedBrand) {
            setSelectedBrand('Todos');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { name: 'Início', href: '#', onClick: handleHomeClick },
        { name: 'Estoque', href: '#estoque' },
        { name: 'Sobre Nós', href: '#contato' },
        { name: 'Contato', href: '#contato' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <div className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {settings.logo_url ? (
                        <img 
                            src={settings.logo_url} 
                            alt={settings.logo_text || settings.site_name} 
                            style={{ 
                                height: `${(settings.logo_size || 1) * 40}px`, 
                                maxHeight: scrolled ? '50px' : '80px', 
                                objectFit: 'contain' 
                            }} 
                        />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: settings.logo_text ? settings.logo_text.replace('Motors', '<span>Motors</span>') : 'Brito <span>Motors</span>' }} />
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="nav-links">
                    {menuItems.map((item) => (
                        <a 
                            key={item.name} 
                            href={item.href} 
                            className="nav-link"
                            onClick={item.onClick}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="desktop-actions">
                    <MovingBorder
                        duration={4000}
                        rx="50px"
                        color="var(--primary-gold)"
                        background="var(--primary-gold)"
                        className="cta-wrapper"
                    >
                        <button 
                            className="cta-button"
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'black', 
                                fontWeight: 700
                            }}
                            onClick={() => {
                                const message = settings.btn_simulate_msg || "Olá! Vi o site da Brito Motors e gostaria de simular um financiamento para o meu veículo.";
                                window.open(`https://wa.me/${settings.whatsapp_number || '5511995819077'}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                        >
                            {settings.btn_simulate || 'SIMULAR AGORA'}
                        </button>
                    </MovingBorder>
                </div>

                {/* Mobile Hamburger */}
                <div className="mobile-toggle-container">
                    <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                    </div>
                </div>
                <div className="mobile-spacer"></div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="mobile-sidebar"
                    >
                        <div className="mobile-sidebar-header">
                            <div className="logo">
                                {settings.logo_url ? (
                                    <img src={settings.logo_url} alt="logo" style={{ height: '30px' }} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: settings.logo_text ? settings.logo_text.replace('Motors', '<span>Motors</span>') : 'Brito <span>Motors</span>' }} />
                                )}
                            </div>
                            <X size={28} onClick={() => setIsOpen(false)} cursor="pointer" />
                        </div>
                        <div className="mobile-menu-items">
                            {menuItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="mobile-nav-link"
                                    onClick={(e) => {
                                        if (item.onClick) item.onClick(e);
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.name}
                                    <ChevronRight size={18} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="mobile-overlay"
                    />
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

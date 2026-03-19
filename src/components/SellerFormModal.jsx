import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, User, Info, Send } from 'lucide-react';
import './SellerFormModal.css';

const SellerFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demonstration, we'll just log and close
    console.log("Form submitted");
    alert("Obrigado! Recebemos sua solicitação de avaliação. Entraremos em contato em breve.");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="seller-modal-overlay">
          <motion.div 
            className="seller-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="seller-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h1>FORMULÁRIO DE <span className="gold-text">AVALIAÇÃO</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="seller-form">
              {/* VEHICLE DATA */}
              <div className="form-section">
                <div className="section-title">
                  <Car size={18} className="gold-text" />
                  <h3>DADOS DO VEÍCULO</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Marca</label>
                    <input type="text" placeholder="Ex. Volkswagen" required />
                  </div>
                  <div className="form-group">
                    <label>Modelo</label>
                    <input type="text" placeholder="Ex. Golf" required />
                  </div>
                </div>
                <div className="form-grid triple">
                  <div className="form-group">
                    <label>Ano Fab/Modelo</label>
                    <div className="split-input">
                      <input type="text" placeholder="Fab." required />
                      <span>/</span>
                      <input type="text" placeholder="Mod." required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cor</label>
                    <input type="text" placeholder="Ex. Preto" required />
                  </div>
                  <div className="form-group">
                    <label>Combustível</label>
                    <select required>
                      <option value="">Selecione</option>
                      <option value="flex">Flex</option>
                      <option value="gasolina">Gasolina</option>
                      <option value="diesel">Diesel</option>
                      <option value="eletrico">Elétrico/Híbrido</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PERSONAL DATA */}
              <div className="form-section">
                <div className="section-title">
                  <User size={18} className="gold-text" />
                  <h3>DADOS PESSOAIS</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome</label>
                    <input type="text" placeholder="Seu nome" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Seu email" required />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="text" placeholder="DDD + Telefone" required />
                  </div>
                  <div className="form-group">
                    <label>Celular</label>
                    <input type="text" placeholder="DDD + Celular" required />
                  </div>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              <div className="form-section">
                <div className="section-title">
                  <Info size={18} className="gold-text" />
                  <h3>INFORMAÇÕES ADICIONAIS</h3>
                </div>
                <div className="form-group full">
                  <label>Observações</label>
                  <textarea placeholder="Detalhes adicionais sobre o veículo (opcionais)..."></textarea>
                </div>
              </div>

              <div className="form-footer">
                <label className="checkbox-container">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  Li e concordo com a <a href="#privacidade" className="gold-text">política de privacidade</a>
                </label>

                <div className="captcha-placeholder">
                  <div className="captcha-box">
                    <input type="checkbox" id="captcha" />
                    <label htmlFor="captcha">Não sou um robô</label>
                  </div>
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="recaptcha" width="30" />
                </div>

                <button type="submit" className="submit-btn gold-pulse">
                  <Send size={18} />
                  ENVIAR AVALIAÇÃO
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SellerFormModal;

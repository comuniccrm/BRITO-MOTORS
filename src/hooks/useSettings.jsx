import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_SETTINGS = {
  primary_color: '#D4AF37',
  button_bg_color: '#D4AF37',
  button_text_color: '#000000',
  whatsapp_number: '5511995819077',
  logo_text: 'Brito Motors',
  logo_url: '',
  logo_size: '1',
  site_name: 'Brito Motors',
  hero_title: 'Veículos Premium',
  hero_subtitle: 'Experiência única em cada detalhe',
  hero_bg: '',
  btn_simulate: 'SIMULAR AGORA',
  btn_see_car: 'VER CARRO',
  btn_sell: 'VENDA SEU CARRO AQUI',
};

const SettingsContext = createContext(DEFAULT_SETTINGS);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').order('updated_at', { ascending: true });
        if (data && data.length > 0) {
          const obj = { ...DEFAULT_SETTINGS };
          data.forEach(row => { obj[row.key] = row.value; });
          console.log('Site settings loaded:', obj);
          setSettings(obj);

          // Helper to convert hex to RGB for CSS variables
          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
          };
          // Apply CSS custom properties for theming
          if (obj.primary_color) {
            document.documentElement.style.setProperty('--primary-gold', obj.primary_color);
            const rgb = hexToRgb(obj.primary_color);
            if (rgb) document.documentElement.style.setProperty('--primary-gold-rgb', rgb);
          }
          if (obj.button_bg_color) {
            document.documentElement.style.setProperty('--btn-bg', obj.button_bg_color);
          }
          if (obj.button_text_color) {
            document.documentElement.style.setProperty('--btn-text', obj.button_text_color);
          }
          if (obj.button_bg_color) {
            document.documentElement.style.setProperty('--btn-bg', obj.button_bg_color);
          }
          if (obj.button_text_color) {
            document.documentElement.style.setProperty('--btn-text', obj.button_text_color);
          }
        }
      } catch (err) {
        console.warn('Settings fetch failed, using defaults:', err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

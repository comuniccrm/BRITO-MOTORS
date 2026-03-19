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
        const { data } = await supabase.from('site_settings').select('*');
        if (data && data.length > 0) {
          const obj = { ...DEFAULT_SETTINGS };
          data.forEach(row => { obj[row.key] = row.value; });
          setSettings(obj);

          // Apply CSS custom property for primary color so the whole site reacts
          if (obj.primary_color) {
            document.documentElement.style.setProperty('--primary-gold', obj.primary_color);
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

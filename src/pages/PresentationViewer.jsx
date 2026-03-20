import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { playfair } from '../lib/fonts';
import { useSettings } from '../hooks/useSettings';
import './PresentationViewer.css';

export default function PresentationViewer() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings(); // headless apply colors & favicon

  useEffect(() => {
    fetchMedia();
    document.title = "Apresentação VIP - " + (settings?.site_name || "Brito Motors");
    
    // Hide overflow on body to make it a perfect app-like experience if needed, 
    // but since we want infinite scroll, we allow Y scroll
    document.body.style.margin = "0";
    document.body.style.background = "#000";
    document.body.style.color = "#fff";
    
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, [settings?.site_name]);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'presentation_media')
        .single();
        
      if (!error && data?.value) {
        setMediaList(JSON.parse(data.value));
      }
    } catch (error) {
      console.error('Error fetching presentation media:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (mediaList.length === 0) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexColum: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#D4AF37', fontFamily: playfair, textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Nenhuma Apresentação Ativa</h1>
        <p style={{ color: '#aaa', fontFamily: "'Montserrat', sans-serif" }}>Aguarde o administrador configurar os materiais.</p>
      </div>
    );
  }

  return (
    <div className="presentation-container">
      {/* Discreet Header Logo */}
      <div className="presentation-header">
        {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="presentation-logo" />
        ) : (
          <h1 className="presentation-logo-text" style={{ fontFamily: playfair }}>
            {settings?.logo_text || "Brito Motors"}
          </h1>
        )}
      </div>

      {/* Infinite Scroll / Snap Container */}
      <div className="presentation-feed">
        {mediaList.map((media, index) => (
          <div key={media.id} className="presentation-slide">
            {media.type === 'video' ? (
              <video 
                src={media.url} 
                className="presentation-media"
                controls 
                autoPlay={index === 0}
                muted={index === 0} 
                playsInline
                loop
              />
            ) : (
              <img 
                src={media.url} 
                className="presentation-media"
                alt={`Slide ${index + 1}`} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

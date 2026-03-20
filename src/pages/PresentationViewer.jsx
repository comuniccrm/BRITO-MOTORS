import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';
import './PresentationViewer.css';

export default function PresentationViewer() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings(); // headless apply colors & favicon

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchMedia();
    document.title = "Apresentação VIP - " + (settings?.site_name || "Brito Motors");
    
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
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexColum: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#D4AF37', fontFamily: "'Playfair Display', serif", textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Nenhuma Apresentação Ativa</h1>
        <p style={{ color: '#aaa', fontFamily: "'Montserrat', sans-serif" }}>Aguarde o administrador configurar os materiais.</p>
      </div>
    );
  }

  // Get active media
  const activeMedia = mediaList[activeIndex];
  let activeVideoSrc = activeMedia?.url;
  if (activeMedia?.type === 'video' && (activeMedia.startTime || activeMedia.endTime)) {
    const start = activeMedia.startTime || '0';
    const end = activeMedia.endTime ? `,${activeMedia.endTime}` : '';
    activeVideoSrc = `${activeMedia.url}#t=${start}${end}`;
  }

  return (
    <div className="presentation-container">
      {/* Discreet Header Logo */}
      <div className="presentation-header">
        {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="presentation-logo" />
        ) : (
          <h1 className="presentation-logo-text">
            {settings?.logo_text || "Brito Motors"}
          </h1>
        )}
      </div>

      {/* Main Hero Background (Netflix Stage) */}
      <div className="presentation-hero">
        {activeMedia?.type === 'video' ? (
          <video 
            key={activeVideoSrc} // Force re-render on source change
            src={activeVideoSrc} 
            className="presentation-media-main"
            style={{ objectFit: activeMedia.displayMode || 'contain' }}
            autoPlay
            controls
            playsInline
            loop
          />
        ) : (
          <img 
            key={activeMedia?.url} // Force re-render exactly
            src={activeMedia?.url} 
            className="presentation-media-main"
            style={{ objectFit: activeMedia?.displayMode || 'contain' }}
            alt="Hero Presentation" 
          />
        )}
      </div>

      {/* Netflix Bottom Vignette Overlay */}
      <div className="presentation-vignette"></div>

      {/* Bottom Thumbnails Carousel */}
      <div className="presentation-carousel-container">
        <div className="presentation-carousel-title">Minha Lista VIP</div>
        <div className="presentation-carousel">
          {mediaList.map((media, index) => {
            const isActive = index === activeIndex;

            return (
              <div 
                key={media.id} 
                className={`presentation-thumbnail ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {media.type === 'video' ? (
                  <>
                    <video 
                      src={`${media.url}#t=0.1`} // Load just the first frame as poster
                      className="presentation-thumbnail-media"
                      muted
                      playsInline
                    />
                    {!isActive && <div className="presentation-thumbnail-icon">▶</div>}
                  </>
                ) : (
                  <img 
                    src={media.url} 
                    className="presentation-thumbnail-media"
                    alt={`Thumbnail ${index + 1}`} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

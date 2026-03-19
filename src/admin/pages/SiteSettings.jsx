import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Phone, Palette, Type, Image } from 'lucide-react';

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Montserrat', sans-serif"
};
const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };
const sectionStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '20px' };
const sectionTitleStyle = { color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' };

export default function SiteSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLogoMobile, setUploadingLogoMobile] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    const obj = {};
    data?.forEach(row => { obj[row.key] = row.value; });
    setSettings(obj);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    if (key === 'logo_url') setUploadingLogo(true);
    else if (key === 'logo_url_mobile') setUploadingLogoMobile(true);
    else setUploadingHero(true);
    const folder = key.includes('logo') ? 'logo' : 'hero';
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      handleChange(key, urlData.publicUrl);
    }
    setUploadingLogo(false);
    setUploadingLogoMobile(false);
    setUploadingHero(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '60px' }}>Carregando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Configurações</h1>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: saved ? '#22c55e' : '#D4AF37', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif", transition: 'background 0.3s' }}>
          <Save size={15} /> {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Tudo'}
        </button>
      </div>

      {/* Brand / Logo */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Image size={16} /> Logo e Nome da Empresa</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nome do Site</label>
            <input value={settings.site_name || ''} onChange={e => handleChange('site_name', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Texto da Logo</label>
            <input value={settings.logo_text || ''} onChange={e => handleChange('logo_text', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tamanho da Logo (1 = normal)</label>
            <input type="number" step="0.1" min="0.5" max="3" value={settings.logo_size || '1'} onChange={e => handleChange('logo_size', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PNG da Logo (Desktop)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.logo_url || ''} onChange={e => handleChange('logo_url', e.target.value)} placeholder="URL ou faça upload" style={{ ...inputStyle, flex: 1 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 12px', color: '#D4AF37', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                <Upload size={14} />{uploadingLogo ? '...' : 'PNG'}
                <input type="file" accept="image/png,image/*" onChange={e => handleUpload(e, 'logo_url')} style={{ display: 'none' }} />
              </label>
            </div>
            {settings.logo_url && <img src={settings.logo_url} alt="logo" style={{ height: '40px', objectFit: 'contain', marginTop: '8px' }} />}
          </div>
          <div>
            <label style={labelStyle}>PNG da Logo (Celular - Opcional)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.logo_url_mobile || ''} onChange={e => handleChange('logo_url_mobile', e.target.value)} placeholder="URL ou faça upload" style={{ ...inputStyle, flex: 1 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 12px', color: '#D4AF37', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                <Upload size={14} />{uploadingLogoMobile ? '...' : 'PNG'}
                <input type="file" accept="image/png,image/*" onChange={e => handleUpload(e, 'logo_url_mobile')} style={{ display: 'none' }} />
              </label>
            </div>
            {settings.logo_url_mobile && <img src={settings.logo_url_mobile} alt="logo mobile" style={{ height: '40px', objectFit: 'contain', marginTop: '8px' }} />}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Image size={16} /> Banner do Hero</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Título do Hero</label>
            <input value={settings.hero_title || ''} onChange={e => handleChange('hero_title', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Subtítulo do Hero</label>
            <input value={settings.hero_subtitle || ''} onChange={e => handleChange('hero_subtitle', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Imagem de Fundo do Hero</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.hero_bg || ''} onChange={e => handleChange('hero_bg', e.target.value)} placeholder="URL da imagem ou faça upload" style={{ ...inputStyle, flex: 1 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 12px', color: '#D4AF37', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                <Upload size={14} />{uploadingHero ? '...' : 'Upload'}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, 'hero_bg')} style={{ display: 'none' }} />
              </label>
            </div>
            {settings.hero_bg && <img src={settings.hero_bg} alt="hero bg" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Palette size={16} /> Cores do Site</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { key: 'primary_color', label: 'Cor Primária (Dourado)' },
            { key: 'button_bg_color', label: 'Fundo dos Botões' },
            { key: 'button_text_color', label: 'Texto dos Botões' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={settings[key] || '#D4AF37'} onChange={e => handleChange(key, e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', padding: '0' }} />
                <input value={settings[key] || ''} onChange={e => handleChange(key, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Texts / Buttons */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Type size={16} /> Textos dos Botões</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { key: 'btn_simulate', label: 'Botão "Simular" (Navbar)' },
            { key: 'btn_see_car', label: 'Botão "Ver Carro"' },
            { key: 'btn_sell', label: 'Botão "Vender Meu Carro"' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input value={settings[key] || ''} onChange={e => handleChange('btn_simulate', e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Phone size={16} /> WhatsApp</p>
        <div style={{ maxWidth: '400px' }}>
          <label style={labelStyle}>Número com DDI (ex: 5511999999999)</label>
          <input value={settings.whatsapp_number || ''} onChange={e => handleChange('whatsapp_number', e.target.value)} placeholder="5511995819077" style={inputStyle} />
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '8px' }}>Somente números, sem espaços ou símbolos.</p>
        </div>
      </div>
    </div>
  );
}

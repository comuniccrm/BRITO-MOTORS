import React, { useState, useEffect } from 'react';
import { Save, Upload, Trash2, Smartphone, Layout, Type } from 'lucide-react';
import { supabase } from '../../lib/supabase';
<<<<<<< HEAD

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    logo_url: '',
    logo_url_mobile: '',
    logo_size: '150',
    logo_size_mobile: '100', // Initialize mobile size
    hero_bg: '',
    hero_text_1: '',
    hero_text_1_size: '1',
    hero_text_1_color: '#ffffff',
    hero_text_2: '',
    hero_text_2_size: '1',
    hero_text_2_color: '#ffffff',
    hero_text_3: '',
    hero_text_3_size: '1',
    hero_text_3_color: '#ffffff',
    banner_url_mobile: '', // New field for mobile static banner
    whatsapp_number: '',
    primary_color: '#D4AF37',
    footer_text: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);
=======
import { Save, Upload, Phone, Palette, Type, Image, Smartphone } from 'lucide-react';

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Montserrat', sans-serif"
};
const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };
const sectionStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '20px' };
const sectionTitleStyle = { color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' };

const btnPrimaryStyle = { 
  display: 'flex', alignItems: 'center', gap: '10px', 
  background: '#D4AF37', background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', 
  color: '#000', 
  border: 'none', borderRadius: '50px', padding: '12px 28px', 
  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', 
  textTransform: 'uppercase', letterSpacing: '1.5px', 
  fontFamily: "'Montserrat', sans-serif", 
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 8px 30px rgba(212,175,55,0.3)',
  outline: 'none'
};

const btnSecondaryStyle = { 
  display: 'flex', alignItems: 'center', gap: '6px', 
  background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', 
  borderRadius: '8px', padding: '10px 16px', color: '#D4AF37', 
  cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem', 
  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
  fontFamily: "'Montserrat', sans-serif",
  transition: 'all 0.2s ease'
};

export default function SiteSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLogoMobile, setUploadingLogoMobile] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingHeroMobile, setUploadingHeroMobile] = useState(false);
  const [saved, setSaved] = useState(false);
>>>>>>> cb6d3c1 (update logo colors)

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Create an object from the array of settings
        const settingsObj = {};
        data.forEach(item => {
          settingsObj[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
<<<<<<< HEAD
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${key}-${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      handleChange(key, publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setSaving(false);
=======
      if (key === 'logo_url') setUploadingLogo(true);
      else if (key === 'logo_url_mobile') setUploadingLogoMobile(true);
      else if (key === 'banner_url_mobile') setUploadingHeroMobile(true);
      else setUploadingHero(true);

      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      handleChange(key, urlData.publicUrl);
    } catch (error) {
      console.error('Erro detalhado no upload:', error);
      const errorMsg = error.message || error.error_description || 'Erro desconhecido';
      alert(`Erro ao fazer upload da imagem: ${errorMsg}`);
    } finally {
      setUploadingLogo(false);
      setUploadingLogoMobile(false);
      setUploadingHero(false);
      setUploadingHeroMobile(false);
>>>>>>> cb6d3c1 (update logo colors)
    }
  };

  const handleSave = async () => {
<<<<<<< HEAD
    try {
      setSaving(true);
      
      // Prepare settings for upsert
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value)
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(upsertData, { onConflict: 'key' });

      if (error) throw error;
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
=======
    setSaving(true);
    // Use upsert to update existing keys or insert new ones
    const updates = Object.entries(settings).map(([key, value]) => ({
      key, 
      value: String(value),
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
    if (error) console.error('Error saving settings:', error);
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
>>>>>>> cb6d3c1 (update logo colors)
  };

  if (loading) return <div className="admin-loading">Carregando...</div>;

  const sectionStyle = {
    background: 'rgba(255,255,255,0.03)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#9ca3af'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
<<<<<<< HEAD
    <div className="admin-page">
      <div className="admin-header">
        <h1>Configurações do Site</h1>
        <button 
          className="admin-btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={20} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
        {/* Logos Section */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Layout className="text-primary-gold" size={24} />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Logotipos e Identidade</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Logo Principal (Desktop)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={settings.logo_url || ''} readOnly style={inputStyle} />
                <label className="admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={18} />
                  Upload
                  <input type="file" hidden onChange={e => handleFileUpload(e, 'logo_url')} />
                </label>
              </div>
              <div style={{ marginTop: '10px' }}>
                <label style={labelStyle}>Tamanho da Logo (px)</label>
                <input type="number" value={settings.logo_size || '150'} onChange={e => handleChange('logo_size', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Logo Mobile (Específico Celular)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={settings.logo_url_mobile || ''} readOnly style={inputStyle} />
                <label className="admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Smartphone size={18} />
                  Upload
                  <input type="file" hidden onChange={e => handleFileUpload(e, 'logo_url_mobile')} />
                </label>
              </div>
              <div style={{ marginTop: '10px' }}>
                <label style={labelStyle}>Tamanho Logo Celular (px)</label>
                <input type="number" value={settings.logo_size_mobile || '100'} onChange={e => handleChange('logo_size_mobile', e.target.value)} style={inputStyle} />
              </div>
            </div>
=======
    <div style={{ padding: '30px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Configurações do Site</h1>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          style={{ ...btnPrimaryStyle, background: saved ? '#22c55e' : '#D4AF37' }}
        >
          <Save size={16} /> {saving ? 'Salvando...' : saved ? 'Alterações Salvas!' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Brand / Logo */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Image size={16} /> Logotipos e Identidade</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Logo Principal (Desktop)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.logo_url || ''} readOnly style={{ ...inputStyle, flex: 1 }} />
              <label style={btnSecondaryStyle}>
                <Upload size={14} /> {uploadingLogo ? '...' : 'Upload'}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, 'logo_url')} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Tamanho da Logo (px)</label>
              <input type="number" value={settings.logo_size || '150'} onChange={e => handleChange('logo_size', e.target.value)} style={inputStyle} />
            </div>
            {settings.logo_url && <img src={settings.logo_url} alt="logo" style={{ height: '40px', objectFit: 'contain', marginTop: '12px' }} />}
          </div>

          <div>
            <label style={labelStyle}>Logo Mobile (Específico Celular)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.logo_url_mobile || ''} readOnly style={{ ...inputStyle, flex: 1 }} />
              <label style={btnSecondaryStyle}>
                <Upload size={14} /> {uploadingLogoMobile ? '...' : 'Upload'}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, 'logo_url_mobile')} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Tamanho Logo Celular (px)</label>
              <input type="number" value={settings.logo_size_mobile || '100'} onChange={e => handleChange('logo_size_mobile', e.target.value)} style={inputStyle} />
            </div>
            {settings.logo_url_mobile && <img src={settings.logo_url_mobile} alt="logo mobile" style={{ height: '40px', objectFit: 'contain', marginTop: '12px' }} />}
>>>>>>> cb6d3c1 (update logo colors)
          </div>
        </div>

<<<<<<< HEAD
        {/* Hero Section */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Type className="text-primary-gold" size={24} />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Banner Hero e Textos Dinâmicos</h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Fundo do Hero (Backup)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={settings.hero_bg || ''} readOnly style={inputStyle} />
              <label className="admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={18} />
                Upload
                <input type="file" hidden onChange={e => handleFileUpload(e, 'hero_bg')} />
=======
      {/* Hero Banner */}
      <div style={sectionStyle}>
        <p style={sectionTitleStyle}><Type size={16} /> Banner Hero e Textos Dinâmicos</p>
        <div>
          <label style={labelStyle}>Fundo do Hero (Backup)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <input value={settings.hero_bg || ''} readOnly style={{ ...inputStyle, flex: 1 }} />
            <label style={btnSecondaryStyle}>
              <Upload size={14} /> {uploadingHero ? '...' : 'Upload'}
              <input type="file" accept="image/*" onChange={e => handleUpload(e, 'hero_bg')} style={{ display: 'none' }} />
            </label>
          </div>
          {settings.hero_bg && <img src={settings.hero_bg} alt="hero bg" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }} />}
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 1 (Blur Effect)</label>
              <input value={settings.hero_text_1 || ''} onChange={e => handleChange('hero_text_1', e.target.value)} placeholder="Frase 1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho (Título)</label>
              <input type="number" step="0.1" value={settings.hero_text_1_size || '1'} onChange={e => handleChange('hero_text_1_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_1_color || '#ffffff'} onChange={e => handleChange('hero_text_1_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 2 (Blur Effect)</label>
              <input value={settings.hero_text_2 || ''} onChange={e => handleChange('hero_text_2', e.target.value)} placeholder="Frase 2" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho</label>
              <input type="number" step="0.1" value={settings.hero_text_2_size || '1'} onChange={e => handleChange('hero_text_2_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_2_color || '#ffffff'} onChange={e => handleChange('hero_text_2_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 3 (Blur Effect)</label>
              <input value={settings.hero_text_3 || ''} onChange={e => handleChange('hero_text_3', e.target.value)} placeholder="Frase 3" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho</label>
              <input type="number" step="0.1" value={settings.hero_text_3_size || '1'} onChange={e => handleChange('hero_text_3_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_3_color || '#ffffff'} onChange={e => handleChange('hero_text_3_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Banner do Hero (Celular - Estático)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input value={settings.banner_url_mobile || ''} readOnly style={{ ...inputStyle, flex: 1 }} />
              <label style={btnSecondaryStyle}>
                <Upload size={14} /> {uploadingHeroMobile ? '...' : 'Upload Banner Mobile'}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, 'banner_url_mobile')} style={{ display: 'none' }} />
>>>>>>> cb6d3c1 (update logo colors)
              </label>
            </div>
            {settings.banner_url_mobile && <img src={settings.banner_url_mobile} alt="mobile banner" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '12px' }} />}
          </div>

<<<<<<< HEAD
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 1 (Blur Effect)</label>
              <input value={settings.hero_text_1 || ''} onChange={e => handleChange('hero_text_1', e.target.value)} placeholder="Frase 1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho (Título)</label>
              <input type="number" step="0.1" value={settings.hero_text_1_size || '1'} onChange={e => handleChange('hero_text_1_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_1_color || '#ffffff'} onChange={e => handleChange('hero_text_1_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '12px', alignItems: 'end', marginTop: '16px' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 2 (Blur Effect)</label>
              <input value={settings.hero_text_2 || ''} onChange={e => handleChange('hero_text_2', e.target.value)} placeholder="Frase 2" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho</label>
              <input type="number" step="0.1" value={settings.hero_text_2_size || '1'} onChange={e => handleChange('hero_text_2_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_2_color || '#ffffff'} onChange={e => handleChange('hero_text_2_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px', gap: '12px', alignItems: 'end', marginTop: '16px' }}>
            <div>
              <label style={labelStyle}>Texto Alternado 3 (Blur Effect)</label>
              <input value={settings.hero_text_3 || ''} onChange={e => handleChange('hero_text_3', e.target.value)} placeholder="Frase 3" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tamanho</label>
              <input type="number" step="0.1" value={settings.hero_text_3_size || '1'} onChange={e => handleChange('hero_text_3_size', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cor</label>
              <input type="color" value={settings.hero_text_3_color || '#ffffff'} onChange={e => handleChange('hero_text_3_color', e.target.value)} style={{ ...inputStyle, padding: '2px', height: '38px' }} />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
            <label style={labelStyle}>Banner do Hero (Celular - Estático)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={settings.banner_url_mobile || ''} readOnly style={inputStyle} />
              <label className="admin-btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={18} />
                Upload Banner Mobile
                <input type="file" hidden onChange={e => handleFileUpload(e, 'banner_url_mobile')} />
              </label>
            </div>
          </div>
        </div>

        {/* Contact & Footer */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Smartphone className="text-primary-gold" size={24} />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Contato e Rodapé</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>WhatsApp (Ex: 5511999999999)</label>
              <input value={settings.whatsapp_number || ''} onChange={e => handleChange('whatsapp_number', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Texto do Rodapé</label>
              <input value={settings.footer_text || ''} onChange={e => handleChange('footer_text', e.target.value)} style={inputStyle} />
            </div>
          </div>
=======
      {/* Colors & Contact */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}><Palette size={16} /> Cores e Contato</p>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>WhatsApp (ex: 5511995819077)</label>
            <input value={settings.whatsapp_number || ''} onChange={e => handleChange('whatsapp_number', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cor Primária</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="color" value={settings.primary_color || '#D4AF37'} onChange={e => handleChange('primary_color', e.target.value)} style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                <input value={settings.primary_color || ''} onChange={e => handleChange('primary_color', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
        
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}><Smartphone size={16} /> Rodapé</p>
          <label style={labelStyle}>Texto do Rodapé</label>
          <textarea 
            value={settings.footer_text || ''} 
            onChange={e => handleChange('footer_text', e.target.value)} 
            rows={4}
            style={{ ...inputStyle, height: 'auto', resize: 'none' }}
          />
>>>>>>> cb6d3c1 (update logo colors)
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;

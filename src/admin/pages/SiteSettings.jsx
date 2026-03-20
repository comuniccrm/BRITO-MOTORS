import React, { useState, useEffect } from 'react';
import { Save, Upload, Trash2, Smartphone, Layout, Type } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
    }
  };

  const handleSave = async () => {
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
          </div>
        </div>

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
              </label>
            </div>
            {settings.banner_url_mobile && <img src={settings.banner_url_mobile} alt="mobile banner" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '12px' }} />}
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;


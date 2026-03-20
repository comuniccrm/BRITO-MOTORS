import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, ArrowUp, ArrowDown, Save, MonitorPlay, Copy, Check } from 'lucide-react';

export default function PresentationManager() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'presentation_media')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.value) {
        try {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed)) setMediaList(parsed);
        } catch(e) { console.error('Error parsing media JSON:', e); }
      }
    } catch (error) {
      console.error('Error fetching presentation media:', error.message);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `presentation/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const type = file.type.startsWith('video') ? 'video' : 'image';
      
      const newMedia = {
        id: Math.random().toString(36).substring(7),
        url: publicUrl,
        type: type
      };

      setMediaList(prev => [...prev, newMedia]);
      
    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert('Erro ao fazer upload do arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (id) => {
    if (!confirm('Deseja remover esta mídia?')) return;
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  const moveMedia = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === mediaList.length - 1) return;

    const newList = [...mediaList];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    setMediaList(newList);
  };

  const saveToDatabase = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'presentation_media',
          value: JSON.stringify(mediaList) 
        }, { onConflict: 'key' });

      if (error) throw error;
      alert('Apresentação salva com sucesso!');
    } catch (error) {
      console.error('Error saving presentation:', error.message);
      alert('Erro ao salvar apresentação.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/apresentacao`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerStyle = { padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' };
  const cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(212,175,55,0.2)' };
  
  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MonitorPlay size={32} /> Apresentação VIP
          </h1>
          <p style={{ color: '#aaa', margin: 0 }}>Crie um portfólio luxuoso e exclusivo para enviar aos seus clientes.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={copyLink}
            className="admin-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          >
            {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
            {copied ? 'Link Copiado' : 'Copiar Link'}
          </button>
          
          <button 
            onClick={saveToDatabase} 
            disabled={loading}
            className="admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, textAlign: 'center', borderStyle: 'dashed' }}>
        <input
          type="file"
          id="upload-media"
          hidden
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label 
          htmlFor="upload-media" 
          style={{ 
            cursor: uploading ? 'not-allowed' : 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '15px 30px',
            background: 'rgba(212,175,55,0.1)',
            color: '#D4AF37',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          <Upload size={24} />
          {uploading ? 'Enviando Arquivo...' : 'Fazer Upload de Foto ou Vídeo'}
        </label>
        <p style={{ marginTop: '15px', color: '#888', fontSize: '0.9rem' }}>Formatos aceitos: JPG, PNG, MP4. Sem limite rígido de tamanho.</p>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {mediaList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            Nenhuma mídia adicionada à apresentação ainda.
          </div>
        ) : (
          mediaList.map((media, index) => (
            <div key={media.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              background: 'rgba(255,255,255,0.05)', 
              padding: '15px', 
              borderRadius: '8px',
              borderLeft: '4px solid #D4AF37'
            }}>
              
              <div style={{ width: '120px', height: '80px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', background: '#000' }}>
                {media.type === 'video' ? (
                  <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                ) : (
                  <img src={media.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '5px' }}>
                  {media.type === 'video' ? '🎬 Vídeo' : '📸 Imagem'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', wordBreak: 'break-all' }}>
                  {media.url}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button 
                    onClick={() => moveMedia(index, -1)}
                    disabled={index === 0}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: index === 0 ? '#444' : 'white', padding: '5px', borderRadius: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => moveMedia(index, 1)}
                    disabled={index === mediaList.length - 1}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: index === mediaList.length - 1 ? '#444' : 'white', padding: '5px', borderRadius: '4px', cursor: index === mediaList.length - 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeMedia(media.id)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Check, Upload } from 'lucide-react';

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Montserrat', sans-serif"
};

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', logo: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const openNew = () => { setForm({ name: '', logo: '' }); setEditId(null); setShowForm(true); };
  const openEdit = (b) => { setForm({ name: b.name, logo: b.logo || '' }); setEditId(b.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `brands/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setForm(f => ({ ...f, logo: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      await supabase.from('brands').update({ name: form.name, logo: form.logo }).eq('id', editId);
    } else {
      await supabase.from('brands').insert({ name: form.name, logo: form.logo });
    }
    await fetchBrands();
    closeForm();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirmar exclusão?')) return;
    await supabase.from('brands').delete().eq('id', id);
    fetchBrands();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Marcas</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>{brands.length} marca{brands.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>
          <Plus size={16} /> Nova Marca
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '60px' }}>Carregando...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
          {brands.map(brand => (
            <div key={brand.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', textAlign: 'center', position: 'relative' }}>
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} style={{ width: '60px', height: '40px', objectFit: 'contain', marginBottom: '10px', filter: 'brightness(0.9)' }} />
              ) : (
                <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', margin: '0 auto 10px' }} />
              )}
              <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{brand.name}</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
                <button onClick={() => openEdit(brand)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#fff', cursor: 'pointer' }}><Pencil size={12} /></button>
                <button onClick={() => handleDelete(brand.id)} style={{ background: 'rgba(255,70,70,0.08)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{editId ? 'Editar Marca' : 'Nova Marca'}</h2>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Nome da Marca</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>Logo (URL ou Upload PNG)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="URL do logo" style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 12px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />{uploading ? '...' : 'PNG'}
                    <input type="file" accept="image/png,image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.logo && <img src={form.logo} alt="preview" style={{ height: '50px', objectFit: 'contain', marginTop: '10px' }} />}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={closeForm} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 18px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{ background: '#D4AF37', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

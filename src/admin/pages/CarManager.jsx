import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Check, Upload, Image } from 'lucide-react';

const EMPTY_CAR = { name: '', brand: '', year: '', km: '', price: '', engine: '', transmission: '', image: '', description: '', gallery: [] };

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Montserrat', sans-serif"
};

const labelStyle = { color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };

export default function CarManager() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState(EMPTY_CAR);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [carsRes, brandsRes] = await Promise.all([
      supabase.from('cars').select('*').order('created_at', { ascending: false }),
      supabase.from('brands').select('*').eq('is_active', true).order('name')
    ]);

    if (carsRes.error) {
       console.error('Error fetching cars:', carsRes.error);
       alert(`Erro ao carregar veículos: ${carsRes.error.message}`);
    }
    if (brandsRes.error) console.error('Error fetching brands:', brandsRes.error);

    setCars(carsRes.data || []);
    setBrands(brandsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setForm(EMPTY_CAR); setEditCar(null); setShowForm(true); };
  const openEdit = (car) => { setForm({ ...car }); setEditCar(car.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditCar(null); setForm(EMPTY_CAR); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `cars/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setForm(f => ({ ...f, image: urlData.publicUrl }));
    } else {
      // Fallback: show error
      alert('Erro ao fazer upload. Verifique se o bucket "images" existe no Supabase Storage.');
    }
    setUploading(false);
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    
    const newImages = [];
    for (const file of files) {
      const fileName = `cars/gallery/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { data, error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        newImages.push(urlData.publicUrl);
      }
    }
    
    setForm(f => ({ ...f, gallery: [...(f.gallery || []), ...newImages] }));
    setUploading(false);
  };

  const removeGalleryImage = (index) => {
    setForm(f => ({
      ...f,
      gallery: f.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name, brand: form.brand, year: form.year, km: form.km,
      price: form.price, engine: form.engine, transmission: form.transmission,
      image: form.image, description: form.description,
      gallery: form.gallery || [form.image].filter(Boolean),
      is_active: true,
      updated_at: new Date().toISOString()
    };
    if (editCar) {
      await supabase.from('cars').update(payload).eq('id', editCar);
    } else {
      await supabase.from('cars').insert(payload);
    }
    await fetchData();
    closeForm();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirmar exclusão?')) return;
    await supabase.from('cars').delete().eq('id', id);
    fetchData();
  };

  const toggleActive = async (car) => {
    await supabase.from('cars').update({ is_active: !car.is_active }).eq('id', car.id);
    fetchData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Estoque</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>{cars.length} veículo{cars.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>
          <Plus size={16} /> Novo Carro
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '60px' }}>Carregando...</p>
      ) : cars.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '60px' }}>Nenhum carro cadastrado ainda.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {cars.map(car => (
            <div key={car.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${car.is_active ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ height: '160px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
                {car.image ? (
                  <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.1)' }}><Image size={40} /></div>
                )}
                {!car.is_active && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#ff4d4d', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Inativo</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ color: '#D4AF37', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{car.brand}</p>
                <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 2px' }}>{car.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{car.year} · {car.km}</p>
                <p style={{ color: '#D4AF37', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}>{car.price}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button onClick={() => openEdit(car)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '6px', padding: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Montserrat', sans-serif" }}><Pencil size={13} /> Editar</button>
                  <button onClick={() => toggleActive(car)} style={{ background: car.is_active ? 'rgba(255,255,255,0.06)' : 'rgba(212,175,55,0.1)', border: 'none', borderRadius: '6px', padding: '8px 12px', color: car.is_active ? 'rgba(255,255,255,0.5)' : '#D4AF37', cursor: 'pointer', fontSize: '0.65rem', fontFamily: "'Montserrat', sans-serif" }}>{car.is_active ? 'Ocultar' : 'Ativar'}</button>
                  <button onClick={() => handleDelete(car.id)} style={{ background: 'rgba(255,70,70,0.08)', border: 'none', borderRadius: '6px', padding: '8px 12px', color: '#ff6b6b', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{editCar ? 'Editar Carro' : 'Novo Carro'}</h2>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { name: 'name', label: 'Nome do Carro', full: true },
                { name: 'brand', label: 'Marca', isBrand: true },
                { name: 'year', label: 'Ano' },
                { name: 'km', label: 'Quilometragem' },
                { name: 'price', label: 'Preço' },
                { name: 'engine', label: 'Motor' },
                { name: 'transmission', label: 'Câmbio' },
              ].map(field => (
                <div key={field.name} style={{ gridColumn: field.full ? '1 / -1' : 'span 1', position: 'relative' }}>
                  <label style={labelStyle}>{field.label}</label>
                  {field.isBrand ? (
                    <>
                      <div 
                        onClick={() => setShowBrandSelector(!showBrandSelector)}
                        style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {brands.find(b => b.name === form.brand)?.logo && (
                            <img src={brands.find(b => b.name === form.brand).logo} alt="" style={{ height: '18px', width: '30px', objectFit: 'contain' }} />
                          )}
                          <span>{form.brand || 'Selecionar Marca'}</span>
                        </div>
                        <Plus size={16} />
                      </div>
                      {showBrandSelector && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '12px', zIndex: 1100, marginTop: '8px', padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxHeight: '280px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                          {brands.map(brand => (
                            <div 
                              key={brand.id}
                              onClick={() => { setForm(f => ({ ...f, brand: brand.name })); setShowBrandSelector(false); }}
                              style={{ padding: '10px 6px', borderRadius: '8px', background: form.brand === brand.name ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.brand === brand.name ? 'rgba(212,175,55,0.3)' : 'transparent'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease' }}
                            >
                              {brand.logo ? (
                                <img src={brand.logo} alt={brand.name} style={{ height: '24px', width: '100%', objectFit: 'contain', marginBottom: '6px' }} />
                              ) : <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>---</div>}
                              <div style={{ fontSize: '9px', fontWeight: 600, color: form.brand === brand.name ? '#D4AF37' : 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <input name={field.name} value={form[field.name] || ''} onChange={handleChange} style={inputStyle} />
                  )}
                </div>
              ))}

              {/* Image Upload */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Foto Principal</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input name="image" value={form.image || ''} onChange={handleChange} placeholder="URL da imagem ou faça upload" style={{ ...inputStyle, flex: 1, minWidth: '200px' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    <Upload size={14} /> {uploading ? 'Enviando...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Galeria de Fotos (Mais imagens)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  {form.gallery?.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removeGalleryImage(idx)}
                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(255,0,0,0.7)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: '#fff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.3)', borderRadius: '6px', cursor: 'pointer', color: '#D4AF37' }}>
                    <Plus size={20} />
                    <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={closeForm} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 20px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{ background: '#D4AF37', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                {saving ? 'Salvando...' : <><Check size={14} style={{ marginRight: 6 }} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

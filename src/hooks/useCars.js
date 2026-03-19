import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CARS as FALLBACK_CARS, BRANDS as FALLBACK_BRANDS } from '../data/cars';

export function useCars() {
  const [cars, setCars] = useState(FALLBACK_CARS);
  const [brands, setBrands] = useState(FALLBACK_BRANDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          supabase.from('cars').select('*').eq('is_active', true).order('created_at', { ascending: false }),
          supabase.from('brands').select('*').eq('is_active', true).order('name'),
        ]);

        if (carsRes.error) console.error('Supabase Cars Error:', carsRes.error);
        if (brandsRes.error) console.error('Supabase Brands Error:', brandsRes.error);

        if (carsRes.data && carsRes.data.length > 0) {
          const normalized = carsRes.data.map(c => ({
            id: c.id,
            name: c.name,
            brand: c.brand,
            year: c.year,
            km: c.km,
            price: c.price,
            engine: c.engine || '',
            transmission: c.transmission || '',
            image: c.image || '',
            gallery: Array.isArray(c.gallery) ? c.gallery : [c.image].filter(Boolean),
            description: c.description || '',
          }));
          setCars(normalized);
        }

        if (brandsRes.data && brandsRes.data.length > 0) {
          const normalizedBrands = brandsRes.data.map(b => ({
            name: b.name,
            logo: b.logo || '',
          }));
          const withAll = [{ name: 'Todos', logo: '' }, ...normalizedBrands.filter(b => b.name !== 'Todos')];
          setBrands(withAll);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { cars, brands, loading };
}

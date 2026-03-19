import { useState } from 'react';
import { useAuth } from './AuthContext';
import CarManager from './pages/CarManager';
import BrandManager from './pages/BrandManager';
import SiteSettings from './pages/SiteSettings';
import { Car, Tag, Settings, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');

  const navItems = [
    { id: 'cars', label: 'Estoque', icon: Car },
    { id: 'brands', label: 'Marcas', icon: Tag },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(212,175,55,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 0',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Brito <span style={{ color: '#D4AF37' }}>Motors</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginTop: '4px', letterSpacing: '1px' }}>PAINEL ADMIN</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 24px',
                  background: active ? 'rgba(212,175,55,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
                  border: 'none',
                  color: active ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Montserrat', sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', marginBottom: '12px' }}>{user?.email}</p>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Montserrat', sans-serif",
              padding: '0',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh', overflowY: 'auto' }}>
        {activeTab === 'cars' && <CarManager />}
        {activeTab === 'brands' && <BrandManager />}
        {activeTab === 'settings' && <SiteSettings />}
      </main>
    </div>
  );
}

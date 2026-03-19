import { useAuth } from './AuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';

export default function AdminApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem' }}>Carregando...</p>
      </div>
    );
  }

  return user ? <AdminLayout /> : <AdminLogin />;
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { AuthProvider } from './admin/AuthContext.jsx'
import { SettingsProvider } from './hooks/useSettings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin/*" element={
            <AuthProvider>
              <AdminApp />
            </AuthProvider>
          } />
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)

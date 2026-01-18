import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

// 1. Komponen untuk memproteksi halaman LOGIN (Mencegah login ulang)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Jika sudah ada token, langsung lempar ke dashboard
    return <Navigate to="/dashboard/overview" replace />;
  }
  return children;
};

// 2. Komponen untuk memproteksi halaman DASHBOARD
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Jika tidak ada token, paksa balik ke login
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <Routes>
        {/* GUNAKAN PublicRoute di sini */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* GUNAKAN ProtectedRoute di sini */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } 
        />

        {/* Redirect semua url tak dikenal ke login (yang nanti akan dicheck PublicRoute) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
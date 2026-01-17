import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

// src/App.jsx
useEffect(() => {
  const root = window.document.documentElement;
  if (darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  
  // JANGAN ADA root.style.backgroundColor di sini!
}, [darkMode]);

  // src/App.jsx
// useEffect(() => {
//   const root = window.document.documentElement;
//   if (darkMode) {
//     root.classList.add('dark');
//     // Opsional: paksa background body berubah jika Tailwind belum cover
//     root.style.backgroundColor = '#020617'; // Warna slate-950
//   } else {
//     root.classList.remove('dark');
//     root.style.backgroundColor = '#f8fafc'; // Warna slate-50
//   }
//   localStorage.setItem('theme', darkMode ? 'dark' : 'light');
// }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={<DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
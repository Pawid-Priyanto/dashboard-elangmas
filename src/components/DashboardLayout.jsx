import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./Leftbar";
import Navbar from './Navbar';
import Footer from './Footer';
import Pemain from '../pages/Pemain';
import Pelatih from '../pages/Pelatih';
import Jadwal from '../pages/Jadwal';
import Overview from '../pages/Overview';


const DashboardLayout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 p-8">
          <Routes>
            <Route path="overview" element={<Overview />}  />
            <Route path="pemain" element={<Pemain/>} />
            <Route path="pelatih" element={<Pelatih />} />
            <Route path="jadwal" element={<Jadwal />} />
          </Routes>
        </main>``

        <Footer/>
      </div>
    </div>
  );
};

export default DashboardLayout;
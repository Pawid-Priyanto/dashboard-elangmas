import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';

const Navbar = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  console.log(darkMode, 'darkmode===')

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4">
        {/* Toggle Dark Mode */}
        {/* <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:ring-2 ring-blue-500 transition-all"
        >
          {darkMode ?   <Moon size={20} /> : <Sun size={20} />}
        </button> */}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white shadow-md hover:scale-105 transition-transform"
          >
            <User size={20} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 p-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-xs text-slate-500">Login sebagai</p>
                <p className="text-sm font-bold dark:text-white">Admin SSB</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
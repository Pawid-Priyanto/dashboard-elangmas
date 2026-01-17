import { Link } from 'react-router-dom';
import { Users, LayoutDashboard, UserSquare2, Calendar } from 'lucide-react';
import elangmas from "../../src/assets/elangmas.png"

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/overview' },
    { name: 'Data Pemain', icon: Users, path: '/dashboard/pemain' },
    { name: 'Staff Pelatih', icon: UserSquare2, path: '/dashboard/pelatih' },
    { name: 'Jadwal', icon: Calendar, path: '/dashboard/jadwal' },
  ];

  

  return (
    <aside className={`fixed h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 font-bold text-blue-600 dark:text-blue-400 text-xl flex items-center gap-2">
        {isOpen ?  'ELANG MAS'  : ''} <img 
        src={elangmas} 
        alt="Elang Mas" 
        className="h-8 w-auto"
      />
      </div>
      <nav className="px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <item.icon size={22} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
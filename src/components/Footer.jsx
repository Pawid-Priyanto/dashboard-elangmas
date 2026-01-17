import { Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-6 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900!">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Copyright & Info */}
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            &copy; {year} <span className="font-bold text-blue-600 dark:text-blue-400">SSB Elang Mas</span>. 
            All rights reserved.
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Internal Management System v1.0.2
          </p>
        </div>

        {/* Status & Credits */}
        <div className="flex items-center gap-6 text-sm">
          
          <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 md:block"></div>
          
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
            Made with <Heart size={14} className="fill-red-500 text-red-500" /> for Pageralang Football
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Table = ({ 
  columns, 
  data = [], // Pastikan default array kosong agar tidak error .length
  loading, 
  searchQuery, 
  onSearch, 
  onClear,
  // Props pagination disesuaikan dengan respons API
  currentPage = 1,
  totalPages = 1,
  totalData = 0,
  onPageChange,
  flag
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            placeholder={`Cari nama ${flag}...`}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={onClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Info Ringkas Total Data */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Total: <span className="font-bold text-slate-900 dark:text-white">{totalData}</span> data
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={`px-6 py-4 ${col.className || ''}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex justify-center text-blue-600">
                      <Loader2 className="animate-spin" size={32} />
                    </div>
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/20">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Halaman <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> dari <span className="font-bold text-slate-900 dark:text-white">{totalPages || 1} </span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => onPageChange(currentPage - 1)}
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-white disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={18} className="dark:text-slate-300" />
            </button>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => onPageChange(currentPage + 1)}
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-white disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight size={18} className="dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
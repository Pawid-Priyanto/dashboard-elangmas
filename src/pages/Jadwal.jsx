import { useState, useEffect } from 'react';
import api from '../api/index';
import TablePro from '../components/Table';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, Loader2, Trophy } from 'lucide-react';
import moment from 'moment'

const Jadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResponse, setApiResponse] = useState({
  data: [],
  totalData: 0,
  totalPages: 1,
  currentPage: 1
});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [formData, setFormData] = useState({
    lawan: '', tanggal: '', jam: '', lokasi: '', tipe_pertandingan: 'Friendly'
  });

 // 1. Update Fetch Jadwal (Server Side)
const fetchJadwal = async (page = 1, search = '') => {
  setLoading(true);
  try {
    const response = await api.get('/jadwal', {
      params: {
        page: page,
        pageSize: 10,
        lawan: search // Parameter lawan sesuai API
      }
    });

    // Menangani respons baik yang pagination maupun array biasa (fallback)
    if (response.data.success) {
      setApiResponse({
        data: response.data.data,
        totalData: response.data.totalData,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage
      });
    } else {
      // Jika API belum support pagination, bungkus array ke state
      setApiResponse(prev => ({ ...prev, data: response.data }));
    }
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  } finally {
    setLoading(false);
  }
};

// 2. Debounce Search
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    fetchJadwal(1, searchQuery);
  }, 500);

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);

  const resetForm = () => {
    setFormData({ lawan: '', tanggal: '', lokasi: '', tipe_pertandingan: 'Friendly' });
    setSelectedJadwal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isDark = document.documentElement.classList.contains('dark');

    try {
      if (selectedJadwal) {
        await api.put(`/jadwal/${selectedJadwal.id}`, formData);
      } else {
        await api.post('/jadwal', formData);
      }
      
      setIsModalOpen(false);
      fetchJadwal();
      resetForm();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Jadwal pertandingan telah diperbarui.',
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#f1f5f9' : '#1e293b',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan.',
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#f1f5f9' : '#1e293b',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const isDark = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: 'Hapus Jadwal?',
      text: "Pertandingan ini akan dihapus dari list!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      background: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#f1f5f9' : '#1e293b',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/jadwal/${id}`);
        fetchJadwal();
        Swal.fire({ icon: 'success', title: 'Terhapus!', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#f1f5f9' : '#1e293b', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal!', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#f1f5f9' : '#1e293b' });
      }
    }
  };

  const columns = [
    { 
      label: 'Pertandingan', 
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 dark:text-slate-200">vs {item.lawan}</span>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{item.tipe_pertandingan}</span>
        </div>
      )
    },
    { 
      label: 'Waktu', 
      render: (item) => (
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2"><Calendar size={14} /> {moment(item.tanggal).format('DD-MM-YYYY')}</div>
        </div>
      )
    },
    { 
      label: 'Lokasi', 
      render: (item) => (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin size={14} className="text-red-500" />
          <span>{item.lokasi}</span>
        </div>
      )
    },
    { 
      label: 'Aksi', 
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => { setSelectedJadwal(item); setFormData({...item, tanggal: moment(item.tanggal).format('YYYY-MM-DD')}); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:bg-slate-800 rounded-lg transition-colors"><Edit size={18} /></button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const filteredData = jadwal.filter(item => item.lawan.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Jadwal Pertandingan</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 dark:shadow-none"><Plus size={18} /> Tambah Jadwal</button>
      </div>

     <TablePro 
        columns={columns} 
        data={apiResponse.data} 
        loading={loading} 
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
        onClear={() => setSearchQuery('')}
        // Props Pagination Baru
        currentPage={apiResponse.currentPage}
        totalPages={apiResponse.totalPages}
        totalData={apiResponse.totalData}
        onPageChange={(newPage) => fetchJadwal(newPage, searchQuery)}
        flag={'Lawan'}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedJadwal ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Lawan (Opponent)</label>
            <input type="text" required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={formData.lawan} onChange={(e) => setFormData({...formData, lawan: e.target.value})} placeholder="Nama tim lawan" />
          </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Tanggal</label>
              <input type="date" required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white [color-scheme:light] dark:[color-scheme:dark]" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
            </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Lokasi / Stadion</label>
            <input type="text" required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={formData.lokasi} onChange={(e) => setFormData({...formData, lokasi: e.target.value})} placeholder="Contoh: Stadion Elang Mas" />
          </div>

          {/* <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Tipe Pertandingan</label>
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={formData.tipe_pertandingan} onChange={(e) => setFormData({...formData, tipe_pertandingan: e.target.value})}>
              <option>Friendly</option>
              <option>Turnamen</option>
              <option>Liga SSB</option>
              <option>Latihan Bersama</option>
            </select>
          </div> */}

          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:bg-slate-400">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (selectedJadwal ? 'Simpan Perubahan' : 'Tambah Jadwal')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Jadwal;
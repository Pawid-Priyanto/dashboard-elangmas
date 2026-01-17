import { useState, useEffect } from 'react';
import api from '../api/index';
import TablePro from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Upload, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Pemain = () => {
  const [pemain, setPemain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [pagination, setPagination] = useState([])
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPemain, setSelectedPemain] = useState(null); // Jika null = Add, jika ada isi = Edit
  const [formData, setFormData] = useState({
    nama: '', posisi: 'Penyerang', tanggal_lahir: '', minutes_play: 0, foto: null
  });

 const fetchPemain = async (page = 1, search = '') => {
  setLoading(true);
  try {
    // Memastikan parameter dikirim dengan kunci 'nama' sesuai backend
    const response = await api.get('/pemain', {
      params: {
        page: page,
        pageSize: 10,
        nama: search, // Payload 'nama' dikirim di sini
      }
    });

    // Sesuaikan dengan struktur JSON response success: true, data: [...]
    if (response.data.success) {
      setPemain(response.data.data);
      setPagination({
        totalPages: response.data.totalPages,
        totalData: response.data.totalData,
        currentPage: response.data.currentPage
      })
    }
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => { fetchPemain(); }, []);

  // Gunakan useEffect agar setiap kali ngetik, API dipanggil (dengan debounce)
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    fetchPemain(1, searchQuery); // Reset ke halaman 1 saat mencari
  }, 500); // Tunggu 500ms setelah berhenti ngetik agar tidak boros request

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);

  // Filter Data untuk Search


const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('posisi', formData.posisi);
    data.append('tanggal_lahir', formData.tanggal_lahir);
    data.append('minutes_play', formData.minutes_play);
    if (formData.foto) data.append('foto_url', formData.foto);

    const isDark = document.documentElement.classList.contains('dark');

    try {
      if (selectedPemain) {
        await api.put(`/pemain/${selectedPemain.id}`, data);
      } else {
        await api.post('/pemain', data);
      }
      
      setIsModalOpen(false);
      fetchPemain();
      resetForm();

      // Notifikasi Sukses
      Swal.fire({
        icon: 'success',
        title: selectedPemain ? 'Update Berhasil' : 'Pemain Ditambahkan',
        text: `Data ${formData.nama} berhasil disimpan ke database.`,
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#fff', // slate-900
        color: isDark ? '#f1f5f9' : '#1e293b',
        iconColor: '#3b82f6',
      });

    } catch (err) {
      // Notifikasi Error
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.response?.data?.message || 'Terjadi kesalahan pada server.',
        background: isDark ? '#0f172a' : '#fff',
        color: isDark ? '#f1f5f9' : '#1e293b',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, foto: file });
    setPreviewFoto(URL.createObjectURL(file)); // BUAT PREVIEW DARI FILE BARU
  }
};

  const resetForm = () => {
    setFormData({ nama: '', posisi: 'Penyerang', tanggal_lahir: '', minutes_play: 0, foto: null });
    setPreviewFoto(null);
    setSelectedPemain(null);
  };

  const columns = [
    { 
      label: 'Pemain', 
      render: (item) => (
        <div className="flex items-center gap-3">
          <img src={item.foto_url || 'https://via.placeholder.com/150'} className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700" alt={item.foto_url} />
          <span className="font-bold text-slate-700 dark:text-slate-200">{item.nama}</span>
        </div>
      )
    },
    {label:'Tanggal Lahir', key: 'tanggal_lahir'},
    { label: 'Posisi', key: 'posisi', className: 'dark:text-slate-400' },
    { label: 'Menit Main', render: (item) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.minutes_play}'</span> },
    { 
      label: 'Aksi', 
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { setSelectedPemain(item); setFormData(item);setPreviewFoto(item.foto_url);  setIsModalOpen(true); }}
            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

const handleDelete = async (id) => {
    const isDark = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
      title: 'Hapus Pemain?',
      text: "Data ini akan dihapus permanen dari sistem SSB Elang Mas!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red-600
      cancelButtonColor: '#64748b',  // slate-500
      confirmButtonText: 'Ya, Hapus Data',
      cancelButtonText: 'Batal',
      background: isDark ? '#0f172a' : '#fff',
      color: isDark ? '#f1f5f9' : '#1e293b',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/pemain/${id}`);
        fetchPemain();
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data pemain telah dihapus.',
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? '#0f172a' : '#fff',
          color: isDark ? '#f1f5f9' : '#1e293b',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Hapus',
          text: 'Data gagal dihapus dari database.',
          background: isDark ? '#0f172a' : '#fff',
          color: isDark ? '#f1f5f9' : '#1e293b',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Database Pemain</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95 dark:shadow-none"
        >
          <Plus size={18} /> Tambah Pemain
        </button>
      </div>

      <TablePro 
        columns={columns}
        data={pemain}
        loading={loading}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        // Props baru untuk pagination
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        totalData={pagination?.totalData}
       onPageChange={(newPage) => fetchPemain(newPage, searchQuery)}
       flag={'Pemain'}
      />

      {/* Modal Form */}
<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  title={selectedPemain ? 'Edit Data Pemain' : 'Tambah Pemain Baru'}
>
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* 1. Input Nama Lengkap (Full Width) */}
    <div>
      <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Nama Lengkap</label>
      <input 
        type="text" required
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        value={formData.nama}
        onChange={(e) => setFormData({...formData, nama: e.target.value})}
      />
    </div>

    {/* 2. Input Tanggal Lahir (Sekarang di bawah Nama - Full Width) */}
    <div>
      <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Tanggal Lahir</label>
      <input 
        type="date" 
        required
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
        value={formData.tanggal_lahir}
        onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
      />
    </div>

    {/* 3. Grid untuk Posisi & Menit Main (Berjejer) */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Posisi</label>
        <select 
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          value={formData.posisi}
          onChange={(e) => setFormData({...formData, posisi: e.target.value})}
        >
          <option>Kiper</option>
          <option>Bek</option>
          <option>Gelandang</option>
          <option>Penyerang</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Menit Main</label>
        <input 
          type="number"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          value={formData.minutes_play}
          onChange={(e) => setFormData({...formData, minutes_play: e.target.value})}
        />
      </div>
    </div>

    {/* 4. Foto Profil */}
    <div>
  <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Foto Profil</label>
  
  {/* AREA PREVIEW GAMBAR */}
  {previewFoto && (
    <div className="mt-2 mb-4 flex justify-center">
      <img 
        src={previewFoto} 
        alt="Preview" 
        className="h-32 w-32 rounded-full object-cover border-4 border-blue-500/20 shadow-md" 
      />
    </div>
  )}

  <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
    <Upload className="mb-2 text-slate-400" size={24} />
    <span className="text-sm text-slate-500 truncate max-w-xs text-center px-4">
      {formData.foto ? formData.foto.name : 'Ganti foto atau klik untuk upload'}
    </span>
    <input type="file" className="hidden" onChange={handleFileChange} />
  </label>
</div>

    {/* 5. Submit Button dengan Loading State */}
    <button 
      type="submit" 
      disabled={isSubmitting}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:shadow-none active:scale-[0.98] disabled:bg-slate-400"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Memproses...</span>
        </>
      ) : (
        <span>{selectedPemain ? 'Simpan Perubahan' : 'Simpan Data Pemain'}</span>
      )}
    </button>
  </form>
</Modal>
    </div>
  );
};

export default Pemain;
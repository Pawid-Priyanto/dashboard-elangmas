import { useState, useEffect } from 'react';
import api from '../api/index';
import TablePro from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Upload, Loader2, Award } from 'lucide-react';
import Swal from 'sweetalert2';

const Pelatih = () => {
  const [pelatih, setPelatih] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPelatih, setSelectedPelatih] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [formData, setFormData] = useState({
    nama: '', lisensi: 'D Nasional', foto: null
  });
  const [pagination, setPagination] = useState([])


  const fetchPelatih = async (page= 1, nama = '') => {
    setLoading(true);
    try {
      const response = await api.get('pelatih', {
        params: {
          page: page,
          pageSize: 10,
          nama
        }
      })

      if(response.data.success) {
        setPelatih(response.data.data)
        setPagination({
        totalPages: response.data.totalPages,
        totalData: response.data.totalData,
        currentPage: response.data.currentPage
      })
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPelatih(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ nama: '', lisensi: 'D Nasional', foto: null });
    setPreviewFoto(null);
    setSelectedPelatih(null);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('lisensi', formData.lisensi);
    if (formData.foto) data.append('foto_url', formData.foto);

    // Cek status dark mode untuk tema Swal
    const isDark = document.documentElement.classList.contains('dark');

    try {
      if (selectedPelatih) {
        await api.put(`/pelatih/${selectedPelatih.id}`, data);
      } else {
        await api.post('/pelatih', data);
      }
      
      setIsModalOpen(false);
      fetchPelatih();
      resetForm();

      // Notifikasi Sukses menggunakan Toast
      Swal.fire({
        icon: 'success',
        title: selectedPelatih ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
        text: `Data pelatih ${formData.nama} telah disimpan.`,
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#fff', // slate-800 atau white
        color: isDark ? '#f1f5f9' : '#1e293b',   // slate-100 atau slate-800
        iconColor: '#3b82f6', // blue-500
      });

    } catch (err) {
      // Notifikasi Gagal
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#f1f5f9' : '#1e293b',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleDelete = async (id) => {
    const isDark = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data pelatih ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red-600
      cancelButtonColor: '#64748b',  // slate-500
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#f1f5f9' : '#1e293b',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/pelatih/${id}`);
        fetchPelatih();
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data pelatih berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? '#1e293b' : '#fff',
          color: isDark ? '#f1f5f9' : '#1e293b',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Tidak dapat menghapus data.',
          background: isDark ? '#1e293b' : '#fff',
          color: isDark ? '#f1f5f9' : '#1e293b',
        });
      }
    }
  };
  const columns = [
    { 
      label: 'Nama Pelatih', 
      render: (item) => (
        <div className="flex items-center gap-3">
          <img 
            src={item.foto_url || 'https://via.placeholder.com/150'} 
            className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" 
            alt={item.nama} 
          />
          <span className="font-bold text-slate-700 dark:text-slate-200">{item.nama}</span>
        </div>
      )
    },
    { 
      label: 'Lisensi', 
      render: (item) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Award size={16} className="text-blue-500" />
          <span>{item.lisensi}</span>
        </div>
      )
    },
    { 
      label: 'Aksi', 
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { 
              setSelectedPelatih(item); 
              setFormData({ nama: item.nama, lisensi: item.lisensi, foto: null });
              setPreviewFoto(item.foto_url);
              setIsModalOpen(true); 
            }}
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

  const filteredData = pelatih.filter(item => 
    (item.nama?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    fetchPelatih(1, searchQuery); // Reset ke halaman 1 saat mencari
  }, 500); // Tunggu 500ms setelah berhenti ngetik agar tidak boros request

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-left">Staff Pelatih</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95 dark:shadow-none"
        >
          <Plus size={18} /> Tambah Pelatih
        </button>
      </div>

      <TablePro 
        columns={columns}
        data={pelatih}
        loading={loading}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
         currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        totalData={pagination?.totalData}
       onPageChange={(newPage) => fetchPemain(newPage, searchQuery)}
       flag={'Pelatih'}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedPelatih ? 'Edit Data Pelatih' : 'Tambah Pelatih Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Nama Lengkap</label>
            <input 
              type="text" required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Lisensi Kepelatihan</label>
            <select 
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              value={formData.lisensi}
              onChange={(e) => setFormData({...formData, lisensi: e.target.value})}
            >
              <option>AFC Pro</option>
              <option>A Diploma</option>
              <option>B Diploma</option>
              <option>C Diploma</option>
              <option>D Nasional</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-left block">Foto Profil</label>
            
            {previewFoto && (
              <div className="mt-2 mb-4 flex justify-center">
                <img src={previewFoto} className="h-32 w-32 rounded-full object-cover border-4 border-blue-500/20 shadow-md" alt="Preview" />
              </div>
            )}

            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
              <Upload className="mb-2 text-slate-400" size={24} />
              <span className="text-sm text-slate-500 text-center px-4">
                {formData.foto ? formData.foto.name : 'Ganti foto atau klik untuk upload'}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

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
              <span>{selectedPelatih ? 'Simpan Perubahan' : 'Simpan Data Pelatih'}</span>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Pelatih;
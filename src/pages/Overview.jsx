import React, { useState, useEffect } from 'react';
import api from '../api/index';
import { Users, UserSquare2, Calendar, Activity, ChevronRight, TrendingUp } from 'lucide-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Overview = () => {
  const [stats, setStats] = useState({
    totalPemain: 0,
    totalPelatih: 0,
    jadwalMendatang: 0,
    pertandinganTerdekat: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Mengambil data secara paralel untuk efisiensi
        const [resPemain, resPelatih, resJadwal] = await Promise.all([
          api.get('/pemain'),
          api.get('/pelatih'),
          api.get('/jadwal')
        ]);

        // Hitung total data (asumsi API mengembalikan totalData atau array)
        const totalPemain = resPemain.data.totalData || resPemain.data.data?.length || 0;
        const totalPelatih = resPelatih.data.totalData || resPelatih.data.data?.length || 0;
        
        // Filter jadwal yang akan datang saja
        const semuaJadwal = Array.isArray(resJadwal.data) ? resJadwal.data : (resJadwal.data.data || []);
        const futureMatches = semuaJadwal.filter(j => moment(j.tanggal).isSameOrAfter(moment(), 'day'));
        
        setStats({
          totalPemain,
          totalPelatih,
          jadwalMendatang: futureMatches.length,
          pertandinganTerdekat: futureMatches[0] || null
        });
      } catch (err) {
        console.error("Gagal memuat overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const statCards = [
    { label: 'Total Pemain', value: stats.totalPemain, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', path: '/dashboard/pemain' },
    { label: 'Staff Pelatih', value: stats.totalPelatih, icon: UserSquare2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', path: '/dashboard/pelatih' },
    { label: 'Jadwal Aktif', value: stats.jadwalMendatang, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', path: '/dashboard/jadwal' },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Activity className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Overview Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Selamat datang kembali, Admin SSB Elang Mas.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} to={card.path} className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</h3>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Pertandingan Terdekat */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-red-500" /> Pertandingan Terdekat
          </h3>
          {stats.pertandinganTerdekat ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{stats.pertandinganTerdekat.tipe_pertandingan}</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">vs {stats.pertandinganTerdekat.lawan}</p>
                  <p className="text-sm text-slate-500 mt-1">{stats.pertandinganTerdekat.lokasi}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{moment(stats.pertandinganTerdekat.tanggal).format('DD MMM')}</p>
                  <p className="text-xs text-slate-500">{moment(stats.pertandinganTerdekat.tanggal).format('YYYY')}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-4">Belum ada jadwal pertandingan mendatang.</p>
          )}
          <Link to="/dashboard/jadwal" className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
            Lihat semua jadwal <ChevronRight size={14} />
          </Link>
        </div>

        {/* Info Box / Shortcut */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none">
          <h3 className="font-bold text-lg mb-2">Manajemen Cepat</h3>
          <p className="text-blue-100 text-sm mb-6">Kelola data pemain dan pelatih SSB Elang Mas dengan lebih mudah dan terpusat.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard/pemain" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-center transition-colors">
              Data Pemain
            </Link>
            <Link to="/dashboard/pelatih" className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-center transition-colors">
              Staff Pelatih
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
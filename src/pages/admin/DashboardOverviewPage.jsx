import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    total_program: 0,
    program_active: 0,
    total_bantuan: 0,
    bantuan_active: 0,
    total_artikel: 0,
    artikel_featured: null,
    total_metrik: 0,
    total_admin: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminService.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Gagal memuat statistik admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Header Ringkasan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ringkasan Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau dan kelola konten portal CSR Pemetaan 360 secara real-time dari database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/program"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00529C] text-white text-xs font-semibold shadow-sm hover:bg-[#003B73] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Tambah Program CSR</span>
          </Link>
          <Link
            to="/admin/artikel"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">newspaper</span>
            <span>Tulis Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Program Unggulan CSR"
          value={`${stats.total_program} Program`}
          icon="verified"
          badge={`${stats.program_active} Tampil di Beranda`}
          badgeColor="bg-blue-50 text-blue-700"
          subText="Showcase utama"
        />
        <AdminStatCard
          title="Penyaluran Bantuan"
          value={`${stats.total_bantuan} Program`}
          icon="volunteer_activism"
          badge={`${stats.bantuan_active} Aktif`}
          badgeColor="bg-green-50 text-green-700"
          subText="Slider bantuan"
        />
        <AdminStatCard
          title="Publikasi & Siaran Pers"
          value={`${stats.total_artikel} Artikel`}
          icon="newspaper"
          badge={stats.artikel_featured ? '1 Berita Utama' : 'Belum ada Featured'}
          badgeColor="bg-amber-50 text-amber-700"
          subText="Bento grid berita"
        />
        <AdminStatCard
          title="Metrik Dampak Lingkungan"
          value={`${stats.total_metrik} Indikator`}
          icon="monitoring"
          badge="SiMinah & Simon+"
          badgeColor="bg-purple-50 text-purple-700"
          subText="Data capaian digital"
        />
      </div>

      {/* 3. Section Grafik & Log Aktivitas (65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grafik Overview */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Metrik Dampak (SiMinah &amp; Simon+) Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi tren capaian penyerapan program dan keterlibatan komunitas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#00529C]">
                  Tahun 2026
                </span>
              </div>
            </div>

            {/* Inline SVG Chart dari referensi template */}
            <div className="w-full mt-4 relative">
              <svg className="w-full h-52 text-[#00529C]" fill="none" preserveAspectRatio="none" viewBox="0 0 760 200">
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="30" y2="30" />
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="80" y2="80" />
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="760" y1="130" y2="130" />
                <line stroke="#E2E8F0" strokeWidth="1.5" x1="0" x2="760" y1="180" y2="180" />

                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00529C" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00529C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 30,150 Q 90,140 150,110 T 270,95 T 390,60 T 510,80 T 630,40 T 730,35 L 730,180 L 30,180 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 30,150 Q 90,140 150,110 T 270,95 T 390,60 T 510,80 T 630,40 T 730,35"
                  fill="none"
                  stroke="#00529C"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <circle cx="390" cy="60" fill="#FFFFFF" r="5" stroke="#00529C" strokeWidth="3" />
                <circle cx="630" cy="40" fill="#FFFFFF" r="5" stroke="#00529C" strokeWidth="3" />
                <circle cx="730" cy="35" fill="#FFFFFF" r="5" stroke="#00529C" strokeWidth="3" />
              </svg>
              <div className="flex justify-between text-slate-400 text-[11px] px-2 mt-2 font-medium">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                <span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
              </div>
            </div>

            {/* Quick Stat Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Database</span>
                <span className="text-sm font-bold text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Terhubung MySQL
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">Port 3306</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pengelola Aktif</span>
                <span className="text-sm font-bold text-slate-800 mt-1">{stats.total_admin} Akun Superadmin</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Pertamina x PCR</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Portal</span>
                <span className="text-sm font-bold text-[#00529C] mt-1">Live Online</span>
                <span className="text-[11px] text-slate-400 mt-0.5">REST API Laravel 11</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shortcut Aksi Cepat Modul Beranda */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 pb-1">
              Kelola Per Section
            </h2>
            <p className="text-xs text-slate-500 mb-4">Pintasan langsung untuk mengubah isi halaman web</p>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/admin/hero-visi-misi"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#00529C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">view_headline</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#00529C]">
                      Hero &amp; Visi Misi
                    </span>
                    <span className="text-[10px] text-slate-400">Atur judul &amp; misi CSR</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/metrik-dampak"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">monitoring</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#00529C]">
                      Metrik Dampak
                    </span>
                    <span className="text-[10px] text-slate-400">SiMinah &amp; Simon+</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/program"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#00529C]">
                      Program Unggulan CSR
                    </span>
                    <span className="text-[10px] text-slate-400">Showcase 4 kartu beranda</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/bantuan"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#00529C]">
                      Penyaluran Bantuan
                    </span>
                    <span className="text-[10px] text-slate-400">Slider kartu bantuan</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/artikel"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">newspaper</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#00529C]">
                      Publikasi &amp; Berita
                    </span>
                    <span className="text-[10px] text-slate-400">Bento grid artikel</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#00529C] font-semibold text-xs transition"
            >
              <span>Pratinjau Halaman Beranda Publik</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


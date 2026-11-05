import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const routeTitleMap = {
  '/admin': 'Ringkasan',
  '/admin/hero-visi-misi': 'Hero & Visi Misi',
  '/admin/metrik-dampak': 'Metrik Dampak (SiMinah & Simon+)',
  '/admin/program': 'Program Unggulan CSR',
  '/admin/bantuan': 'Penyaluran Bantuan CSR',
  '/admin/artikel': 'Publikasi & Siaran Pers',
  '/admin/pengguna': 'Kelola Pengguna Admin',
  '/admin/pengaturan': 'Konfigurasi Umum Web',
};

export default function AdminHeader() {
  const location = useLocation();
  const currentTitle = routeTitleMap[location.pathname] || 'Dashboard';

  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-white z-40 border-b border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* Breadcrumb Area */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Dashboard</span>
          <span className="text-slate-300 font-bold">/</span>
          <span className="font-semibold text-[#00529C]">{currentTitle}</span>
        </div>

        {/* Action Controls & Profile Area */}
        <div className="flex items-center gap-4">
          {/* Tombol Lihat Web Publik */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors text-xs font-semibold shadow-sm"
          >
            <span>Lihat Web Publik</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              open_in_new
            </span>
          </a>

          {/* Notifikasi */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              title="Notifikasi"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>

          {/* Badge Instansi Mitra */}
          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="text-xs font-semibold text-[#00529C]">Politeknik Caltex Riau</span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#00529C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-800 leading-tight">
                admincs
              </span>
              <span className="text-[10px] text-slate-500 leading-none">Super Admin</span>
            </div>
            <Link
              to="/"
              className="ml-1 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar / Kembali"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


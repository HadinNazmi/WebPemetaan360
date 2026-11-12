import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const routeTitleMap = {
  '/admin': 'Ringkasan',
  '/admin/hero-visi-misi': 'Hero & Visi Misi',
  '/admin/metrik-dampak': 'Metrik Dampak (SiMinah & Simon+)',
  '/admin/program': 'Program Unggulan CSR',
  '/admin/bantuan': 'Penyaluran Bantuan CSR',
  '/admin/artikel': 'Publikasi & Siaran Pers',
  '/admin/umkm': 'Kelola UMKM & Produk',
  '/admin/tour-360': 'Master Wilayah Virtual Tour 360',
  '/admin/pengguna': 'Kelola Pengguna Admin',
  '/admin/pengaturan': 'Konfigurasi Umum Web',
};

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi admin?')) {
      await authService.logout();
      navigate('/admin/login', { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const getHeaderTitle = () => {
    if (routeTitleMap[location.pathname]) return routeTitleMap[location.pathname];
    if (location.pathname.includes('/tour-360') && location.pathname.includes('/scenes')) {
      return 'Manajer Titik Panorama & Hotspot 360';
    }
    if (location.pathname.startsWith('/admin/tour-360')) return 'Virtual Tour 360';
    return 'Dashboard';
  };
  const currentTitle = getHeaderTitle();

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

          
          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#00529C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-800 leading-tight">
                {user?.name || 'Super Admin'}
              </span>
              <span className="text-[10px] text-slate-500 leading-none capitalize">
                {user?.role === 'superadmin' ? 'Super Admin' : 'Admin CSR'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar dari Sesi Admin"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


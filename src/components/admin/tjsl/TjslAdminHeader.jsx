import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

const routeTitleMap = {
  '/admin/tjsl': 'Ringkasan Program TJSL',
  '/admin/tjsl/pilar': '4 Pilar Utama TJSL Pertamina',
  '/admin/tjsl/program': 'Program Kerja & Inisiatif TJSL',
  '/admin/tjsl/bantuan': 'Penyaluran Bantuan Komunitas TJSL',
  '/admin/tjsl/laporan': 'Laporan Akuntabilitas & Skor SROI',
  '/admin/tjsl/profil': 'Profil Regulasi & Standar ISO 26000',
};

export default function TjslAdminHeader() {
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
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi Admin TJSL?')) {
      await authService.logout();
      navigate('/admin/login', { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'TJ';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const currentTitle = routeTitleMap[location.pathname] || 'Dashboard TJSL';

  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-white z-40 border-b border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.03)] font-['Montserrat',sans-serif]">
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* Breadcrumb Area */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Dashboard TJSL</span>
          <span className="text-slate-300 font-bold">/</span>
          <span className="font-semibold text-[#00529C]">{currentTitle}</span>
        </div>

        {/* Action Controls & Profile Area */}
        <div className="flex items-center gap-4">
          {/* Badge Portal */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#00529C] text-xs font-semibold border border-blue-200">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Tanggung Jawab Sosial & Lingkungan</span>
          </span>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#ED1B24] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-800 leading-tight">
                {user?.name || 'Admin TJSL Pertamina'}
              </span>
              <span className="text-[10px] text-slate-500 leading-none">
                Admin TJSL
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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


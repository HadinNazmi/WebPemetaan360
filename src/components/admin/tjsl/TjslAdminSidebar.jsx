import React from 'react';
import { NavLink } from 'react-router-dom';

const navItemsTjsl = [
  {
    to: '/admin/tjsl/pilar',
    label: '4 Pilar Utama TJSL',
    icon: 'account_tree',
  },
  {
    to: '/admin/tjsl/program',
    label: 'Program Kerja TJSL',
    icon: 'verified',
  },
  {
    to: '/admin/tjsl/bantuan',
    label: 'Penyaluran Bantuan TJSL',
    icon: 'volunteer_activism',
  },
  {
    to: '/admin/tjsl/laporan',
    label: 'Laporan SROI & Dampak',
    icon: 'analytics',
  },
];

const navItemsConfig = [
  {
    to: '/admin/tjsl/profil',
    label: 'Profil & Regulasi TJSL',
    icon: 'policy',
  },
];

export default function TjslAdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#00529C] text-white shadow-sm font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white z-50 flex flex-col border-r border-slate-200 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center bg-white justify-between">
        <NavLink to="/admin/tjsl" className="block py-1 hover:opacity-90 transition-opacity">
          <img
            src="/images/Logo Pertamina Patra Niaga Horizontal.png"
            alt="Logo Pertamina Patra Niaga"
            className="h-8 w-auto max-w-[170px] object-contain"
          />
        </NavLink>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ED1B24]/10 text-[#ED1B24] border border-[#ED1B24]/20 tracking-wider">
          TJSL
        </span>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        {/* Ringkasan Dashboard */}
        <div className="flex flex-col gap-1">
          <NavLink to="/admin/tjsl" end className={linkClass}>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Ringkasan TJSL</span>
          </NavLink>
        </div>

        {/* Kelompok: Manajemen TJSL */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Manajemen TJSL
          </span>
          <nav className="flex flex-col gap-1">
            {navItemsTjsl.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Kelompok: Regulasi & Profil */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Standar & Pengaturan
          </span>
          <nav className="flex flex-col gap-1">
            {navItemsConfig.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-600">Portal TJSL Aktif</span>
        </div>
      </div>
    </aside>
  );
}


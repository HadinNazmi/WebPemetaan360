import React from 'react';
import { NavLink } from 'react-router-dom';

const navItemsLanding = [
  {
    to: '/admin/hero-visi-misi',
    label: 'Hero & Visi Misi',
    icon: 'view_headline',
  },
  {
    to: '/admin/metrik-dampak',
    label: 'Metrik Dampak (SiMinah/Simon+)',
    icon: 'monitoring',
  },
  {
    to: '/admin/program',
    label: 'Program Unggulan CSR',
    icon: 'verified',
  },
  {
    to: '/admin/bantuan',
    label: 'Penyaluran Bantuan',
    icon: 'volunteer_activism',
  },
  {
    to: '/admin/artikel',
    label: 'Publikasi & Siaran Pers',
    icon: 'newspaper',
  },
];

const navItemsSystem = [
  {
    to: '/admin/pengguna',
    label: 'Kelola Pengguna Admin',
    icon: 'manage_accounts',
  },
  {
    to: '/admin/pengaturan',
    label: 'Konfigurasi Umum Web',
    icon: 'settings',
  },
];

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#00529C] text-white shadow-sm font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white z-50 flex flex-col border-r border-slate-200 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            360
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#003B73] leading-tight font-['Plus_Jakarta_Sans']">
              CSR Pemetaan 360
            </span>
            <span className="text-[11px] text-slate-500 leading-none mt-0.5">
              Admin CMS Portal
            </span>
          </div>
        </div>
        <div className="mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#00529C] tracking-wide border border-blue-100">
            Pertamina x Politeknik Caltex Riau
          </span>
        </div>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        {/* Ringkasan */}
        <div className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Ringkasan</span>
          </NavLink>
        </div>

        {/* Kelompok: Kelola Konten Beranda */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Kelola Konten Beranda
          </span>
          <nav className="flex flex-col gap-1">
            {navItemsLanding.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Kelompok: Pengaturan Sistem */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Pengaturan Sistem
          </span>
          <nav className="flex flex-col gap-1">
            {navItemsSystem.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Instansi */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/50">
        <p className="text-[11px] text-slate-400 text-center font-medium">
          © 2026 Politeknik Caltex Riau
        </p>
      </div>
    </aside>
  );
}


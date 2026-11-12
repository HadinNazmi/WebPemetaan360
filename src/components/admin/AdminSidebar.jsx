import React from 'react';
import { NavLink } from 'react-router-dom';

const navItemsLanding = [
  {
    to: '/admin/hero-visi-misi',
    label: 'Tentang & Visi Misi',
    icon: 'info',
  },
  {
    to: '/admin/program',
    label: 'Program Unggulan CSR',
    icon: 'verified',
  },
  {
    to: '/admin/metrik-dampak',
    label: 'Sistem CSR & Metrik',
    icon: 'layers',
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
  {
    to: '/admin/umkm',
    label: 'UMKM & Produk',
    icon: 'storefront',
  },
];

const navItemsTour = [
  {
    to: '/admin/tour-360',
    label: 'Wilayah & Titik 360',
    icon: '360',
  },
  {
    to: '/admin/tour-360/hero-settings',
    label: 'Panorama Hero Beranda',
    icon: 'travel_explore',
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
      <div className="h-16 px-4 border-b border-slate-200 flex items-center bg-white">
        <NavLink to="/admin" className="block py-1 hover:opacity-90 transition-opacity">
          <img
            src="/images/Logo Pertamina Patra Niaga Horizontal.png"
            alt="Logo Pertamina Patra Niaga"
            className="h-9 w-auto max-w-[210px] object-contain"
          />
        </NavLink>
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

        {/* Kelompok: Pemetaan & Tour 360 */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Pemetaan &amp; Tour 360
          </span>
          <nav className="flex flex-col gap-1">
            {navItemsTour.map((item) => (
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
          © 2026 CSR Pertamina RU Dumai
        </p>
      </div>
    </aside>
  );
}


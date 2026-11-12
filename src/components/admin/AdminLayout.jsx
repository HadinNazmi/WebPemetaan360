import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Montserrat',sans-serif] text-slate-800">
      {/* 1. Sidebar Navigasi Kiri (Tetap / Preserved) */}
      <AdminSidebar />

      {/* 2. Topbar Header Atas (Tetap / Preserved) */}
      <AdminHeader />

      {/* 3. Area Konten Halaman Dinamis (Hanya bagian ini yang berganti saat klik menu) */}
      <main className="pl-[260px] pt-16 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


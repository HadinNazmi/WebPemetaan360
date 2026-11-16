import React from 'react';
import { Outlet } from 'react-router-dom';
import TjslAdminSidebar from './TjslAdminSidebar';
import TjslAdminHeader from './TjslAdminHeader';

export default function TjslAdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Montserrat',sans-serif] text-slate-800">
      {/* 1. Sidebar Navigasi Kiri Khusus TJSL */}
      <TjslAdminSidebar />

      {/* 2. Topbar Header Atas Khusus TJSL */}
      <TjslAdminHeader />

      {/* 3. Area Konten Halaman Dinamis */}
      <main className="pl-[260px] pt-16 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


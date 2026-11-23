import React, { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const location = useLocation();
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 15 });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, el);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Montserrat',sans-serif] text-slate-800">
      {/* 1. Sidebar Navigasi Kiri (Tetap / Preserved) */}
      <AdminSidebar />

      {/* 2. Topbar Header Atas (Tetap / Preserved) */}
      <AdminHeader />

      {/* 3. Area Konten Halaman Dinamis (Hanya bagian ini yang berganti saat klik menu) */}
      <main className="pl-[260px] pt-16 min-h-screen">
        <div ref={contentRef} className="w-full max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

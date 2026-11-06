import React from 'react';

/**
 * Reusable 2-Column Detail Layout
 * Membagi halaman menjadi Kolom Kiri (Sidebar Widget) dan Kolom Kanan (Konten Utama)
 * persis seperti tata letak halaman PPID / Detail Program pada referensi Pertamina.
 *
 * @param {React.ReactNode} sidebar - Komponen di kolom kiri (biasanya SidebarArticlesWidget)
 * @param {React.ReactNode} children - Konten utama di kolom kanan
 * @param {string} [className] - Kelas tambahan
 */
export default function DetailLayout({ sidebar, children, content, className = '' }) {
  return (
    <main className={`w-full bg-[#f8fafc] min-h-screen py-10 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Kolom Kiri: Sidebar Widget (Sticky pada desktop) */}
          <div className="lg:col-span-4 xl:col-span-4 w-full lg:sticky lg:top-28">
            {sidebar}
          </div>

          {/* Kolom Kanan: Konten Utama / Artikel Detail */}
          <div className="lg:col-span-8 xl:col-span-8 w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 md:p-10">
            {children || content}
          </div>

        </div>
      </div>
    </main>
  );
}

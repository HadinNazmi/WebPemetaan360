import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Hero Banner untuk halaman sub/detail
 * @param {Array<{label: string, href?: string}>} breadcrumbs - Daftar path navigasi
 * @param {string} title - Judul utama halaman
 * @param {string} [subtitle] - Subjudul atau kategori (opsional)
 * @param {string} [backgroundImage] - Foto banner latar belakang
 */
export default function PageHero({
  breadcrumbs = [{ label: 'Home', href: '/' }],
  title,
  subtitle,
  backgroundImage = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
}) {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[500px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1600&q=80';
          }}
        />
        {/* Dual Gradient Overlay persis gaya referensi Pertamina */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 md:pb-24">
        {/* Breadcrumb Trail */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-medium text-slate-300">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span className="text-slate-400 select-none">/</span>
                    )}
                    {crumb.href && !isLast ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-white transition-colors duration-200"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white font-semibold">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Subtitle / Eyebrow (Optional) */}
        {subtitle && (
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-blue-400 mb-2">
            {subtitle}
          </span>
        )}

        {/* Main Big Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl drop-shadow-sm">
          {title}
        </h1>
      </div>
    </section>
  );
}

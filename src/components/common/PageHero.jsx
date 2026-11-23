import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pageHeroService } from '../../services/pageHeroService';
import { getFullImageUrl } from '../../utils/imageUrl';

/**
 * Reusable Hero Banner untuk halaman sub/detail
 * Mendukung pembacaan otomatis dari database (jika diberikan pageKey),
 * atau props statis sebagai fallback.
 *
 * @param {string} [pageKey] - Key halaman di DB: 'katalog_produk' | 'direktori_umkm' | 'tentang_kami'
 * @param {Array<{label: string, href?: string}>} breadcrumbs - Daftar path navigasi
 * @param {string} [title] - Judul utama halaman (fallback jika data DB belum ada)
 * @param {string} [subtitle] - Subjudul atau kategori (opsional fallback)
 * @param {string} [backgroundImage] - Foto banner latar belakang (fallback)
 */
export default function PageHero({
  pageKey,
  breadcrumbs = [{ label: 'Home', href: '/' }],
  title: initialTitle,
  subtitle: initialSubtitle,
  backgroundImage: initialBackgroundImage = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
}) {
  const [heroData, setHeroData] = useState({
    title: initialTitle,
    subtitle: initialSubtitle,
    background_image: initialBackgroundImage,
  });

  useEffect(() => {
    // Sinkronkan initial props jika ada perubahan props
    setHeroData({
      title: initialTitle,
      subtitle: initialSubtitle,
      background_image: initialBackgroundImage,
    });

    // Jika memiliki pageKey, ambil data dinamis dari database API
    if (pageKey) {
      async function loadDbHero() {
        try {
          const res = await pageHeroService.getByKey(pageKey);
          if (res?.success && res.data) {
            setHeroData({
              title: res.data.title || initialTitle,
              subtitle: res.data.subtitle !== undefined ? res.data.subtitle : initialSubtitle,
              background_image: res.data.background_image || initialBackgroundImage,
            });
          }
        } catch (err) {
          // Jika gagal / offline, tetap gunakan initial props
          console.warn(`[PageHero] Menggunakan fallback untuk key: ${pageKey}`);
        }
      }
      loadDbHero();
    }
  }, [pageKey, initialTitle, initialSubtitle, initialBackgroundImage]);

  const finalTitle = heroData.title || initialTitle;
  const finalSubtitle = heroData.subtitle;
  const finalBgUrl = getFullImageUrl(heroData.background_image) || initialBackgroundImage;

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[500px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={finalBgUrl}
          alt={finalTitle}
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
        {finalSubtitle && (
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-blue-400 mb-2">
            {finalSubtitle}
          </span>
        )}

        {/* Main Big Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl drop-shadow-sm">
          {finalTitle}
        </h1>
      </div>
    </section>
  );
}

import React, { useRef } from 'react';
import { Newspaper, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable Sidebar Articles / Updates Widget
 * Meniru persis widget sidebar daftar artikel pada gambar referensi Pertamina.
 *
 * @param {string} [headerTitle] - Judul header widget (opsional)
 * @param {Array<{id, judul, kategori_tag, tanggal, url, slug}>} items - Daftar artikel
 * @param {string} [activeSlug] - Slug artikel yang sedang aktif
 */
export default function SidebarArticlesWidget({
  headerTitle = 'Artikel & Publikasi Terkait',
  items = [],
  activeSlug = '',
}) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 140;
      scrollContainerRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <aside className="w-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
      {/* Widget Header - Deep Navy / Royal Indigo sesuai referensi */}
      <div className="bg-[#1e2a5e] text-white px-5 py-4 flex items-center justify-between">
        <h3 className="text-sm md:text-base font-bold tracking-wide flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-blue-300" />
          <span>{headerTitle}</span>
        </h3>
        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-blue-200">
          {items.length} Update
        </span>
      </div>

      {/* Main Container with Items & Scroll Buttons */}
      <div className="relative flex bg-white">
        {/* Scrollable Items List */}
        <div
          ref={scrollContainerRef}
          className="flex-1 max-h-[460px] overflow-y-auto divide-y divide-dashed divide-slate-300 scroll-smooth pr-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Belum ada artikel atau publikasi terkait.
            </div>
          ) : (
            items.map((item, idx) => {
              const isActive = activeSlug && item.slug === activeSlug;
              const linkTarget = item.url ? item.url : `/program/${item.slug || ''}`;
              const isExternal = item.url && item.url.startsWith('http');

              const content = (
                <div
                  className={`p-4 flex items-start gap-3 transition-colors duration-150 hover:bg-slate-50 group ${
                    isActive ? 'bg-blue-50/70 border-l-4 border-[#1e2a5e]' : ''
                  }`}
                >
                  {/* Left Device/Article Icon Box */}
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 group-hover:bg-[#1e2a5e] group-hover:text-white transition-colors duration-200">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v8h16V8H4zm7 10h2v2h-2v-2z" />
                    </svg>
                  </div>

                  {/* Right Article Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-blue-700 uppercase tracking-wider">
                        {item.kategori_tag || 'Artikel'}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {item.tanggal || item.published_at || 'Terbaru'}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-[#1e2a5e] transition-colors leading-snug">
                      {item.judul || item.judul_program || item.title}
                    </h4>
                  </div>
                </div>
              );

              return isExternal ? (
                <a
                  key={item.id || idx}
                  href={linkTarget}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={item.id || idx}
                  to={linkTarget}
                  className="block"
                >
                  {content}
                </Link>
              );
            })
          )}
        </div>

        {/* Scroll Control Strip on the Right Edge (matching image reference) */}
        <div className="w-7 bg-slate-100/80 border-l border-slate-200 flex flex-col items-center justify-between py-2 select-none">
          <button
            onClick={() => handleScroll('up')}
            className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
            title="Scroll ke atas"
            aria-label="Scroll up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Vertical scroll track bar */}
          <div className="w-1.5 h-20 bg-slate-300 rounded-full my-auto" />

          <button
            onClick={() => handleScroll('down')}
            className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
            title="Scroll ke bawah"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

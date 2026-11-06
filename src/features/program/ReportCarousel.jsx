import React, { useState } from 'react';
import './ReportCarousel.css';

// Data laporan & publikasi sesuai referensi resmi Pertamina
export const defaultReportItems = [
  {
    id: 1,
    title: 'Annual Reports',
    description: 'Jelajahi kinerja, strategi bisnis dan pencapaian kami setiap tahunnya.',
    href: '/publikasi-laporan-tahunan',
    image: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
  },
  {
    id: 2,
    title: 'Financial Reports',
    description: 'Akses laporan audit terbaru serta komitmen kami terhadap transparansi dan akuntabilitas keuangan.',
    href: '/laporan-keuangan',
    image: 'https://www.pertamina.com/file/files/2025/05/laporan-keuangan-hero-alt.webp',
  },
  {
    id: 3,
    title: 'Presentations',
    description: 'Eksplorasi strategi kami dalam menjaga performa tahunan, keberlanjutan dan tata kelola bisnis.',
    href: '/presentasi',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Corporate Newsletters',
    description: 'Ikuti perkembangan industri terbaru dan strategi inovatif kami secara berkala.',
    href: '/corporate-newsletter',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Bonds',
    description: 'Jelajahi informasi terbaru tentang obligasi Pertamina, peluang investasi, serta komitmen kami terhadap pertumbuhan berkelanjutan.',
    href: '/obligasi',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Shareholders',
    description: 'Ketahui struktur kepemilikan, tata kelola, serta peran kami dalam pengelolaan perusahaan.',
    href: '/pemegang-saham',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function ReportCarousel({ items = defaultReportItems }) {
  // State index aktif yang mengontrol slide kartu & foto di sebelah kiri secara bersamaan
  const [activeIndex, setActiveIndex] = useState(0);

  // Navigasi ke slide selanjutnya
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  // Navigasi ke slide sebelumnya
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Pilih langsung saat kartu diklik
  const handleSelectCard = (index) => {
    setActiveIndex(index);
  };

  const activeItem = items[activeIndex] || items[0];

  // Lebar kartu 290px + gap 28px = 318px per pergeseran
  const slideOffset = activeIndex * 318;

  return (
    <section className="report-section" id="publikasi-laporan">
      <div className="report-container">
        <div className="report-grid-layout">
          
          {/* ============================================================= */}
          {/* SISI KIRI: FOTO UTAMA DENGAN TRANSISI HALUS (CROSS-FADE)       */}
          {/* Gambar otomatis berganti sesuai kartu aktif di sebelah kanan   */}
          {/* ============================================================= */}
          <div className="report-image-col">
            {items.map((item, idx) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                className={`report-hero-img ${idx === activeIndex ? 'is-active' : ''}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
                }}
              />
            ))}

            <div className="report-image-overlay" />
            <div className="report-image-badge">
              {activeItem.title}
            </div>
          </div>

          {/* ============================================================= */}
          {/* SISI KANAN: CAROUSEL KARTU & KONTROL TOMBOL PANAH             */}
          {/* ============================================================= */}
          <div className="report-carousel-col">
            {/* Viewport & Track Slider */}
            <div className="report-carousel-viewport">
              <div
                className="report-carousel-track"
                style={{ transform: `translateX(-${slideOffset}px)` }}
              >
                {items.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={item.id}
                      className={`report-card-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleSelectCard(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleSelectCard(idx);
                      }}
                    >
                      <h3 className="report-card-title">{item.title}</h3>
                      <div className="report-card-line" />
                      <p className="report-card-desc">{item.description}</p>
                      
                      <div className="report-card-arrow-wrap">
                        <div className="report-card-arrow">
                          <svg viewBox="0 0 24 24">
                            <path d="M7 17L17 7M17 7H9M17 7V15" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Navigasi Panah Kiri & Kanan */}
            <div className="report-nav-controls">
              {/* Indikator Titik */}
              <div className="report-dots-indicator">
                {items.map((_, idx) => (
                  <span
                    key={idx}
                    className={`report-dot ${idx === activeIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ke slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Tombol Panah Kiri */}
              <button
                type="button"
                className="btn-report-nav"
                onClick={handlePrev}
                aria-label="Slide Sebelumnya"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Tombol Panah Kanan */}
              <button
                type="button"
                className="btn-report-nav"
                onClick={handleNext}
                aria-label="Slide Selanjutnya"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}


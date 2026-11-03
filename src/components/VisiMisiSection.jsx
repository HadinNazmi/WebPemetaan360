import React from 'react';
import './VisiMisiSection.css';

const PLACEHOLDER_IMG = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export default function VisiMisiSection() {
  return (
    <>
      {/* 1. SEKSI VISI & MISI CSR (sec-energizing) */}
      <section className="sec-energizing" id="visi-misi">
        <div className="wrap-content">
          <div className="energizing-grid">
            {/* Kolom Kiri: Logo Pertamina Patra Niaga CSR */}
            <div className="energizing-media">
              <img
                src="/image/logocsr.jpeg"
                alt="Logo CSR PT Pertamina Patra Niaga"
                className="energizing-art"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            </div>

            {/* Kolom Kanan: Teks Visi & Misi */}
            <div className="energizing-content">
              <span className="eyebrow">VISI &amp; MISI CSR</span>
              <h2>Komitmen Keberlanjutan &amp; Pemberdayaan Masyarakat</h2>
              <p>
                Sebagai wujud nyata Tanggung Jawab Sosial dan Lingkungan (TJSL), PT Pertamina Patra Niaga senantiasa berkontribusi aktif dalam meningkatkan kualitas hidup masyarakat serta menjaga kelestarian lingkungan hidup secara berkelanjutan.
              </p>
              <p>
                <strong>Visi:</strong> Menjadi pelopor terdepan dalam pemberdayaan masyarakat dan pelestarian lingkungan yang berkelanjutan, guna mendorong kemandirian energi dan pertumbuhan ekonomi masyarakat yang inklusif.
              </p>
              <p>
                <strong>Misi:</strong> Menjalankan program pemberdayaan ekonomi melalui pengembangan UMKM dan penguatan potensi lokal, melestarikan keanekaragaman hayati dan ekosistem pesisir, serta meningkatkan kualitas hidup masyarakat sekitar melalui pemenuhan fasilitas air bersih, kesehatan, dan pendidikan berkelanjutan.
              </p>
              <a href="#galeri" className="btn-more">
                <span>Selengkapnya</span>
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEKSI SEKILAS PERTAMINA (sec-about-banner) */}
      <section
        className="sec-about-banner"
        id="tentang-kami"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 25, 43, 0.92) 0%, rgba(8, 25, 43, 0.8) 38%, rgba(8, 25, 43, 0.35) 70%, rgba(0, 0, 0, 0.08) 100%), url('${PLACEHOLDER_IMG}')`,
        }}
      >
        <div className="wrap-content">
          <div className="banner-content">
            <span className="banner-eyebrow">SEKILAS PERTAMINA</span>
            <h2 className="banner-title">Tentang Kami</h2>
            <p className="banner-desc">
              Lebih dari enam dekade menyediakan energi untuk seluruh penjuru negeri dan sejumlah wilayah di luar negeri.
            </p>
            <div className="banner-actions">
              <a href="#visi-misi" className="btn-banner">
                <span>Selengkapnya</span>
                <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
              </a>
              <a href="#visi-misi" className="btn-banner">
                <span>Direksi dan Komisaris</span>
                <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      {/* 1. TOPBAR: LOGO + UTIL LINKS */}
      <div className="topbar">
        <div className="wrap">
          {/* Logo Resmi Pertamina SVG */}
          <a href="#" className="logo" title="Pertamina">
            <img
              className="logo w-[144px] md:w-[173px] h-full aspect-[173/48] object-contain"
              src="/images/Pertamina_Logo.svg"
              alt="Logo Pertamina"
              title="Logo Pertamina"
              draggable="false"
              decoding="async"
            />
          </a>

          {/* Navigasi Utilitas Atas */}
          <div className="util">
            <a href="#berita">Berita</a>
            <a href="#galeri">Galeri</a>
            <a href="#bantuan-csr">Bantuan CSR</a>
            <span className="lang">
              ID <span className="flag"></span>
            </span>
            <a href="#pendaftaran" className="btn-outline">
              Registrasi Program
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAINNAV: LINK LENGKAP SEKSI HALAMAN */}
      <nav className="mainnav">
        <div className="wrap">
          <a href="#tentang-kami">Tentang Kami</a>
          <a href="#visi-misi">Visi &amp; Misi</a>
          <a href="#capaian-digital">Capaian Digital</a>
          <a href="#galeri">Program Kami</a>
          <a href="#bantuan-csr">Bantuan CSR</a>
          <a href="#berita">Berita Terkini</a>
          <a href="#tour">Peta Lokasi</a>
          <a href="#galeri">Media &amp; Informasi</a>
          <a href="#visi-misi">Keberlanjutan</a>
          <svg viewBox="0 0 24 24" aria-label="Cari">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </div>
      </nav>
    </header>
  );
}

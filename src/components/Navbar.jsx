import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { programService } from '../services/programService';
import './Navbar.css';

export default function Navbar() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerTheme, setHeaderTheme] = useState('black'); // 'black' | 'white'
  const [programs, setPrograms] = useState([]);
  const [sistemList, setSistemList] = useState([]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroElement = document.getElementById('hero');
      const heroHeight = heroElement ? heroElement.offsetHeight : window.innerHeight * 0.85;

      // 1. ZONA PALING ATAS (Mentok di paling atas):
      // Muncul dengan warna default HITAM
      if (currentScrollY <= 40) {
        setHeaderVisible(true);
        setHeaderTheme('black');
      }
      // 2. ZONA HERO (Di dalam Hero Section tetapi sedang di-scroll):
      // Selalu MENGHILANG sebelum mentok ke atas
      else if (currentScrollY <= heroHeight) {
        setHeaderVisible(false);
        setHeaderTheme('black');
      }
      // 3. ZONA KONTEN (Di bawah Hero Section):
      else {
        // Scroll ke bawah: SELALU MENGHILANG
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        }
        // Scroll ke atas: MUNCUL DENGAN TEMA PUTIH
        else {
          setHeaderVisible(true);
          setHeaderTheme('white');
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambil data Program Unggulan & Sistem CSR untuk mengisi dropdown secara dinamis
  useEffect(() => {
    async function fetchNavData() {
      try {
        const [progRes, sisRes] = await Promise.all([
          programService.getShowcasePrograms(),
          programService.getSistemList(),
        ]);
        if (progRes?.success && Array.isArray(progRes.data)) {
          setPrograms(progRes.data);
        }
        if (sisRes?.success && Array.isArray(sisRes.data)) {
          setSistemList(sisRes.data);
        }
      } catch (err) {
        console.error('Gagal memuat navigasi dropdown:', err);
      }
    }
    fetchNavData();
  }, []);

  return (
    <header
      className={`site-header ${headerVisible ? 'nav-visible' : 'nav-hidden'} ${
        headerTheme === 'white' ? 'theme-white' : 'theme-black'
      }`}
    >
      {/* 1. TOPBAR: LOGO + UTIL LINKS */}
      <div className="topbar">
        <div className="wrap">
          {/* Logo Resmi Pertamina Patra Niaga Dinamis */}
          <Link to="/" className="logo" title="Pertamina Patra Niaga">
            <img
              className="logo h-12 md:h-14 lg:h-15 w-auto max-w-[260px] md:max-w-[320px] object-contain transition-all duration-300"
              src={headerTheme === 'white' ? '/images/Logo Pertamina Patra Niaga Horizontal.png' : '/images/logo2.png'}
              alt="Logo Pertamina Patra Niaga"
              title="Logo Pertamina Patra Niaga"
              draggable="false"
              decoding="async"
            />
          </Link>

          {/* Navigasi Utilitas Atas */}
          <div className="util">
            <span className="lang">
              ID <span className="flag"></span>
            </span>
            <a href="/#bantuan-csr" className="btn-outline">
              Registrasi Program
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAINNAV: STRUKTUR MENU RINGKAS & DINAMIS */}
      <nav className="mainnav">
        <div className="wrap">
          {/* Menu 1: Tentang Kami */}
          <Link to="/tentang-kami">Tentang Kami</Link>

          {/* Menu 2: Program Unggulan (Dropdown Sederhana & Dinamis) */}
          <div className="nav-dropdown">
            <span className="nav-dropdown-trigger">
              <span>Program Unggulan</span>
              <svg className="chevron" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <div className="nav-dropdown-menu">
              <div className="dropdown-list">
                {programs.length > 0 ? (
                  programs.map((prog) => (
                    <Link
                      key={prog.id || prog.slug}
                      to={prog.slug ? `/program/${prog.slug}` : `/#galeri`}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-title">{prog.judul_program}</span>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-xs text-slate-400 text-center">
                    Memuat program...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu 3: Sistem CSR (Dropdown Sederhana SiMinah & Simon+) */}
          <div className="nav-dropdown">
            <span className="nav-dropdown-trigger">
              <span>Sistem CSR</span>
              <svg className="chevron" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <div className="nav-dropdown-menu">
              <div className="dropdown-list">
                {sistemList.length > 0 ? (
                  sistemList.map((sis) => (
                    <Link
                      key={sis.id || sis.kode_sistem}
                      to={`/sistem/${sis.slug || sis.kode_sistem}`}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-title">{sis.nama_sistem}</span>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/sistem/siminah" className="dropdown-item">
                      <span className="dropdown-item-title">SiMinah</span>
                    </Link>
                    <Link to="/sistem/simon_plus" className="dropdown-item">
                      <span className="dropdown-item-title">Simon+</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu 4: Penyaluran Bantuan CSR */}
          <a href="/#bantuan-csr">Bantuan CSR</a>

          {/* Menu 5: Publikasi & Berita */}
          <a href="/#berita">Publikasi &amp; Berita</a>
        </div>
      </nav>
    </header>
  );
}

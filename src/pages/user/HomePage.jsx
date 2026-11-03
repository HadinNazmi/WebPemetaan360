import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import VisiMisiSection from '../../components/VisiMisiSection.jsx';
import Stats from '../../components/Stats.jsx';
import ProgramList from '../../features/program/ProgramList.jsx';
import CsrAidSection from '../../features/program/CsrAidSection.jsx';
import NewsSection from '../../features/program/NewsSection.jsx';
import Footer from '../../components/Footer.jsx';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#334155' }}>
      
      {/* 1. HEADER / NAVBAR PERTAMINA (AKTIF) */}
      <Navbar />

      {/* 2. Hero & Tour 360 Kosongan */}
      <div style={{
        paddingTop: '140px',
        minHeight: '480px',
        background: '#0f172a',
        color: '#64748b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px dashed #334151',
        gap: '8px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#94a3b8' }}>
          [ SECTION HERO / VIRTUAL TOUR 360 & TABS ]
        </div>
        <div style={{ fontSize: '13px' }}>Posisi Scene 360 Panorama & Tab Pemilihan Wilayah</div>
      </div>

      {/* 3. SECTION VISI & MISI CSR + SEKILAS PERTAMINA (AKTIF) */}
      <VisiMisiSection />

      {/* 4. SECTION DIGITAL IMPACT / STATS (SIMINAH & SIMON+) (AKTIF) */}
      <Stats />

      {/* 5. SECTION SHOWCASE GRID 4 FOTO PROGRAM (AKTIF) */}
      <ProgramList />

      {/* 6. SECTION PENYALURAN BANTUAN CSR (AKTIF) */}
      <CsrAidSection />

      {/* 7. SECTION BERITA & ARTIKEL BENTO GRID (AKTIF & PERSIS REFERENSI) */}
      <NewsSection />

      {/* 8. SITE FOOTER PERTAMINA (AKTIF) */}
      <Footer />

    </div>
  );
}

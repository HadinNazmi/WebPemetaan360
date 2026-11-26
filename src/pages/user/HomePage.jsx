import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import AnimatedSection from '../../components/AnimatedSection.jsx';
import HeroTourSection from '../../components/HeroTourSection.jsx';
import VisiMisiSection from '../../components/VisiMisiSection.jsx';
import StatsSiminahSection from '../../components/StatsSiminahSection.jsx';
import StatsSimonPlusSection from '../../components/StatsSimonPlusSection.jsx';
import ProgramList from '../../features/program/ProgramList.jsx';
import CsrAidSection from '../../features/program/CsrAidSection.jsx';
import NewsSection from '../../features/program/NewsSection.jsx';
import Footer from '../../components/Footer.jsx';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#334155' }}>
      
      {/* 1. HEADER / NAVBAR PERTAMINA (Fixed Header - Selalu Tampil) */}
      <Navbar />

      {/* 2. SECTION HERO / VIRTUAL TOUR 360 & TABS */}
      {/* 
        [CATATAN UNUSED - KODE ASLI TEMAN DIPERTAHANKAN]:
        Animasi GSAP pinning, parallax scrub, dan fade abu-abu pada hero dinonaktifkan (unused)
        agar tampilan Hero Section langsung 'plong', jernih, dan terang tanpa penutup abu-abu.
        Kode asli pembungkus AnimatedSection tetap disimpan di bawah ini (jangan dihapus):

        <AnimatedSection id="hero" isHero={true}>
          <HeroTourSection />
        </AnimatedSection>
      */}
      <section id="hero" className="w-full relative">
        <HeroTourSection />
      </section>

      {/* 3. SECTION VISI & MISI CSR + SEKILAS PERTAMINA (Masing-masing terhubung GSAP ScrollTrigger) */}
      <VisiMisiSection />

      {/* 4. SECTION CAPAIAN DIGITAL SIMINAH (Sirkularitas Minyak Jelantah) */}
      <AnimatedSection
        id="capaian-siminah"
        staggerTarget=".stat-col"
        stagger={0.14}
        yOffset={80}
      >
        <StatsSiminahSection />
      </AnimatedSection>

      {/* 5. SECTION SHOWCASE GRID FOTO PROGRAM UNGGULAN CSR */}
      <AnimatedSection
        id="galeri"
        staggerTarget=".slider-card"
        stagger={0.1}
        yOffset={75}
      >
        <ProgramList />
      </AnimatedSection>

      {/* 6. SECTION CAPAIAN DIGITAL SIMON+ (Monitoring & Evaluasi Ketercapaian CSR - Berada di tengah Program & Bantuan) */}
      <AnimatedSection
        id="capaian-simon-plus"
        staggerTarget=".stat-col"
        stagger={0.14}
        yOffset={80}
      >
        <StatsSimonPlusSection />
      </AnimatedSection>

      {/* 7. SECTION PENYALURAN BANTUAN CSR (Non TJSL) */}
      <AnimatedSection
        id="bantuan-csr"
        staggerTarget=".csr-aid-card"
        stagger={0.14}
        yOffset={75}
      >
        <CsrAidSection />
      </AnimatedSection>

      {/* 7. SECTION BERITA & ARTIKEL BENTO GRID (Transisi Masuk Stagger Berita Utama & Grid Berita) */}
      <AnimatedSection
        id="berita"
        staggerTarget=".news-featured-card, .news-card"
        stagger={0.14}
        yOffset={75}
      >
        <NewsSection />
      </AnimatedSection>

      {/* 8. SITE FOOTER PERTAMINA (Transisi Masuk Stagger Kolom Footer) */}
      <AnimatedSection
        id="footer"
        staggerTarget=".footer-center-brand, .footer-col"
        stagger={0.1}
        yOffset={50}
      >
        <Footer />
      </AnimatedSection>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection.jsx';
import { programService } from '../services/programService';
import { pageHeroService } from '../services/pageHeroService';
import { getFullImageUrl } from '../utils/imageUrl';
import './VisiMisiSection.css';

const DEFAULT_BANNER_BG = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80';

export default function VisiMisiSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [katalogHero, setKatalogHero] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [vmRes, heroRes] = await Promise.all([
          programService.getVisiMisi(),
          pageHeroService.getByKey('katalog_produk').catch(() => null),
        ]);

        if (vmRes?.success && vmRes?.data) {
          setData(vmRes.data);
        }
        if (heroRes?.success && heroRes?.data) {
          setKatalogHero(heroRes.data);
        }
      } catch (err) {
        console.error('Gagal memuat data seksi visi misi:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const logoSrc = data?.logo_url ? getFullImageUrl(data.logo_url) : '/image/logocsr.jpeg';

  // Gambar background terhubung otomatis dengan hero katalog produk
  const bannerBgUrl = katalogHero?.background_image
    ? getFullImageUrl(katalogHero.background_image)
    : DEFAULT_BANNER_BG;

  return (
    <>
      {/* 1. SEKSI VISI & MISI CSR (sec-energizing) - MURNI DINAMIS DARI DATABASE */}
      {(!data && !loading) ? null : (
        <AnimatedSection
          id="visi-misi"
          staggerTarget=".energizing-media, .energizing-content"
          stagger={0.16}
          yOffset={75}
        >
          <section className="sec-energizing">
            <div className="wrap-content">
              <div className="energizing-grid">
                {/* Kolom Kiri: Logo Pertamina Patra Niaga CSR */}
                <div className="energizing-media">
                  <img
                    src={logoSrc}
                    alt={data?.judul_utama || 'Logo CSR PT Pertamina Patra Niaga'}
                    className="energizing-art"
                    onError={(e) => {
                      e.currentTarget.src = '/image/logocsr.jpeg';
                    }}
                  />
                </div>

                {/* Kolom Kanan: Visi & Misi */}
                <div className="energizing-content">
                  <span className="eyebrow">
                    {data?.tagline || 'PEMBERDAYAAN BERKELANJUTAN & INKLUSIF'}
                  </span>
                  <h2>{data?.judul_utama || 'Visi & Misi CSR'}</h2>

                  {data?.visi && (
                    <div className="space-y-1 mb-4">
                      <p>
                        <strong>Visi:</strong>
                      </p>
                      <p className="text-slate-700 leading-relaxed pl-1">
                        {data.visi}
                      </p>
                    </div>
                  )}

                  {data?.misi && (
                    <div className="space-y-1">
                      <p>
                        <strong>Misi:</strong>
                      </p>
                      <div className="whitespace-pre-line text-slate-700 leading-relaxed pl-1">
                        {data.misi}
                      </div>
                    </div>
                  )}

                  <a href={data?.url_selengkapnya || '#galeri'} className="btn-more">
                    <span>Selengkapnya</span>
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* 2. SEKSI BANNER AJAKAN DUKUNG UMKM BINAAN CSR (sec-about-banner) */}
      <AnimatedSection
        id="banner-produk-umkm"
        staggerTarget=".banner-eyebrow, .banner-title, .banner-desc, .banner-actions"
        stagger={0.12}
        yOffset={65}
      >
        <section
          className="sec-about-banner"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8, 25, 43, 0.94) 0%, rgba(8, 25, 43, 0.82) 42%, rgba(8, 25, 43, 0.42) 75%, rgba(0, 0, 0, 0.15) 100%), url('${bannerBgUrl}')`,
          }}
        >
          <div className="wrap-content">
            <div className="banner-content">
              <span className="banner-eyebrow">PEMBERDAYAAN EKONOMI LOKAL</span>
              <h2 className="banner-title">
                Dukung Produk Karya Mitra Binaan CSR
              </h2>
              <p className="banner-desc">
                Mari bersama kita dukung kemandirian para pelaku usaha mikro dan kelompok wanita tani binaan PT Pertamina Patra Niaga Dumai. Dapatkan produk pangan lokal bermutu tinggi, higienis, dan ramah lingkungan langsung dari tangan pengrajinnya.
              </p>
              <div className="banner-actions">
                <Link to="/katalog-produk" className="btn-banner">
                  <span>Mulai Belanja Produk Binaan</span>
                  <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
                </Link>
                <Link to="/direktori-umkm" className="btn-banner btn-banner-secondary">
                  <span>Kenali Kelompok Binaan</span>
                  <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import AnimatedSection from './AnimatedSection.jsx';
import { programService } from '../services/programService';
import { getFullImageUrl } from '../utils/imageUrl';
import './VisiMisiSection.css';

const PLACEHOLDER_IMG = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export default function VisiMisiSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVisiMisi() {
      try {
        const res = await programService.getVisiMisi();
        if (res?.success && res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat visi misi dari database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVisiMisi();
  }, []);

  const logoSrc = data?.logo_url ? getFullImageUrl(data.logo_url) : '/image/logocsr.jpeg';

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
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>

                {/* Kolom Kanan: Teks Visi & Misi Dinamis */}
                <div className="energizing-content">
                  <span className="eyebrow">{data?.eyebrow || 'VISI & MISI CSR'}</span>
                  <h2>{data?.judul_utama || 'Komitmen Keberlanjutan & Pemberdayaan Masyarakat'}</h2>

                  {data?.deskripsi_pengantar && (
                    <p>{data.deskripsi_pengantar}</p>
                  )}

                  {data?.visi && (
                    <p>
                      <strong>Visi:</strong> {data.visi}
                    </p>
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

      {/* 2. SEKSI SEKILAS PERTAMINA (sec-about-banner) */}
      <AnimatedSection
        id="tentang-kami"
        staggerTarget=".banner-eyebrow, .banner-title, .banner-desc, .banner-actions"
        stagger={0.12}
        yOffset={65}
      >
        <section
          className="sec-about-banner"
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
      </AnimatedSection>
    </>
  );
}

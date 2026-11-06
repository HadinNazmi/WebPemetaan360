import React, { useRef, useState, useEffect } from 'react';
import { programService } from '../../services/programService';
import './CsrAidSection.css';

const PLACEHOLDER_IMG = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export default function CsrAidSection() {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    async function loadCsrAid() {
      const res = await programService.getCsrAidPrograms();
      if (res && res.success) {
        setItems(res.data);
      }
    }
    loadCsrAid();
  }, []);

  // Geser ke kartu berikutnya & ubah foto di kiri
  const slideNext = () => {
    if (!trackRef.current || items.length === 0) return;
    const nextIdx = (activeIndex + 1) % items.length;
    setActiveIndex(nextIdx);
    const cardWidth = trackRef.current.querySelector('.csr-aid-card')?.offsetWidth || 270;
    trackRef.current.scrollTo({ left: nextIdx * (cardWidth + 20), behavior: 'smooth' });
  };

  // Geser ke kartu sebelumnya & ubah foto di kiri
  const slidePrev = () => {
    if (!trackRef.current || items.length === 0) return;
    const prevIdx = (activeIndex - 1 + items.length) % items.length;
    setActiveIndex(prevIdx);
    const cardWidth = trackRef.current.querySelector('.csr-aid-card')?.offsetWidth || 270;
    trackRef.current.scrollTo({ left: prevIdx * (cardWidth + 20), behavior: 'smooth' });
  };

  // Klik kartu untuk memilih langsung
  const handleCardClick = (idx) => {
    if (dragInfo.current.moved) return;
    setActiveIndex(idx);
    const cardWidth = trackRef.current.querySelector('.csr-aid-card')?.offsetWidth || 270;
    trackRef.current.scrollTo({ left: idx * (cardWidth + 20), behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    dragInfo.current.isDown = true;
    dragInfo.current.moved = false;
    dragInfo.current.startX = e.pageX - trackRef.current.offsetLeft;
    dragInfo.current.scrollLeft = trackRef.current.scrollLeft;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragInfo.current.startX) * 1.3;
    if (Math.abs(walk) > 4) {
      dragInfo.current.moved = true;
    }
    trackRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    dragInfo.current.isDown = false;
    setIsDragging(false);
  };

  return (
    <section className="sec-csr-aid" id="bantuan-csr">
      <div className="wrap-content">
        {/* Header: Judul & Deskripsi + Tombol Selengkapnya */}
        <div className="csr-aid-header">
          <div className="csr-aid-header-left">
            <span className="csr-aid-eyebrow">DAMPAK &amp; KEMANUSIAAN</span>
            <h2 className="csr-aid-title">Penyaluran Bantuan CSR</h2>
          </div>
          <div className="csr-aid-header-right">
            <p className="csr-aid-desc">
              Sebagai wujud komitmen Tanggung Jawab Sosial dan Lingkungan (TJSL), Pertamina senantiasa menyalurkan bantuan terarah untuk pendidikan, kesehatan, fasilitas air bersih, serta kemandirian ekonomi masyarakat secara berkelanjutan.
            </p>
            <a href="#galeri" className="btn-csr-aid">
              <span>Selengkapnya</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Body: Foto Utama Dinamis di Kiri & Kartu Bantuan di Kanan */}
        <div className="csr-aid-body">
          {/* Foto di Kiri: Berganti otomatis saat tombol panah / kartu diklik */}
          <div className="csr-aid-photo-wrap">
            {items.map((item, idx) => (
              <img
                key={item.id}
                src={item.gambar_cover}
                alt={item.title}
                className={`csr-aid-photo ${idx === activeIndex ? 'is-active' : ''}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            ))}
          </div>

          {/* Carousel Kartu Penyaluran Bantuan */}
          <div className="csr-aid-carousel-wrapper">
            <div
              className={`csr-aid-track ${isDragging ? 'is-dragging' : ''}`}
              id="csr-aid-track"
              ref={trackRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {items.length === 0 ? (
                <div className="text-slate-400 text-sm py-8 px-4">
                  Belum ada data penyaluran bantuan di database.
                </div>
              ) : (
                items.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={item.id}
                      className={`csr-aid-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleCardClick(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleCardClick(idx);
                      }}
                    >
                      <div className="csr-aid-card-top">
                        <h3 className="csr-card-title">{item.title}</h3>
                        <div className="csr-card-line"></div>
                        <p className="csr-card-desc">{item.desc}</p>
                      </div>
                      <div className="csr-card-arrow">
                        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tombol Navigasi Bawah Kanan */}
            {items.length > 0 && (
              <div className="csr-aid-nav">
                <button
                  className="btn-aid-nav"
                  id="btn-aid-prev"
                  type="button"
                  aria-label="Geser bantuan ke kiri"
                  onClick={slidePrev}
                >
                  <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button
                  className="btn-aid-nav"
                  id="btn-aid-next"
                  type="button"
                  aria-label="Geser bantuan ke kanan"
                  onClick={slideNext}
                >
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../services/programService';
import './ProgramList.css';

const PLACEHOLDER_IMG = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      const res = await programService.getShowcasePrograms();
      if (res && res.success) {
        setPrograms(res.data);
      }
      setLoading(false);
    }
    loadPrograms();
  }, []);

  const scrollLeft = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.querySelector('.slider-card')?.offsetWidth || 300;
    trackRef.current.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.querySelector('.slider-card')?.offsetWidth || 300;
    trackRef.current.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
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

  const handleCardClick = (item) => {
    if (dragInfo.current.moved) return;
    const targetUrl = item.href || (item.slug ? `/program/${item.slug}` : null);
    if (!targetUrl) return;

    if (targetUrl.startsWith('http')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(targetUrl);
    }
  };

  if (programs.length === 0 && !loading) {
    return (
      <div className="w-full py-16 text-center text-slate-400 bg-slate-900/40 border border-dashed border-slate-700/50 rounded-xl my-4" id="galeri">
        <p className="text-base font-medium text-slate-300">Belum ada program CSR di database</p>
        <p className="text-xs text-slate-400 mt-1">Data akan otomatis muncul saat ditambahkan melalui panel admin atau database.</p>
      </div>
    );
  }

  return (
    <section className="sec-showcase-slider" id="galeri">
      <div className="slider-outer">
        {/* Tombol Navigasi Kiri & Kanan */}
        {programs.length > 4 && (
          <>
            <button
              className="slider-nav-btn slider-nav-prev"
              id="slider-prev"
              type="button"
              aria-label="Geser ke kiri"
              onClick={scrollLeft}
            >
              <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              className="slider-nav-btn slider-nav-next"
              id="slider-next"
              type="button"
              aria-label="Geser ke kanan"
              onClick={scrollRight}
            >
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Track Slide Showcase Card Horizontal */}
        <div
          className={`slider-track ${isDragging ? 'is-dragging' : ''}`}
          id="showcase-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {programs.map((item) => {
            const cardImg = item.banner || item.img || PLACEHOLDER_IMG;
            const cardTitle = item.judul_program || item.title;
            const cardCat = item.kategori || item.category;

            return (
              <div
                key={item.id}
                className="slider-card"
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(item);
                }}
              >
                <img
                  src={cardImg}
                  alt={cardTitle}
                  className="slider-card-img"
                  onError={(e) => {
                    e.currentTarget.src = item.fallbackImg || PLACEHOLDER_IMG;
                  }}
                />
                <div className="slider-card-overlay"></div>
                <div className="slider-card-content">
                  <span className="slider-card-cat">{cardCat}</span>
                  <h3 className="slider-card-title">{cardTitle}</h3>
                  <button
                    type="button"
                    className="slider-card-btn"
                    aria-label={`Buka Halaman ${cardTitle}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCardClick(item);
                    }}
                  >
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

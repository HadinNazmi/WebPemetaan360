import React, { useRef, useState, useEffect } from 'react';
import { programService } from '../../services/programService';
import './ProgramList.css';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    async function loadPrograms() {
      const res = await programService.getShowcasePrograms();
      if (res && res.success) {
        setPrograms(res.data);
      }
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

  const handleCardClick = (href) => {
    if (dragInfo.current.moved) return;
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <section className="sec-showcase-slider" id="galeri">
      <div className="slider-outer">
        {/* Tombol Navigasi Kiri & Kanan */}
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

        {/* Track Slide 10 Foto Horizontal */}
        <div
          className={`slider-track ${isDragging ? 'is-dragging' : ''}`}
          id="showcase-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {programs.map((item) => (
            <div
              key={item.id}
              className="slider-card"
              data-href={item.href}
              onClick={() => handleCardClick(item.href)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="slider-card-img"
                onError={(e) => {
                  if (item.fallbackImg && e.currentTarget.src !== item.fallbackImg) {
                    e.currentTarget.src = item.fallbackImg;
                  }
                }}
              />
              <div className="slider-card-overlay"></div>
              <div className="slider-card-content">
                <span className="slider-card-cat">{item.category}</span>
                <h3 className="slider-card-title">{item.title}</h3>
                <a
                  href={item.href}
                  className="slider-card-btn"
                  data-href={item.href}
                  aria-label={`Buka Halaman ${item.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCardClick(item.href);
                  }}
                >
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

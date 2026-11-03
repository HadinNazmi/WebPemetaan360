import React, { useState, useEffect } from 'react';
import { programService } from '../../services/programService';
import './NewsSection.css';

const PLACEHOLDER_IMG = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [mainToggle, setMainToggle] = useState('news'); // 'news' | 'magazine'
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'csr' | 'energia'

  useEffect(() => {
    async function loadArticles() {
      const res = await programService.getArticles();
      if (res.success) {
        setArticles(res.data);
      }
    }
    loadArticles();
  }, []);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => !a.featured);

  return (
    <section className="sec-news-articles" id="berita">
      <div className="wrap-content">
        {/* Filter Toggle Bar */}
        <div className="news-top-bar">
          {/* Toggle News / Magazine */}
          <div className="news-main-toggle">
            <button
              className={`btn-toggle-main ${mainToggle === 'news' ? 'active' : ''}`}
              type="button"
              onClick={() => setMainToggle('news')}
            >
              News
            </button>
            <button
              className={`btn-toggle-main ${mainToggle === 'magazine' ? 'active' : ''}`}
              type="button"
              onClick={() => setMainToggle('magazine')}
            >
              Magazine
            </button>
          </div>

          {/* Kategori Filter: Siaran Pers, Berita CSR, Berita Energia */}
          <div className="news-category-pills">
            <button
              className={`btn-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveCategory('all')}
            >
              Siaran Pers
            </button>
            <button
              className={`btn-cat-pill ${activeCategory === 'csr' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveCategory('csr')}
            >
              Berita CSR
            </button>
            <button
              className={`btn-cat-pill ${activeCategory === 'energia' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveCategory('energia')}
            >
              Berita Energia
            </button>
          </div>
        </div>

        {/* Bento Grid 5 Artikel */}
        <div className="news-bento-grid">
          {/* Artikel Utama (Featured - Besar di Kiri) */}
          {featuredArticle && (
            <a
              href={featuredArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card news-card-featured"
            >
              <img
                src={featuredArticle.gambar}
                alt={featuredArticle.judul}
                className="news-card-img"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
              <div className="news-card-overlay"></div>
              <div className="news-card-content">
                <span className="news-card-tag">{featuredArticle.kategori_tag}</span>
                <h3 className="news-card-title">{featuredArticle.judul}</h3>
                <span className="news-card-date">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {featuredArticle.published_at}
                </span>
              </div>
            </a>
          )}

          {/* 4 Artikel Pendukung (Kanan - Grid 2x2) */}
          {regularArticles.slice(0, 4).map((art) => (
            <a
              key={art.id}
              href={art.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              <img
                src={art.gambar}
                alt={art.judul}
                className="news-card-img"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
              <div className="news-card-overlay"></div>
              <div className="news-card-content">
                <span className="news-card-tag">{art.kategori_tag}</span>
                <h3 className="news-card-title">{art.judul}</h3>
                <span className="news-card-date">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {art.published_at}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


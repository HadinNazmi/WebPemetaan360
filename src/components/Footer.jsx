import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap-content">
        {/* Brand Atas: Logo Pertamina Patra Niaga Berwarna & Alamat Resmi */}
        <div className="footer-center-brand">
          <Link to="/" title="Pertamina Patra Niaga">
            <img
              src="/images/Logo Pertamina Patra Niaga Horizontal.png"
              alt="Pertamina Patra Niaga"
              className="footer-center-logo"
            />
          </Link>
          <p className="footer-info-line">
            <strong>Alamat:</strong> Jl. Raya Kilang Putri Tujuh, Tanjung Palas, Dumai Timur, Kota Dumai, Riau
          </p>
          <p className="footer-info-line">
            <strong>Kolaborasi:</strong> CSR PT Pertamina Patra Niaga RU II Dumai &times; Politeknik Caltex Riau
          </p>
          <p className="footer-info-line">
            <strong>Email:</strong> <a href="mailto:csr.dumai@pertaminapatraniaga.com">csr.dumai@pertaminapatraniaga.com</a>
          </p>
        </div>

        {/* 5 Kolom Link Footer Bermanfaat Sesuai Modul Portal CSR */}
        <div className="footer-columns-grid">
          {/* Kolom 1: Profil & Kemitraan */}
          <div className="footer-col">
            <h4>Tentang Kami</h4>
            <Link to="/tentang-kami">Profil Program TJSL</Link>
            <Link to="/tentang-kami">Visi &amp; Misi Keberlanjutan</Link>
            <Link to="/tentang-kami">Kemitraan Politeknik Caltex Riau</Link>
            <Link to="/tentang-kami">4 Pilar CSR Pertamina</Link>
          </div>

          {/* Kolom 2: Program Unggulan */}
          <div className="footer-col">
            <h4>Program Unggulan</h4>
            <Link to="/program/mundam-jaya">Kawasan Gambut Mundam Jaya</Link>
            <Link to="/program/halimah">Kampung Sirkular Halimah</Link>
            <Link to="/program/mundam-dua">Sentra Tani Mundam Dua</Link>
            <a href="/#galeri">Semua Galeri Program</a>
          </div>

          {/* Kolom 3: Sistem Digital CSR */}
          <div className="footer-col">
            <h4>Sistem Digital CSR</h4>
            <Link to="/sistem/siminah">SiMinah (Sirkularitas Jelantah)</Link>
            <Link to="/sistem/simon_plus">Simon+ (Monitoring TJSL)</Link>
            <a href="/#capaian-digital">Capaian Dampak Lingkungan</a>
            <Link to="/sistem/siminah">Bank Jelantah Digital</Link>
          </div>

          {/* Kolom 4: Publikasi & Akses */}
          <div className="footer-col">
            <h4>Publikasi &amp; Akses</h4>
            <a href="/#bantuan-csr">Penyaluran Bantuan CSR</a>
            <a href="/#berita">Berita &amp; Siaran Pers</a>
            <Link to="/tour-360">Jelajah Virtual Tour 360&deg;</Link>
            <Link to="/admin">Portal Admin CMS</Link>
          </div>

          {/* Kolom 5: Kontak & Pengaduan */}
          <div className="footer-col">
            <h4>Kontak Kami</h4>
            <div className="footer-contact-widgets">
              {/* Widget Call Center 135 */}
              <a href="tel:135" className="widget-pcc">
                <span className="widget-pcc-text">PERTAMINA<br />CALL CENTER</span>
                <span className="widget-pcc-num">135</span>
              </a>

              {/* Widget Whistle Blowing System */}
              <a
                href="https://pertaminaclean.tipoffs.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="widget-wbs"
              >
                <div className="widget-wbs-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                  </svg>
                </div>
                <div className="widget-wbs-text">
                  <strong>Whistle Blowing System</strong>
                  <span>pertaminaclean.tipoffs.info</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bar Bawah: Copyright & Sosmed Khusus Instagram dan TikTok */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>&copy; CSR PT Pertamina Patraniaga RU Dumai 2026. All Rights Reserved.</span>
          </div>

          <div className="footer-social-icons">
            {/* Instagram: @pertaminaru2 */}
            <a
              href="https://www.instagram.com/pertaminaru2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @pertaminaru2"
              className="footer-social-pill"
              title="Instagram @pertaminaru2"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>pertaminaru2</span>
            </a>

            {/* TikTok: @pertaminaru2_ */}
            <a
              href="https://www.tiktok.com/@pertaminaru2_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok @pertaminaru2_"
              className="footer-social-pill"
              title="TikTok @pertaminaru2_"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.69c-.01 1.91-.6 3.84-1.78 5.34-2.04 2.64-5.49 3.9-8.79 3.2-3.17-.67-5.83-3.1-6.66-6.23-.97-3.66.45-7.66 3.51-9.76 1.74-1.19 3.86-1.67 5.92-1.39v4.14c-1.07-.3-2.24-.22-3.23.28-1.45.72-2.39 2.22-2.37 3.85.02 1.68 1.05 3.2 2.58 3.83 1.51.62 3.32.39 4.58-.62.88-.71 1.39-1.8 1.38-2.93V.02z" />
              </svg>
              <span>pertaminaru2_</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

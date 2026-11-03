import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap-content">
        {/* Brand Atas: Logo Pertamina & Alamat Resmi */}
        <div className="footer-center-brand">
          <img
            src="/images/Pertamina_Logo.svg"
            alt="Pertamina"
            className="footer-center-logo"
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
          <p className="footer-info-line">
            <strong>Address:</strong> Grha Pertamina, Jl. Medan Merdeka Timur No.11–13, Jakarta 10110 Indonesia
          </p>
          <p className="footer-info-line">
            <strong>Email:</strong> <a href="mailto:infopublik@pertamina.com">infopublik@pertamina.com</a>
          </p>
        </div>

        {/* 5 Kolom Link Footer Sesuai Website Pertamina */}
        <div className="footer-columns-grid">
          {/* Kolom 1: Announcement */}
          <div className="footer-col">
            <h4>Announcement</h4>
            <a href="#galeri">Pertamina Info</a>
            <a href="#galeri">Pengadaan Umum</a>
            <a href="#galeri">Pengumuman</a>
            <a href="#galeri">E-Procurement</a>
            <a href="#galeri">Hubungan Investor</a>
            <a href="#galeri">RUPS</a>
            <a href="#galeri">Karir</a>
          </div>

          {/* Kolom 2: Network */}
          <div className="footer-col">
            <h4>Network</h4>
            <a href="#galeri">Subholding Upstream</a>
            <a href="#galeri">Subholding Downstream</a>
            <a href="#galeri">Subholding Power &amp; New Renewable Energy</a>
            <a href="#galeri">Subholding Gas</a>
            <a href="#galeri">Subholding Integrated Marine Logistics</a>
          </div>

          {/* Kolom 3: AP & Services */}
          <div className="footer-col">
            <h4>AP &amp; Services</h4>
            <a href="#galeri">PT Pertamina Bina Medika IHC</a>
            <a href="#galeri">PT Pertamina Training &amp; Consulting</a>
            <a href="#galeri">PT Patra Jasa</a>
            <a href="#galeri">PT Pelita Air Service</a>
            <a href="#galeri">PT Asuransi Tugu Pratama Indonesia Tbk</a>
            <a href="#galeri">PT Pertamina Pedeve Indonesia</a>
          </div>

          {/* Kolom 4: Tools */}
          <div className="footer-col">
            <h4>Tools</h4>
            <a href="#galeri">i-Serv</a>
            <a href="#galeri">Registrasi Lembaga Penyalur</a>
            <a href="#galeri">Tata Kelola Perusahaan</a>
            <a href="#galeri">Keterbukaan Informasi Publik</a>
            <a href="#capaian-digital">Sistem Simon+ &amp; SiMinah</a>
          </div>

          {/* Kolom 5: Kontak Kami */}
          <div className="footer-col">
            <h4>Kontak Kami</h4>
            <div className="footer-contact-widgets">
              {/* Widget Call Center 135 */}
              <a href="tel:135" className="widget-pcc">
                <span className="widget-pcc-text">PERTAMINA<br />CALL CENTER</span>
                <span className="widget-pcc-num">135</span>
              </a>

              {/* Widget Whistle Blowing System */}
              <a href="https://pertaminaclean.tipoffs.info/" target="_blank" rel="noopener noreferrer" className="widget-wbs">
                <div className="widget-wbs-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                </div>
                <div className="widget-wbs-text">
                  <strong>Whistle Blowing System</strong>
                  <span>https://pertaminaclean.tipoffs.info/</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bar Bawah (Hak Cipta, Legalitas, dan Sosial Media) */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>&copy; Copyright PT Pertamina (Persero) 2026. All Right Reserved.</span>
            <span>/</span>
            <a href="#">Kebijakan Privasi</a>
            <span>/</span>
            <a href="#">Waspada Penipuan</a>
          </div>
          <div className="footer-social-icons">
            {/* Facebook */}
            <a href="https://facebook.com/pertamina" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://twitter.com/pertamina" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/pertamina" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com/company/pertamina" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@pertamina" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.69c-.01 1.91-.6 3.84-1.78 5.34-2.04 2.64-5.49 3.9-8.79 3.2-3.17-.67-5.83-3.1-6.66-6.23-.97-3.66.45-7.66 3.51-9.76 1.74-1.19 3.86-1.67 5.92-1.39v4.14c-1.07-.3-2.24-.22-3.23.28-1.45.72-2.39 2.22-2.37 3.85.02 1.68 1.05 3.2 2.58 3.83 1.51.62 3.32.39 4.58-.62.88-.71 1.39-1.8 1.38-2.93V.02z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


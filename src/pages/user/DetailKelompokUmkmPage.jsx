import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { umkmService } from '../../services/umkmService';
import './DetailKelompokUmkmPage.css';

export default function DetailKelompokUmkmPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [kelompok, setKelompok] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await umkmService.getKelompokDetail(slug);
        if (res.success && res.data) {
          setKelompok(res.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Gagal memuat detail kelompok:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadDetail();
    }
  }, [slug]);

  // Nomor WA clean untuk link direct chat
  const cleanPhone = (kelompok?.nomor_wa || '').replace(/[^0-9]/g, '');
  const waTarget = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const directWaUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(
    `Halo ${kelompok?.nama_kelompok || ''}, saya tertarik dengan program kemitraan dan produk binaan CSR Pertamina Patra Niaga.`
  )}`;

  return (
    <div className="detail-umkm-page">
      <Navbar />
      <CartDrawer />

      <main className="detail-umkm-container">
        {/* Tombol Kembali */}
        <Link to="/direktori-umkm" className="detail-umkm-btn-back">
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          <span>Kembali ke Direktori</span>
        </Link>

        {loading ? (
          <div className="text-center py-24 text-slate-400">
            <span className="material-symbols-outlined spin text-4xl">
              progress_activity
            </span>
            <p className="mt-3 text-sm font-medium">Memuat profil kelompok UMKM...</p>
          </div>
        ) : notFound || !kelompok ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 my-8">
            <span className="material-symbols-outlined text-5xl text-slate-300">
              sentiment_dissatisfied
            </span>
            <h2 className="text-lg font-bold mt-2">Kelompok UMKM Tidak Ditemukan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Data kelompok yang Anda tuju mungkin telah diperbarui atau nonaktif.
            </p>
            <Link
              to="/direktori-umkm"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Lihat Direktori Lainnya
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Hero Banner Card */}
            <div className="detail-umkm-hero">
              <img
                src={
                  kelompok.foto_cover ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
                }
                alt={kelompok.nama_kelompok}
                className="detail-umkm-hero-bg"
              />
              <div className="detail-umkm-hero-overlay">
                <h1 className="detail-umkm-hero-title">
                  {kelompok.nama_kelompok}
                </h1>
                {kelompok.angkatan && (
                  <span className="detail-umkm-hero-badge">
                    {kelompok.angkatan}
                  </span>
                )}
              </div>
            </div>

            {/* Lokasi Tag */}
            <div className="detail-umkm-location-tag">
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              <span>{kelompok.kecamatan}</span>
            </div>

            {/* 2. 3 Quick Stat Cards */}
            <div className="detail-umkm-stats-grid">
              <div className="detail-stat-card">
                <span className="detail-stat-label">
                  <span className="material-symbols-outlined">person</span>
                  <span>Pengelola</span>
                </span>
                <span className="detail-stat-value">{kelompok.nama_ketua}</span>
              </div>

              <div className="detail-stat-card">
                <span className="detail-stat-label">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <span>Berdiri</span>
                </span>
                <span className="detail-stat-value">
                  {kelompok.tahun_berdiri || '-'}
                </span>
              </div>

              <div className="detail-stat-card">
                <span className="detail-stat-label">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span>Produk</span>
                </span>
                <span className="detail-stat-value">
                  {kelompok.produk?.length || 0} item
                </span>
              </div>
            </div>

            {/* 3. Dua Kolom Informasi */}
            <div className="detail-umkm-content-layout">
              {/* Kolom Kiri: Tentang Kelompok Usaha */}
              <div className="detail-about-card">
                <h3 className="detail-section-subtitle">
                  Tentang Kelompok Usaha
                </h3>
                <p className="detail-about-text">
                  {kelompok.deskripsi ||
                    'Kelompok binaan program Tanggung Jawab Sosial dan Lingkungan (TJSL) PT Pertamina Patra Niaga Dumai yang berfokus pada kemandirian ekonomi, pemberdayaan masyarakat, dan pengolahan potensi lokal.'}
                </p>

                {kelompok.alamat_lengkap && (
                  <div className="detail-about-address">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      home_pin
                    </span>
                    <span>{kelompok.alamat_lengkap}</span>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Kontak & Informasi Tambahan */}
              <div className="detail-right-col">
                {/* Kontak WhatsApp Langsung */}
                <div className="detail-kontak-card">
                  <h3 className="detail-section-subtitle">Kontak &amp; Tautan</h3>
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-btn-wa-direct"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chat
                    </span>
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Informasi Tambahan */}
                <div className="detail-info-card">
                  <h3 className="detail-section-subtitle">
                    Informasi Tambahan
                  </h3>
                  <ul className="detail-info-list">
                    <li className="detail-info-item">
                      <span className="detail-info-dot" />
                      <span>
                        Nama pemilik: <strong>{kelompok.nama_ketua}</strong>
                      </span>
                    </li>
                    <li className="detail-info-item">
                      <span className="detail-info-dot" />
                      <span>
                        Jumlah anggota:{' '}
                        <strong>{kelompok.jumlah_anggota || 0} orang</strong>
                      </span>
                    </li>
                    <li className="detail-info-item">
                      <span className="detail-info-dot" />
                      <span>
                        Nomor WhatsApp: <strong>{kelompok.nomor_wa}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Bagian Produk Unggulan */}
            <section className="detail-produk-section">
              <div className="detail-produk-eyebrow">Produk Unggulan</div>
              <h2 className="detail-produk-title">
                Produk dari {kelompok.nama_kelompok}
              </h2>

              {!kelompok.produk || kelompok.produk.length === 0 ? (
                <div className="detail-produk-empty">
                  Belum ada produk yang terdaftar untuk UMKM ini.
                </div>
              ) : (
                <div className="katalog-grid">
                  {kelompok.produk.map((prod) => (
                    <div key={prod.id} className="product-card">
                      <div className="product-img-box">
                        <img
                          src={
                            prod.foto_produk ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'
                          }
                          alt={prod.nama_produk}
                          className="product-img"
                        />
                      </div>
                      <div className="product-card-body">
                        <div className="product-badges-row">
                          <span className="badge-kategori-tag">
                            {prod.kategori}
                          </span>
                        </div>
                        <h3 className="product-title">{prod.nama_produk}</h3>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {prod.deskripsi_produk}
                        </p>
                        <div className="product-card-bottom">
                          <div className="product-price-box">
                            <span className="product-price-nominal">
                              Rp {prod.harga.toLocaleString('id-ID')}
                            </span>
                            <span className="product-price-satuan">
                              {prod.satuan || 'per Pcs'}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="product-btn-add"
                            onClick={() =>
                              addToCart({
                                ...prod,
                                kelompok: {
                                  id: kelompok.id,
                                  nama_kelompok: kelompok.nama_kelompok,
                                  nomor_wa: kelompok.nomor_wa,
                                  kecamatan: kelompok.kecamatan,
                                },
                              })
                            }
                            title="Tambahkan ke Keranjang Belanja"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              shopping_cart
                            </span>
                            <span>Tambah</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}


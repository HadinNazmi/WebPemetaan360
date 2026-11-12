import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { umkmService } from '../../services/umkmService';
import './KatalogProdukPage.css';

export default function KatalogProdukPage() {
  const { addToCart } = useCart();

  // State Produk & Metadata
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total_semua: 0, kategori: [], kecamatan: [] });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Kategori');
  const [priceRange, setPriceRange] = useState('semua'); // 'semua', 'under30', '30to60', '60to100', 'above100', 'manual'
  const [manualMin, setManualMin] = useState('');
  const [manualMax, setManualMax] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua Kecamatan');
  const [sortOption, setSortOption] = useState('rekomendasi');

  // Ambil metadata kategori & kecamatan
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await umkmService.getKategoriMeta();
        if (res.success && res.data) {
          setMeta(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat metadata kategori:', err);
      }
    }
    loadMeta();
  }, []);

  // Ambil produk berdasarkan filter
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {
          sort: sortOption,
        };

        if (search.trim()) params.search = search.trim();
        if (selectedKategori !== 'Semua Kategori') params.kategori = selectedKategori;
        if (selectedKecamatan !== 'Semua Kecamatan') params.kecamatan = selectedKecamatan;

        // Rentang harga
        if (priceRange === 'under30') {
          params.max_price = 30000;
        } else if (priceRange === '30to60') {
          params.min_price = 30000;
          params.max_price = 60000;
        } else if (priceRange === '60to100') {
          params.min_price = 60000;
          params.max_price = 100000;
        } else if (priceRange === 'above100') {
          params.min_price = 100000;
        } else if (priceRange === 'manual') {
          if (manualMin) params.min_price = parseInt(manualMin, 10);
          if (manualMax) params.max_price = parseInt(manualMax, 10);
        }

        const res = await umkmService.getProduk(params);
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat katalog produk:', err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce sedikit untuk input teks
    const timer = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedKategori, priceRange, manualMin, manualMax, selectedKecamatan, sortOption]);

  const handleResetFilter = () => {
    setSearch('');
    setSelectedKategori('Semua Kategori');
    setPriceRange('semua');
    setManualMin('');
    setManualMax('');
    setSelectedKecamatan('Semua Kecamatan');
    setSortOption('rekomendasi');
  };

  return (
    <div className="katalog-page">
      <Navbar />
      <CartDrawer />

      <main className="katalog-container">
        {/* Intro Singkat */}
        <div className="katalog-intro">
          <h1>Katalog Produk UMKM Binaan</h1>
          <p>
            Dukung pemberdayaan ekonomi masyarakat lokal pesisir Kota Dumai mitra TJSL PT Pertamina Patra Niaga.
          </p>
        </div>

        {/* 2 Kolom Layout: Sidebar Filter & Grid Produk */}
        <div className="katalog-layout">
          {/* =========================================
              1. SIDEBAR FILTER (Kiri)
             ========================================= */}
          <aside className="katalog-sidebar">
            <div className="katalog-filter-header">
              <span className="katalog-filter-title">
                <span className="material-symbols-outlined">tune</span>
                <span>Filter Katalog</span>
              </span>
              <button
                type="button"
                className="katalog-btn-reset"
                onClick={handleResetFilter}
              >
                Reset
              </button>
            </div>

            {/* A. Cari Produk */}
            <div className="filter-section">
              <span className="filter-label">Cari Produk</span>
              <div className="filter-search-box">
                <span className="material-symbols-outlined filter-search-icon">
                  search
                </span>
                <input
                  type="text"
                  className="filter-search-input"
                  placeholder="Nama produk/rasa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* B. Kategori Produk */}
            <div className="filter-section">
              <span className="filter-label">
                <span className="material-symbols-outlined">category</span>
                <span>Kategori Produk</span>
              </span>
              <div className="filter-kategori-list">
                <button
                  type="button"
                  className={`filter-kategori-btn ${
                    selectedKategori === 'Semua Kategori' ? 'active' : ''
                  }`}
                  onClick={() => setSelectedKategori('Semua Kategori')}
                >
                  <span>Semua Kategori</span>
                  <span className="filter-kategori-count">
                    {meta.total_semua || products.length}
                  </span>
                </button>

                {meta.kategori.map((kat) => (
                  <button
                    key={kat.kategori}
                    type="button"
                    className={`filter-kategori-btn ${
                      selectedKategori === kat.kategori ? 'active' : ''
                    }`}
                    onClick={() => setSelectedKategori(kat.kategori)}
                  >
                    <span className="truncate">{kat.kategori}</span>
                    <span className="filter-kategori-count">{kat.total}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* C. Rentang Harga */}
            <div className="filter-section">
              <span className="filter-label">
                <span className="material-symbols-outlined">payments</span>
                <span>Rentang Harga</span>
              </span>
              <div className="filter-radio-group">
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="price_range"
                    checked={priceRange === 'semua'}
                    onChange={() => setPriceRange('semua')}
                  />
                  <span>Semua Harga</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="price_range"
                    checked={priceRange === 'under30'}
                    onChange={() => setPriceRange('under30')}
                  />
                  <span>Di bawah Rp 30.000</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="price_range"
                    checked={priceRange === '30to60'}
                    onChange={() => setPriceRange('30to60')}
                  />
                  <span>Rp 30.000 - Rp 60.000</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="price_range"
                    checked={priceRange === '60to100'}
                    onChange={() => setPriceRange('60to100')}
                  />
                  <span>Rp 60.000 - Rp 100.000</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="price_range"
                    checked={priceRange === 'above100'}
                    onChange={() => setPriceRange('above100')}
                  />
                  <span>Di atas Rp 100.000</span>
                </label>
              </div>

              {/* Input Manual Min / Max */}
              <div className="filter-price-manual-row">
                <input
                  type="number"
                  className="filter-price-input"
                  placeholder="Min (Rp)"
                  value={manualMin}
                  onChange={(e) => {
                    setPriceRange('manual');
                    setManualMin(e.target.value);
                  }}
                />
                <input
                  type="number"
                  className="filter-price-input"
                  placeholder="Maks (Rp)"
                  value={manualMax}
                  onChange={(e) => {
                    setPriceRange('manual');
                    setManualMax(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* D. Wilayah Kecamatan */}
            <div className="filter-section">
              <span className="filter-label">
                <span className="material-symbols-outlined">location_on</span>
                <span>Wilayah Kecamatan di Dumai</span>
              </span>
              <select
                className="filter-select"
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
              >
                <option value="Semua Kecamatan">Semua Kecamatan</option>
                {meta.kecamatan.map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* =========================================
              2. MAIN CONTENT: GRID PRODUK (Kanan)
             ========================================= */}
          <section className="katalog-main">
            {/* Topbar: Counter & Urutan */}
            <div className="katalog-topbar">
              <div className="katalog-count-info">
                Menampilkan <strong>{products.length}</strong> produk
              </div>
              <div className="katalog-sort-wrapper">
                <label htmlFor="sort-select">Urutkan:</label>
                <select
                  id="sort-select"
                  className="katalog-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="rekomendasi">Paling Sesuai / Rekomendasi</option>
                  <option value="harga_termurah">Harga Terendah</option>
                  <option value="harga_termahal">Harga Tertinggi</option>
                  <option value="terbaru">Produk Terbaru</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="katalog-empty-grid">
                <span className="material-symbols-outlined spin text-3xl text-slate-400">
                  progress_activity
                </span>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                  Memuat daftar produk UMKM...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="katalog-empty-grid">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                  inventory_2
                </span>
                <h3 className="text-base font-bold text-slate-700">
                  Tidak ada produk yang cocok
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Coba ubah kata kunci pencarian atau bersihkan filter yang aktif.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Bersihkan Filter
                </button>
              </div>
            ) : (
              <div className="katalog-grid">
                {products.map((prod) => (
                  <div key={prod.id} className="product-card">
                    {/* Gambar Produk */}
                    <div className="product-img-box">
                      <img
                        src={
                          prod.foto_produk ||
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'
                        }
                        alt={prod.nama_produk}
                        className="product-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="product-card-body">
                      {/* Badges Row */}
                      <div className="product-badges-row">
                        <span className="badge-kategori-tag">
                          {prod.kategori}
                        </span>
                        {prod.kelompok?.kecamatan && (
                          <span className="badge-kecamatan-tag">
                            <span className="material-symbols-outlined text-[13px]">
                              location_on
                            </span>
                            <span>{prod.kelompok.kecamatan}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="product-title">{prod.nama_produk}</h3>

                      {/* Nama Kelompok / Pemilik Link */}
                      {prod.kelompok && (
                        <Link
                          to={`/direktori-umkm/${prod.kelompok.slug}`}
                          className="product-kelompok-link"
                          title={`Lihat profil ${prod.kelompok.nama_kelompok}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            storefront
                          </span>
                          <span className="truncate">
                            {prod.kelompok.nama_kelompok}
                          </span>
                        </Link>
                      )}

                      {/* Bottom: Harga & Tombol Tambah */}
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
                          onClick={() => addToCart(prod, 1)}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}


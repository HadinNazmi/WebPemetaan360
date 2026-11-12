import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/cart/CartDrawer';
import PageHero from '../../components/common/PageHero';
import { umkmService } from '../../services/umkmService';
import './DirektoriUmkmPage.css';

export default function DirektoriUmkmPage() {
  const [kelompokList, setKelompokList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua Kecamatan');
  const [kecamatanOptions, setKecamatanOptions] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [listRes, metaRes] = await Promise.all([
          umkmService.getKelompok({
            search: search.trim() || undefined,
            kecamatan: selectedKecamatan !== 'Semua Kecamatan' ? selectedKecamatan : undefined,
          }),
          umkmService.getKategoriMeta(),
        ]);

        if (listRes.success && Array.isArray(listRes.data)) {
          setKelompokList(listRes.data);
        }
        if (metaRes.success && metaRes.data?.kecamatan) {
          setKecamatanOptions(metaRes.data.kecamatan);
        }
      } catch (err) {
        console.error('Gagal memuat direktori UMKM:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedKecamatan]);

  return (
    <div className="direktori-page">
      <Navbar />
      <CartDrawer />

      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Direktori UMKM', href: '/direktori-umkm' },
        ]}
        title="Direktori Kelompok UMKM Binaan"
        subtitle="Mitra TJSL CSR Pertamina Patra Niaga Dumai"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
      />

      <main className="direktori-container">

        {/* Filter Bar */}
        <div className="direktori-filters-bar">
          <div className="direktori-search-box">
            <span className="material-symbols-outlined direktori-search-icon">
              search
            </span>
            <input
              type="text"
              className="direktori-search-input"
              placeholder="Cari nama kelompok / nama pengelola..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="direktori-kecamatan-select"
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            <option value="Semua Kecamatan">Semua Kecamatan</option>
            {kecamatanOptions.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>
        </div>

        {/* Grid Kelompok */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined spin text-3xl">
              progress_activity
            </span>
            <p className="mt-2 text-sm">Memuat direktori kelompok UMKM...</p>
          </div>
        ) : kelompokList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              storefront
            </span>
            <h3 className="font-bold text-base mt-2">
              Tidak ada kelompok UMKM ditemukan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Coba sesuaikan kata kunci pencarian atau filter kecamatan Anda.
            </p>
          </div>
        ) : (
          <div className="direktori-grid">
            {kelompokList.map((kel) => (
              <div key={kel.id} className="umkm-card">
                <div className="umkm-card-img-box">
                  <img
                    src={
                      kel.foto_cover ||
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={kel.nama_kelompok}
                    className="umkm-card-img"
                  />
                  {kel.angkatan && (
                    <span className="umkm-card-badge-angkatan">
                      {kel.angkatan}
                    </span>
                  )}
                </div>

                <div className="umkm-card-body">
                  <h3 className="umkm-card-nama">{kel.nama_kelompok}</h3>
                  <div className="umkm-card-kecamatan">
                    <span className="material-symbols-outlined text-[15px] text-red-500">
                      location_on
                    </span>
                    <span>{kel.kecamatan}</span>
                  </div>

                  <p className="umkm-card-desc">
                    {kel.deskripsi ||
                      'Kelompok usaha mandiri binaan program TJSL CSR PT Pertamina Patra Niaga Dumai.'}
                  </p>

                  <div className="umkm-card-meta-row">
                    <span>
                      Ketua: <strong>{kel.nama_ketua}</strong>
                    </span>
                    <span>
                      Produk: <strong>{kel.produk_count || 0} Item</strong>
                    </span>
                  </div>

                  <Link
                    to={`/direktori-umkm/${kel.slug}`}
                    className="umkm-card-btn-detail"
                  >
                    <span>Kunjungi Profil &amp; Produk</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { getFullImageUrl } from '../utils/imageUrl';

export default function HeroTourSection() {
  const [wilayahList, setWilayahList] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWilayah() {
      try {
        const res = await apiClient.get('/tour-360');
        if (res.data?.success && res.data.data?.length > 0) {
          setWilayahList(res.data.data);
          setSelectedWilayah(res.data.data[0]);
        }
      } catch (err) {
        console.error('Gagal memuat wilayah tour hero:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWilayah();
  }, []);

  const coverUrl = selectedWilayah?.gambar_cover
    ? getFullImageUrl(selectedWilayah.gambar_cover)
    : 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

  return (
    <div className="relative min-h-[90vh] md:min-h-screen bg-slate-900 text-white flex flex-col justify-between overflow-hidden font-['Montserrat',sans-serif]">
      {/* Background Cover Image Jernih (Plong) dengan Gradient Halus Saja */}
      <div className="absolute inset-0 z-0">
        <img
          src={coverUrl}
          alt={selectedWilayah?.nama_wilayah || 'Kawasan Binaan CSR'}
          className="w-full h-full object-cover object-center transition-all duration-700"
        />
        {/* Gradient halus dari kiri ke kanan agar teks terbaca jelas dan foto tetap terang plong */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>
      </div>

      {/* Konten Hero Utama */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl flex flex-col gap-5">
          {/* Badge Pertamina */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-semibold backdrop-blur-md w-fit shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>PORTAL KEBERLANJUTAN &amp; VIRTUAL TOUR 360</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Jelajahi Inovasi Sosial &amp; Kawasan Binaan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Pertamina Patra Niaga
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal drop-shadow-sm">
            Eksplorasi panorama 360° secara interaktif pada program sirkularitas ekonomi minyak jelantah <strong>SiMinah</strong>, sistem monitoring <strong>Simon+</strong>, dan kawasan hijau binaan di Riau.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={selectedWilayah ? `/tour-360/${selectedWilayah.slug}` : '/tour-360'}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-sm font-bold shadow-xl shadow-blue-900/30 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">360</span>
              <span>Mulai Jelajah 360° {selectedWilayah?.nama_wilayah || ''}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            <a
              href="/#visi-misi"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700/80 backdrop-blur-md transition"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span>Lihat Sekilas Program</span>
            </a>
          </div>
        </div>
      </div>

      {/* Selector Wilayah Tab Bawah */}
      {wilayahList.length > 0 && (
        <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="material-symbols-outlined text-[18px] text-amber-400">pin_drop</span>
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Pilih Kawasan Binaan:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {wilayahList.map((w) => {
                const isSelected = selectedWilayah?.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWilayah(w)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-[#00529C] text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                    }`}
                  >
                    <span>{w.nama_wilayah}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
                      {w.scenes_count || 0} Titik 360
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


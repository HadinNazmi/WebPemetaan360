import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import DetailLayout from '../../components/common/DetailLayout.jsx';
import SidebarArticlesWidget from '../../components/common/SidebarArticlesWidget.jsx';
import InfoTableWidget from '../../components/common/InfoTableWidget.jsx';
import { programService } from '../../services/programService.js';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Layers,
  HeartHandshake,
  GraduationCap,
  HeartPulse,
  Leaf,
  Store,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function TjslPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      setLoading(true);
      try {
        const artRes = await programService.getArticles();
        if (artRes?.success && Array.isArray(artRes.data)) {
          setArticles(artRes.data);
        }
      } catch (err) {
        console.error('Gagal memuat artikel terkait TJSL:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Bantuan CSR', href: '/#bantuan-csr' },
    { label: 'TJSL' },
  ];

  const metadataItems = [
    { label: 'Nama Program', value: 'Tanggung Jawab Sosial dan Lingkungan (TJSL)' },
    { label: 'Kategori Program', value: 'Penyaluran Bantuan & Pemberdayaan Masyarakat' },
    { label: 'Inisiator / Pengelola', value: 'PT Pertamina Patra Niaga' },
    {
      label: 'Payung Regulasi',
      value: 'UU No. 40/2007 & Permen BUMN No. PER-05/MBU/04/2021',
    },
    { label: 'Standar Pedoman', value: 'ISO 26000 Social Responsibility' },
    {
      label: '4 Pilar Utama',
      value: 'Pertamina Cerdas, Pertamina Sehat, Pertamina Hijau, Pertamina Berdikari',
    },
    {
      label: 'Sistem Monitoring',
      value: 'Simon+ (Sistem Monitoring & Evaluasi CSR)',
      href: '/sistem/simon_plus',
    },
    { label: 'Metode Pengukuran', value: 'Social Return on Investment (SROI)' },
    { label: 'Status Operasional', value: 'Aktif Berkelanjutan di Seluruh Ring 1' },
    {
      label: 'Layanan Pengaduan / PCC',
      value: '135 (Pertamina Call Center)',
      isPhone: true,
    },
  ];

  const pilarList = [
    {
      nama: 'Pertamina Cerdas',
      kategori: 'Pendidikan',
      ikon: GraduationCap,
      warnaBorder: 'border-blue-500',
      warnaBg: 'bg-blue-50 text-blue-700',
      deskripsi:
        'Peningkatan mutu pendidikan formal maupun vokasi melalui renovasi sarana sekolah, penyediaan perlengkapan belajar, beasiswa anak berprestasi, dan pelatihan literasi digital generasi muda.',
    },
    {
      nama: 'Pertamina Sehat',
      kategori: 'Kesehatan & Sanitasi',
      ikon: HeartPulse,
      warnaBorder: 'border-rose-500',
      warnaBg: 'bg-rose-50 text-rose-700',
      deskripsi:
        'Dukungan peningkatan kualitas kesehatan keluarga, program terpadu penurunan stunting, pemeriksaan kesehatan berkala, penyediaan posyandu balita & lansia, serta pembangunan sarana air bersih.',
    },
    {
      nama: 'Pertamina Hijau',
      kategori: 'Lingkungan Hidup',
      ikon: Leaf,
      warnaBorder: 'border-emerald-500',
      warnaBg: 'bg-emerald-50 text-emerald-700',
      deskripsi:
        'Konservasi keanekaragaman hayati, pelestarian lahan gambut dan mangrove, rehabilitasi hutan pantai, serta sirkularitas limbah rumah tangga melalui inovasi sedekah jelantah SiMinah.',
    },
    {
      nama: 'Pertamina Berdikari',
      kategori: 'Pemberdayaan Ekonomi & UMKM',
      ikon: Store,
      warnaBorder: 'border-amber-500',
      warnaBg: 'bg-amber-50 text-amber-700',
      deskripsi:
        'Pengembangan kemandirian ekonomi masyarakat melalui inkubasi kelompok UMKM binaan, bantuan alat produksi, pendampingan legalitas izin usaha, serta perluasan akses pasar daring.',
    },
  ];

  const prinsipPelaksanaan = [
    'Berbasis Pemetaan Sosial (Social Mapping) Akurat dan Kebutuhan Riil Komunitas',
    'Pengukuran Dampak Berkelanjutan dengan Metodologi SROI (Social Return on Investment)',
    'Pendekatan Partisipatif yang Menumbuhkan Kepemilikan & Kemandirian Warga',
    'Transparansi Alokasi Anggaran & Progres Fisik via Platform Simon+',
    'Kepatuhan Penuh pada Standar Mutu Internasional ISO 26000 & Arahan BUMN',
    'Kolaborasi Kemitraan Multipihak (Pemerintah Daerah, Akademisi, dan Komunitas)',
  ];

  const tahapanPenyaluran = [
    {
      tahap: '01',
      judul: 'Pengajuan & Pemetaan',
      deskripsi:
        'Penerimaan usulan proposal masyarakat atau inisiasi berdasarkan hasil pemetaan sosial ring 1 wilayah operasi.',
    },
    {
      tahap: '02',
      judul: 'Verifikasi & Uji Kelayakan',
      deskripsi:
        'Peninjauan langsung ke lapangan oleh tim CSR untuk memastikan keselarasan pilar, sasaran penerima manfaat, dan mitigasi risiko.',
    },
    {
      tahap: '03',
      judul: 'Penyaluran Bantuan',
      deskripsi:
        'Penetapan persetujuan program dan penyerahan bantuan sarana, modal stimulan, atau fasilitas secara akuntabel.',
    },
    {
      tahap: '04',
      judul: 'Monitoring & Keberlanjutan',
      deskripsi:
        'Pendampingan berkala, pelaporan progres melalui Simon+, serta evaluasi kepuasan masyarakat dan pencapaian SROI.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat profil program TJSL Pertamina...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Utama */}
      <Navbar />

      {/* 2. Hero Header Sub-Halaman Reusable (Pola Simon+) */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title="Tanggung Jawab Sosial dan Lingkungan (TJSL)"
        subtitle="PROGRAM PENYALURAN BANTUAN & PEMBERDAYAAN MASYARAKAT"
        backgroundImage="https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp"
      />

      {/* 3. Main Two-Column Layout Reusable (Pola Simon+) */}
      <main className="flex-1">
        <DetailLayout
          sidebar={
            <div className="space-y-6">
              {/* Card CTA Penyaluran Bantuan */}
              <div className="bg-gradient-to-br from-[#003366] to-[#00529C] text-white p-6 rounded-2xl shadow-md flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                  <Layers size={16} />
                  <span>Akses Penyaluran Bantuan</span>
                </div>
                <h4 className="text-lg font-bold">Kemitraan &amp; Bantuan TJSL</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Pertamina senantiasa menyalurkan bantuan terarah untuk pendidikan, kesehatan, fasilitas air bersih, serta kemandirian ekonomi masyarakat secara transparan dan berkelanjutan.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="/#bantuan-csr"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#003366] font-bold text-xs rounded-xl hover:bg-slate-100 transition shadow-sm"
                  >
                    <span>Lihat Kartu Bantuan di Beranda</span>
                    <ExternalLink size={14} />
                  </a>
                  <Link
                    to="/sistem/simon_plus"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-900/60 hover:bg-blue-900/80 text-blue-100 font-semibold text-xs rounded-xl border border-blue-300/30 transition"
                  >
                    <span>Monitoring di Simon+</span>
                    <TrendingUp size={14} />
                  </Link>
                </div>
              </div>

              {/* Widget Tabel Informasi Platform (Pola Simon+) */}
              <InfoTableWidget
                title="Spesifikasi & Regulasi TJSL"
                items={metadataItems}
              />

              {/* Widget Artikel Terkait (Pola Simon+) */}
              <SidebarArticlesWidget
                headerTitle="Publikasi & Liputan TJSL"
                items={articles}
              />
            </div>
          }
        >
          <div className="space-y-8">
            {/* Navigasi Balik ke Beranda */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition"
              >
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </div>

            {/* Ringkasan & Deskripsi Lengkap */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-[#00529C]" />
                <span>Komitmen Keberlanjutan Pertamina Patra Niaga</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 border-b border-slate-200 pb-3">
                Tentang Tanggung Jawab Sosial dan Lingkungan (TJSL)
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  <strong>Tanggung Jawab Sosial dan Lingkungan (TJSL)</strong> merupakan komitmen perseroan dalam menciptakan nilai ekonomi bersama (*Creating Shared Value*) yang sejalan dengan strategi bisnis berkelanjutan PT Pertamina Patra Niaga.
                </p>
                <p>
                  Pelaksanaan TJSL tidak sekadar berfokus pada penyaluran bantuan sosial jangka pendek, melainkan diarahkan pada pemberdayaan terstruktur, peningkatan kualitas hidup komunitas, pelestarian lingkungan hidup, serta kepatuhan tata kelola berbasis standar internasional <strong>ISO 26000</strong> dan Tujuan Pembangunan Berkelanjutan (<em>Sustainable Development Goals / SDGs</em>).
                </p>
                <p>
                  Seluruh program TJSL dipantau dan dievaluasi secara berkala melalui sistem terintegrasi <strong>Simon+</strong>, menjamin akuntabilitas penyaluran bantuan, validitas data penerima manfaat, hingga perhitungan skor dampak sosial (<em>Social Return on Investment / SROI</em>).
                </p>
              </div>
            </div>

            {/* 4 Pilar Utama TJSL Pertamina */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="text-[#00529C]" size={20} />
                  <span>4 Pilar Prioritas TJSL Pertamina</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Fokus Pemberdayaan Terpadu
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pilarList.map((pilar, idx) => {
                  const IconComp = pilar.ikon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition duration-200 flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-10 h-10 rounded-xl ${pilar.warnaBg} flex items-center justify-center font-bold`}
                          >
                            <IconComp size={20} />
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {pilar.kategori}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00529C] transition-colors">
                          {pilar.nama}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pilar.deskripsi}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
                        <span>Pilar Strategis #{idx + 1}</span>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fitur & Prinsip Pelaksanaan (Pola Kotak Centang Simon+) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Prinsip Utama &amp; Tata Kelola Pelaksanaan TJSL</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {prinsipPelaksanaan.map((prinsip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#00529C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-slate-800 leading-snug">
                      {prinsip}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alur Tahapan Penyaluran Bantuan */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="text-[#00529C]" size={18} />
                <span>Alur &amp; Mekanisme Penyaluran Bantuan TJSL</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {tahapanPenyaluran.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 relative overflow-hidden flex flex-col justify-between"
                  >
                    <span className="text-3xl font-black text-slate-100 absolute top-2 right-3 select-none pointer-events-none">
                      {item.tahap}
                    </span>
                    <div className="relative z-10 space-y-1">
                      <span className="text-[11px] font-bold text-[#00529C] uppercase tracking-wider">
                        Tahap {item.tahap}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900">
                        {item.judul}
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed pt-1">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailLayout>
      </main>

      {/* 4. Footer Portal */}
      <Footer />
    </div>
  );
}


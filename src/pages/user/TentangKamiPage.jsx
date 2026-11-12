import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import DetailLayout from '../../components/common/DetailLayout.jsx';
import SidebarArticlesWidget from '../../components/common/SidebarArticlesWidget.jsx';
import InfoTableWidget from '../../components/common/InfoTableWidget.jsx';
import { programService } from '../../services/programService.js';
import { ArrowLeft, Target, Compass, Award, ShieldCheck } from 'lucide-react';

export default function TentangKamiPage() {
  const [visiMisi, setVisiMisi] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      setLoading(true);
      const [vmRes, artRes] = await Promise.all([
        programService.getVisiMisi(),
        programService.getArticles(),
      ]);

      if (vmRes?.success && vmRes.data) {
        setVisiMisi(vmRes.data);
      }
      if (artRes?.success) {
        setArticles(artRes.data);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tentang Kami' },
  ];

  const metadataKemitraan = [
    { label: 'Entitas Pengelola', value: 'PT Pertamina Patra Niaga' },
    { label: 'Mitra Akademik & Riset', value: 'Politeknik Caltex Riau (PCR)' },
    { label: 'Fokus Utama', value: 'TJSL, ESG, & Sirkularitas Energi' },
    { label: 'Standar Penerapan', value: 'ISO 26000 & SDGs 2030' },
    { label: 'Wilayah Operasi Utama', value: 'Kawasan Pesisir & Ring-1 Dumai' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Utama */}
      <Navbar />

      {/* 2. Hero Header Sub-Halaman Reusable */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title="Tentang Program TJSL &amp; Kemitraan Keberlanjutan"
        category="Komitmen Bersama PT Pertamina Patra Niaga & Politeknik Caltex Riau"
        badge="PROFIL CSR & KEBERLANJUTAN"
        backgroundImage="https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp"
        fallbackImage="/images/logo2.png"
      />

      {/* 3. Main Two-Column Layout Reusable */}
      <main className="flex-1">
        <DetailLayout
          sidebar={
            <div className="space-y-6">
              {/* Widget Tabel Metadata Kemitraan */}
              <InfoTableWidget
                title="Informasi Kemitraan"
                items={metadataKemitraan}
              />

              {/* Widget Publikasi Berita Terkait */}
              <SidebarArticlesWidget
                title="Publikasi & Liputan Terkait"
                articles={articles}
                limit={4}
              />
            </div>
          }
        >
          <div className="space-y-8">
            {/* Back Button */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition"
              >
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </div>

            {/* Pengantar Profil */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">
                {visiMisi?.judul_utama || 'Mewujudkan Kemandirian Berkelanjutan Melalui Transformasi Digital TJSL'}
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                {visiMisi?.deskripsi_pengantar ||
                  'Program Tanggung Jawab Sosial dan Lingkungan (TJSL) PT Pertamina Patra Niaga dirancang sebagai wujud kepedulian nyata perusahaan dalam menciptakan nilai bersama (Creating Shared Value) bagi masyarakat dan kelestarian ekosistem di sekitar wilayah operasi. Bekerja sama dengan institusi vokasi unggulan Politeknik Caltex Riau (PCR), program ini mengintegrasikan riset terapan, teknologi digitalisasi pemetaan 360°, dan pemberdayaan masyarakat berbasis sirkularitas ekonomi.'}
              </p>
            </div>

            {/* Visi & Misi Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center">
                  <Compass size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Visi TJSL</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {visiMisi?.visi ||
                    'Menjadi motor penggerak transformasi kemandirian masyarakat dan pelopor sirkularitas energi hijau berkelanjutan di tingkat regional dan nasional.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Target size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Misi TJSL</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {visiMisi?.misi ||
                    '1. Mendorong kemandirian ekonomi masyarakat melalui digitalisasi rantai nilai UMKM.\n2. Melestarikan lingkungan hidup pesisir dan memitigasi pencemaran limbah jelantah.\n3. Mengembangkan ekosistem edukasi terapan dan transfer teknologi bersama perguruan tinggi.'}
                </p>
              </div>
            </div>

            {/* 4 Pilar Keberlanjutan */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={22} className="text-[#00529C]" />
                <h3 className="text-lg font-bold text-slate-900">Empat Pilar Utama Program TJSL</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-sm text-[#003366] mb-1">Pertamina Cerdas</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penguatan kapasitas vokasi, beasiswa generasi muda, dan literasi teknologi digital bersama Politeknik Caltex Riau.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-emerald-700 mb-1">Pertamina Hijau</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sirkularitas minyak jelantah melalui SiMinah, konservasi kawasan gambut terpadu, dan pelestarian mangrove pesisir.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-amber-700 mb-1">Pertamina Berdikari</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemberdayaan kelompok usaha wanita nelayan, sertifikasi halal produk UMKM, dan permodalan bergulir terpadu.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-rose-700 mb-1">Pertamina Sehat</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Penyediaan akses sarana air bersih pedesaan, sanitasi sehat, dan penurunan angka stunting di wilayah ring-1.
                  </p>
                </div>
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


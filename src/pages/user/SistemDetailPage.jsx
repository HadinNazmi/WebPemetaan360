import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import DetailLayout from '../../components/common/DetailLayout.jsx';
import SidebarArticlesWidget from '../../components/common/SidebarArticlesWidget.jsx';
import InfoTableWidget from '../../components/common/InfoTableWidget.jsx';
import { programService } from '../../services/programService.js';
import { ArrowLeft, ExternalLink, CheckCircle2, Layers } from 'lucide-react';

export default function SistemDetailPage() {
  const { slug } = useParams();
  const [sistem, setSistem] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      setLoading(true);
      const [sisRes, artRes] = await Promise.all([
        programService.getSistemDetail(slug || 'siminah'),
        programService.getArticles(),
      ]);

      if (sisRes?.success && sisRes.data) {
        setSistem(sisRes.data);
      } else {
        setSistem(null);
      }

      if (artRes?.success) {
        setArticles(artRes.data);
      }
      setLoading(false);
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat profil sistem CSR dari database...</span>
        </div>
      </div>
    );
  }

  if (!sistem) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sistem Tidak Ditemukan</h2>
            <p className="text-sm text-slate-500 mb-6">
              Data platform sistem dengan identitas <code className="bg-slate-100 px-2 py-0.5 rounded text-red-600 font-mono">"{slug}"</code> belum terdaftar di database.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Sistem CSR', href: '/#capaian-digital' },
    { label: sistem.nama_sistem },
  ];

  const metadataItems = [
    { label: 'Kode Sistem', value: (sistem.kode_sistem || '').toUpperCase() },
    { label: 'Kategori Platform', value: sistem.badge_label || 'Sistem Digital CSR' },
    { label: 'Inisiator / Pengembang', value: 'Pertamina Patra Niaga x PCR' },
    { label: 'Status Operasional', value: 'Aktif Terintegrasi' },
    ...(sistem.url_portal ? [{ label: 'Tautan Portal Web', value: sistem.url_portal }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Utama */}
      <Navbar />

      {/* 2. Hero Header Sub-Halaman Reusable */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title={sistem.nama_sistem}
        category={sistem.deskripsi}
        badge={sistem.badge_label || 'SISTEM DIGITAL CSR'}
        backgroundImage={sistem.gambar_cover}
        fallbackImage="https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp"
      />

      {/* 3. Main Two-Column Layout Reusable */}
      <main className="flex-1">
        <DetailLayout
          sidebar={
            <div className="space-y-6">
              {/* Card CTA Kunjungi Aplikasi */}
              {sistem.url_portal && (
                <div className="bg-gradient-to-br from-[#003366] to-[#00529C] text-white p-6 rounded-2xl shadow-md flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                    <Layers size={16} />
                    <span>Akses Portal Platform</span>
                  </div>
                  <h4 className="text-lg font-bold">Buka Aplikasi {sistem.nama_sistem}</h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Masuk langsung ke dashboard operasional platform untuk melakukan transaksi sedekah, verifikasi data, atau pemantauan evaluasi program.
                  </p>
                  <a
                    href={sistem.url_portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-white text-[#003366] font-bold text-xs rounded-xl hover:bg-slate-100 transition shadow-sm"
                  >
                    <span>Kunjungi Portal Resmi</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Widget Tabel Informasi Platform */}
              <InfoTableWidget
                title={`Spesifikasi ${sistem.nama_sistem}`}
                items={metadataItems}
              />

              {/* Widget Artikel Terkait */}
              <SidebarArticlesWidget
                title="Publikasi & Liputan Terkait"
                articles={articles}
                limit={4}
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
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">
                Tentang Inovasi {sistem.nama_sistem}
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {sistem.deskripsi_lengkap || sistem.deskripsi}
              </div>
            </div>

            {/* Fitur & Modul Unggulan Sistem */}
            {Array.isArray(sistem.fitur_keunggulan) && sistem.fitur_keunggulan.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Fitur &amp; Kemampuan Utama Platform</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {sistem.fitur_keunggulan.map((fitur, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-[#00529C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs md:text-sm font-medium text-slate-800 leading-snug">
                        {fitur}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailLayout>
      </main>

      {/* 4. Footer Portal */}
      <Footer />
    </div>
  );
}


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import DetailLayout from '../../components/common/DetailLayout.jsx';
import SidebarArticlesWidget from '../../components/common/SidebarArticlesWidget.jsx';
import InfoTableWidget from '../../components/common/InfoTableWidget.jsx';
import { programService } from '../../services/programService.js';
import { ArrowLeft } from 'lucide-react';

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      setLoading(true);
      const [progRes, artRes] = await Promise.all([
        programService.getProgramBySlug(slug || 'ppid'),
        programService.getArticles(),
      ]);

      if (progRes?.success) {
        setProgram(progRes.data);
      } else {
        setProgram(null);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat informasi program dari database...</span>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Program Tidak Ditemukan</h2>
            <p className="text-sm text-slate-500 mb-6">
              Data program dengan slug <code className="bg-slate-100 px-2 py-0.5 rounded text-red-600 font-mono">"{slug}"</code> belum terdaftar di database.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
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
    { label: program.kategori || 'Program CSR', href: '/#galeri' },
    { label: program.page_title || program.judul_program },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Utama */}
      <Navbar />

      {/* 2. Hero Header Sub-Halaman */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title={program.page_title || program.judul_program}
        category={program.sub_title || program.kategori}
        badge="PROGRAM CSR UNGGULAN"
        backgroundImage={program.banner}
        fallbackImage={program.fallbackImg}
      />

      {/* 3. Main Two-Column Layout */}
      <main className="flex-1">
        <DetailLayout
          sidebar={
            <div className="space-y-6">
              {/* Widget Tabel Metadata Program */}
              {program.metadata && program.metadata.length > 0 && (
                <InfoTableWidget
                  title={`Informasi ${program.page_title || program.judul_program}`}
                  items={program.metadata}
                />
              )}

              {/* Widget Artikel Berita Terkait */}
              <SidebarArticlesWidget
                title="Publikasi Terkait"
                articles={articles}
                limit={4}
              />
            </div>
          }
        >
          <div className="space-y-6">
            {/* Back to Home pill */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition"
              >
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </div>

            {/* Rich text body dari database */}
            {program.konten_lengkap ? (
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed break-words whitespace-pre-line [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-6 [&>h3]:mb-3"
                dangerouslySetInnerHTML={{ __html: program.konten_lengkap }}
              />
            ) : (
              <p className="text-slate-500 italic">Belum ada rincian deskripsi untuk program ini.</p>
            )}
          </div>
        </DetailLayout>
      </main>

      {/* 4. Footer Portal */}
      <Footer />
    </div>
  );
}

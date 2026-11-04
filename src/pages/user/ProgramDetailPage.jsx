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
      }
      if (artRes?.success) {
        setArticles(artRes.data);
      }
      setLoading(false);
    }

    loadData();
  }, [slug]);

  if (loading || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat informasi program...</span>
        </div>
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

      {/* 2. Reusable Hero Banner */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title={program.page_title || program.judul_program}
        subtitle={program.sub_title || program.kategori}
        backgroundImage={program.banner || program.fallbackImg}
      />

      {/* 3. Reusable 2-Column Detail Layout */}
      <DetailLayout
        sidebar={
          <div className="space-y-6">
            {/* Tombol Kembali Cepat ke Beranda */}
            <Link
              to="/#galeri"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Jelajah Program</span>
            </Link>

            {/* Reusable Sidebar Widget Persis Referensi */}
            <SidebarArticlesWidget
              headerTitle="Publikasi & Informasi Terkait"
              items={articles}
              activeSlug={slug}
            />
          </div>
        }
      >
        {/* Konten Utama Detail Program */}
        <article className="prose prose-slate max-w-none">
          {/* Judul Artikel / Detail */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            {program.judul_program}
          </h2>

          {/* Isi Rich Text / Paragraf */}
          <div
            className="text-slate-600 leading-relaxed text-sm md:text-base space-y-4"
            dangerouslySetInnerHTML={{
              __html:
                program.konten_lengkap ||
                `<p>${program.ringkasan || 'Informasi lengkap program sedang diperbarui.'}</p>`,
            }}
          />

          {/* Reusable Key-Value Info Table Widget */}
          {program.metadata && (
            <InfoTableWidget
              items={program.metadata}
              title="Informasi Kontak & Layanan"
            />
          )}
        </article>
      </DetailLayout>

      {/* 4. Footer Utama Pertamina */}
      <Footer />
    </div>
  );
}

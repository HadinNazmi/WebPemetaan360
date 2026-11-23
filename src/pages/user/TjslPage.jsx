import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import DetailLayout from '../../components/common/DetailLayout.jsx';
import SidebarArticlesWidget from '../../components/common/SidebarArticlesWidget.jsx';
import { programService } from '../../services/programService.js';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Calendar,
  Building2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function TjslPage() {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [nomor, setNomor] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadArticles() {
      setLoadingArticles(true);
      try {
        const artRes = await programService.getArticles();
        if (artRes?.success && Array.isArray(artRes.data)) {
          setArticles(artRes.data);
        }
      } catch (err) {
        console.error('Gagal memuat artikel terkait TJSL:', err);
      } finally {
        setLoadingArticles(false);
      }
    }

    loadArticles();
  }, []);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Bantuan CSR', href: '/#bantuan-csr' },
    { label: 'TJSL' },
  ];

  const handleCheck = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = nomor.trim();
    if (!query) {
      setError('Harap masukkan nomor surat pengajuan proposal Anda.');
      setResult(null);
      setHasSearched(true);
      return;
    }

    setError('');
    setTrackingLoading(true);
    setHasSearched(true);

    try {
      const res = await programService.trackProposal(query);
      if (res && res.success && res.data) {
        setResult(res.data);
        setError('');
      } else {
        setResult(null);
        setError(res?.message || 'Nomor surat pengajuan tidak ditemukan dalam sistem database.');
      }
    } catch (err) {
      setResult(null);
      setError('Terjadi kendala saat menghubungkan ke sistem. Pastikan nomor surat benar dan coba lagi.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'diterima':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Disetujui / Diterima',
          icon: CheckCircle2,
        };
      case 'ditolak':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Pengajuan Ditolak',
          icon: XCircle,
        };
      case 'diproses':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Sedang Diproses',
          icon: Clock,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar Utama */}
      <Navbar />

      {/* 2. Hero Header Sub-Halaman Reusable */}
      <PageHero
        breadcrumbs={breadcrumbs}
        title="Tanggung Jawab Sosial dan Lingkungan (TJSL)"
        subtitle="PORTAL PELACAKAN PROPOSAL BANTUAN & PROGRAM TJSL"
        backgroundImage="https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp"
      />

      {/* 3. Main Content Two-Column (Sidebar di kiri pada Desktop, atas pada Mobile) */}
      <main className="flex-1">
        <DetailLayout
          sidebar={
            <div className="space-y-6">
              {/* Card Form Cek Status Pengajuan (Biru Khas Pertamina) */}
              <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#00529C] text-white p-6 rounded-2xl shadow-lg border border-blue-900/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">
                  <Search size={16} className="text-blue-300" />
                  <span>Pelacakan Mandiri</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
                  Cek Status Pengajuan TJSL
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                  Masyarakat dan lembaga pemohon dapat memantau perkembangan proses pengajuan proposal bantuan TJSL secara transparan menggunakan nomor surat resmi.
                </p>

                <form onSubmit={handleCheck} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200 mb-1.5">
                      Nomor Surat Pengajuan
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contoh: TJSL-2026-001"
                        value={nomor}
                        onChange={(e) => setNomor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium shadow-inner"
                      />
                      {nomor && (
                        <button
                          type="button"
                          onClick={() => setNomor('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md disabled:opacity-75 disabled:cursor-not-allowed mt-1"
                  >
                    {trackingLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Mengecek Data...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>Cek Status</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Petunjuk & Contoh Nomor Surat */}
                <div className="mt-4 pt-3.5 border-t border-white/10 text-[11px] text-blue-200/80 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-white/90">
                    <Info size={12} className="text-amber-300" />
                    <span>Contoh nomor surat uji coba:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['TJSL-2026-001', 'TJSL-2026-002', 'TJSL-2026-003'].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setNomor(sample);
                        }}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] transition"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Bantuan Card */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <HelpCircle size={15} className="text-[#00529C]" />
                  <span>Butuh Bantuan Pengajuan?</span>
                </div>
                <p className="leading-relaxed">
                  Pastikan nomor surat sesuai dengan lembar tanda terima berkas dari Sekretariat CSR Pertamina Patra Niaga.
                </p>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Navigasi Balik ke Beranda */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition"
              >
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </div>

            {/* HASIL PELACAKAN: TAMPIL JIKA SUDAH DICARI ATAU NOTIFIKASI */}
            {error && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-800 animate-fadeIn">
                <AlertCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-900">
                    Pencarian Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {error}
                  </p>
                  <p className="text-[11px] text-rose-600 pt-1">
                    Periksa kembali penulisan nomor surat pengajuan Anda, atau hubungi petugas CSR kami jika berkas baru saja diajukan.
                  </p>
                </div>
              </div>
            )}

            {/* KONDISI 1: JIKA HASIL DITEMUKAN */}
            {result ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Informasi Proposal */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Hasil Pelacakan Proposal
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 font-mono mt-0.5">
                        {result.nomor_surat}
                      </h2>
                    </div>

                    {/* Badge Status */}
                    {(() => {
                      const badge = getStatusBadge(result.status);
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${badge.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                          <BadgeIcon size={14} />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Ringkasan Pengajuan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Building2 size={16} className="text-[#00529C] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block font-medium">Pemohon / Lembaga</span>
                        <span className="text-slate-800 font-bold text-sm">
                          {result.nama_pengaju || 'Masyarakat / Komunitas Binaan'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <FileText size={16} className="text-[#00529C] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block font-medium">Judul Proposal</span>
                        <span className="text-slate-800 font-bold text-sm">
                          {result.judul_proposal || 'Bantuan Pemberdayaan Program TJSL'}
                        </span>
                      </div>
                    </div>

                    {result.tgl_pengajuan && (
                      <div className="flex items-start gap-2.5">
                        <Calendar size={16} className="text-[#00529C] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block font-medium">Tanggal Masuk Berkas</span>
                          <span className="text-slate-700 font-semibold">
                            {result.tgl_pengajuan}
                          </span>
                        </div>
                      </div>
                    )}

                    {result.updated_at && (
                      <div className="flex items-start gap-2.5">
                        <Clock size={16} className="text-[#00529C] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block font-medium">Pembaruan Terakhir</span>
                          <span className="text-slate-700 font-semibold">
                            {result.updated_at} WIB
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* KONDISI B: JIKA PENGAJUAN DITOLAK */}
                {result.status === 'ditolak' ? (
                  <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 space-y-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <XCircle size={24} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-rose-900">
                          Pemberitahuan: Pengajuan Proposal Tidak Dapat Disetujui
                        </h3>
                        <p className="text-xs text-rose-700 leading-relaxed">
                          Mohon maaf, berdasarkan hasil evaluasi dan verifikasi dokumen/lapangan oleh komite TJSL PT Pertamina Patra Niaga, usulan proposal ini belum dapat ditindaklanjuti ke tahap berikutnya.
                        </p>
                      </div>
                    </div>

                    {/* Alasan Penolakan */}
                    <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                        Alasan Penolakan / Catatan Evaluator:
                      </span>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {result.alasan_tolak || 'Proposal belum memenuhi kriteria prioritas pilar TJSL atau kuota program untuk periode ini telah terpenuhi.'}
                      </p>
                    </div>

                    <div className="text-[11px] text-rose-700 leading-relaxed flex items-center gap-1.5">
                      <Info size={14} className="shrink-0" />
                      <span>
                        Sesuai ketentuan, timeline dan proses lanjutan tidak dapat diteruskan untuk pengajuan yang telah berstatus ditolak.
                      </span>
                    </div>
                  </div>
                ) : (
                  /* KONDISI A: JIKA PENGAJUAN DITERIMA / SEDANG DIPROSES -> TIMELINE PROGRESS STEPPER */
                  <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                        <ShieldCheck size={14} className="text-[#00529C]" />
                        <span>Alur Resmi Proses Penyaluran</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900">
                        Tahapan Perkembangan Proposal
                      </h3>
                      <p className="text-xs text-slate-500">
                        Berikut adalah tahapan progres pelaksanaan program bantuan TJSL secara real-time.
                      </p>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                      {result.tahapan && result.tahapan.map((tahap, idx) => {
                        const isDone = tahap.status === 'completed';
                        const isCurrent = tahap.status === 'in_progress';
                        const isPending = tahap.status === 'pending';

                        return (
                          <div key={idx} className="relative group">
                            {/* Marker Node Bulat */}
                            <div
                              className={`absolute -left-6 md:-left-8 top-0.5 w-6 md:w-8 h-6 md:h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                  : isCurrent
                                  ? 'bg-amber-400 border-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                                  : 'bg-white border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 size={16} />
                              ) : isCurrent ? (
                                <Clock size={15} />
                              ) : (
                                <span>{tahap.step || idx + 1}</span>
                              )}
                            </div>

                            {/* Konten Tahapan */}
                            <div
                              className={`p-4 md:p-5 rounded-xl border transition-all ${
                                isCurrent
                                  ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                                  : isDone
                                  ? 'bg-white border-slate-200/90'
                                  : 'bg-slate-50/70 border-dashed border-slate-200 opacity-75'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Tahap {tahap.step || idx + 1}
                                  </span>
                                  {isDone && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Selesai
                                    </span>
                                  )}
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                                      Sedang Berlangsung
                                    </span>
                                  )}
                                  {isPending && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600">
                                      Belum Dimulai
                                    </span>
                                  )}
                                </div>

                                {tahap.tanggal && (
                                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                                    <Calendar size={13} className="text-[#00529C]" />
                                    <span>{tahap.tanggal}</span>
                                  </div>
                                )}
                              </div>

                              <h4 className="text-base font-bold text-slate-900">
                                {tahap.judul}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                                {tahap.deskripsi}
                              </p>

                              {tahap.catatan && (
                                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-700 flex items-start gap-2 bg-white/70 p-2.5 rounded-lg">
                                  <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-semibold text-slate-800">Keterangan: </strong>
                                    <span>{tahap.catatan}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* KONDISI AWAL (BELUM MENCARI): TAMPILAN EDUKASI CARA LACAK */
              <div className="p-8 md:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#00529C] flex items-center justify-center mx-auto shadow-inner">
                  <Search size={32} />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Masukkan Nomor Surat Pengajuan
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Silakan ketik nomor surat pengajuan proposal Anda pada form pencarian di sebelah kiri untuk melihat perkembangan tahapan verifikasi dan penyaluran bantuan secara langsung.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2 text-left text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#00529C] block mb-1">1. Masukkan Nomor</span>
                    <span className="text-slate-500 text-[11px]">Ketik nomor surat resmi proposal bantuan Anda.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#00529C] block mb-1">2. Klik Cek Status</span>
                    <span className="text-slate-500 text-[11px]">Sistem akan memverifikasi data di database TJSL.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#00529C] block mb-1">3. Pantau Progres</span>
                    <span className="text-slate-500 text-[11px]">Lihat tahapan timeline atau status persetujuan.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DetailLayout>

        {/* 6. PUBLIKASI & LIPUTAN TJSL: DIPINDAHKAN KE PALING BAWAH HALAMAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 mt-12">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              Kabar &amp; Dokumentasi Kegiatan
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Publikasi &amp; Liputan TJSL
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Dokumentasi pelaksanaan kegiatan penyaluran bantuan dan dampak nyata program pemberdayaan masyarakat bersama Pertamina Patra Niaga.
            </p>
          </div>

          <SidebarArticlesWidget
            headerTitle="Publikasi & Liputan TJSL Terbaru"
            items={articles}
          />
        </section>
      </main>

      {/* 4. Footer Portal */}
      <Footer />
    </div>
  );
}

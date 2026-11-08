import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { getFullImageUrl } from '../../utils/imageUrl';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

export default function Tour360ViewerPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [wilayah, setWilayah] = useState(null);
  const [activeScene, setActiveScene] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Modal Pop-up State
  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    hotspot: null,
  });

  const viewerContainerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  // 1. Muat data paket Virtual Tour 360 dari backend API
  useEffect(() => {
    async function fetchTour() {
      setLoading(true);
      try {
        let tourSlug = slug;
        // Jika tanpa slug di URL, ambil daftar wilayah dulu dan pilih yang pertama
        if (!tourSlug) {
          const listRes = await apiClient.get('/tour-360');
          if (listRes.data?.success && listRes.data.data?.length > 0) {
            tourSlug = listRes.data.data[0].slug;
          }
        }

        if (!tourSlug) {
          setLoading(false);
          return;
        }

        const res = await apiClient.get(`/tour-360/${tourSlug}`);
        if (res.data?.success && res.data.data) {
          const wData = res.data.data;
          setWilayah(wData);
          setScenes(wData.scenes || []);

          // Cari scene awal (initial scene atau scene pertama)
          const initial =
            (wData.scenes || []).find((s) => s.id === wData.initial_scene_id) ||
            wData.scenes?.[0] ||
            null;
          setActiveScene(initial);
        }
      } catch (err) {
        console.error('Gagal memuat paket tour 360:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTour();
  }, [slug]);

  // 2. Inisialisasi & Sinkronisasi Pannellum Viewer
  useEffect(() => {
    if (!activeScene || !viewerContainerRef.current || !window.pannellum) return;

    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Pannellum destroy error:', e);
      }
      viewerInstanceRef.current = null;
    }

    const panoramaUrl = getFullImageUrl(activeScene.foto_panorama) || 'https://pannellum.org/images/alma.jpg';

    // Format hotspots untuk pengunjung publik
    const formattedHotSpots = (activeScene.hotspots || []).map((h) => {
      let iconClass = 'custom-hotspot-nav';
      if (h.tipe === 'popup_only') iconClass = 'custom-hotspot-info';
      if (h.tipe === 'popup_then_move') iconClass = 'custom-hotspot-preview';

      return {
        id: `pub-hs-${h.id}`,
        pitch: h.pitch,
        yaw: h.yaw,
        cssClass: iconClass,
        createTooltipFunc: (hotSpotDiv) => {
          hotSpotDiv.classList.add('cursor-pointer');
          const title = h.judul_hotspot || (h.target_scene ? h.target_scene.nama_scene : 'Jelajahi Titik');
          hotSpotDiv.setAttribute('title', title);
        },
        clickHandlerFunc: () => {
          handleHotspotTrigger(h);
        },
      };
    });

    try {
      const viewer = window.pannellum.viewer(viewerContainerRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        pitch: activeScene.default_pitch || 0,
        yaw: activeScene.default_yaw || 0,
        hfov: activeScene.default_hfov || 100,
        autoLoad: true,
        showZoomCtrl: true,
        showFullscreenCtrl: false, // Kami gunakan tombol fullscreen custom di header
        mouseZoom: true,
        compass: false,
        hotSpots: formattedHotSpots,
      });

      viewerInstanceRef.current = viewer;
    } catch (err) {
      console.error('Error saat inisialisasi Pannellum publik:', err);
    }

    return () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [activeScene]);

  // 3. Tangani Interaksi Hotspot Berdasarkan 3 Mode Aksi
  const handleHotspotTrigger = (hotspot) => {
    // MODE 1: Langsung Berpindah (Navigasi Jalan Instan)
    if (hotspot.tipe === 'direct' && hotspot.target_scene_id) {
      transitionToScene(hotspot.target_scene_id, hotspot.target_pitch, hotspot.target_yaw);
      return;
    }

    // MODE 2 & MODE 3: Membuka Pop-up Interaktif
    setPopupModal({
      isOpen: true,
      hotspot: hotspot,
    });
  };

  // 4. Transisi Halus Masuk ke Scene Baru
  const transitionToScene = (targetSceneId, targetPitch = null, targetYaw = null) => {
    const target = scenes.find((s) => s.id === parseInt(targetSceneId));
    if (!target) return;

    setPopupModal({ isOpen: false, hotspot: null });
    setActiveScene({
      ...target,
      default_pitch: targetPitch !== null ? targetPitch : target.default_pitch,
      default_yaw: targetYaw !== null ? targetYaw : target.default_yaw,
    });
  };

  // Toggle Fullscreen Layar Penuh
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4 font-['Montserrat',sans-serif]">
        <div className="w-12 h-12 border-4 border-[#00529C] border-t-transparent rounded-full animate-spin"></div>
        <div className="flex flex-col items-center">
          <span className="text-base font-bold tracking-wide">Memuat Virtual Tour 360...</span>
          <span className="text-xs text-slate-400 mt-1">Menyiapkan panorama lingkungan dan titik pemetaan</span>
        </div>
      </div>
    );
  }

  if (!wilayah || scenes.length === 0) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center font-['Montserrat',sans-serif]">
        <span className="material-symbols-outlined text-[64px] text-slate-600 mb-3">travel_explore</span>
        <h2 className="text-xl font-bold mb-2">Virtual Tour Belum Tersedia</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Kawasan binaan ini belum memiliki titik panorama 360 derajat yang dipublikasikan.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-slate-950 overflow-hidden font-['Montserrat',sans-serif] select-none">
      {/* 1. TOP FLOATING NAVBAR */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tombol Kembali */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/80 shadow-lg transition active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Kembali ke Beranda</span>
            </Link>

            {/* Identitas Kawasan Binaan */}
            <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {wilayah.nama_wilayah}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] text-slate-300">Live 360°</span>
              </div>
              <span className="text-sm font-bold text-white leading-tight mt-0.5">
                {activeScene?.nama_scene}
              </span>
            </div>
          </div>

          {/* Action Tools Kanan */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Toggle Drawer Galeri Titik */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={`p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition active:scale-95 ${
                drawerOpen
                  ? 'bg-[#00529C] text-white border-blue-400'
                  : 'bg-slate-900/85 text-slate-300 border-slate-700/80 hover:text-white'
              }`}
              title="Galeri Titik Jelajah"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/80 shadow-lg transition active:scale-95"
              title="Layar Penuh"
            >
              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. KANVAS UTAMA PANNELLUM VIEWER */}
      <div
        ref={viewerContainerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 3. FLOATING PETUNJUK INTERAKSI (Bawah Kiri) */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white text-xs pointer-events-none shadow-md">
        <span className="material-symbols-outlined text-[16px] text-amber-400">pan_tool</span>
        <span className="text-slate-300">Geser untuk memutar 360° | Klik ikon untuk berpindah atau melihat info</span>
      </div>

      {/* 4. BOTTOM TRAY SCENE DRAWER (Galeri Titik Jelajah) */}
      {drawerOpen && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-20 sm:max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">explore</span>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Jelajahi Titik Lokasi ({scenes.length})
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pt-2.5 pb-1">
            {scenes.map((s) => {
              const isCurrent = s.id === activeScene?.id;
              return (
                <button
                  key={s.id}
                  onClick={() => transitionToScene(s.id)}
                  className={`flex-shrink-0 flex items-center gap-2.5 p-1.5 rounded-xl border text-left transition ${
                    isCurrent
                      ? 'border-[#00529C] bg-[#00529C]/30 ring-2 ring-[#00529C]/60 text-white'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={getFullImageUrl(s.foto_panorama)}
                      alt={s.nama_scene}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://pannellum.org/images/alma.jpg';
                      }}
                    />
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold truncate max-w-[130px]">
                      {s.nama_scene}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {s.id === wilayah.initial_scene_id ? '⭐ Titik Awal' : `Titik #${s.urutan}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. POP-UP MODAL INTERAKTIF (Untuk Mode 2 & Mode 3) */}
      {popupModal.isOpen && popupModal.hotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Header Modal dengan Logo Pertamina & Tag */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00529C]"></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {popupModal.hotspot.tipe === 'popup_then_move' ? 'Navigasi Area Jelajah' : 'Informasi Binaan CSR'}
                </span>
              </div>
              <button
                onClick={() => setPopupModal({ isOpen: false, hotspot: null })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body Pop-up */}
            <div className="p-6 flex flex-col gap-4">
              {/* Gambar / Cover (Jika terhubung ke program atau foto scene target) */}
              {popupModal.hotspot.program?.gambar_cover ? (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img
                    src={getFullImageUrl(popupModal.hotspot.program.gambar_cover)}
                    alt={popupModal.hotspot.program.nama_program}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : popupModal.hotspot.target_scene?.foto_panorama ? (
                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
                  <img
                    src={getFullImageUrl(popupModal.hotspot.target_scene.foto_panorama)}
                    alt={popupModal.hotspot.target_scene.nama_scene}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Preview Lokasi Tujuan</span>
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Judul & Deskripsi */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {popupModal.hotspot.judul_hotspot || popupModal.hotspot.program?.nama_program || 'Informasi Lokasi'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line">
                  {popupModal.hotspot.deskripsi_hotspot || popupModal.hotspot.program?.ringkasan || 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPopupModal({ isOpen: false, hotspot: null })}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  Tetap di Sini
                </button>

                {/* Tombol Aksi Sesuai Mode */}
                {popupModal.hotspot.tipe === 'popup_then_move' && popupModal.hotspot.target_scene_id ? (
                  <button
                    type="button"
                    onClick={() =>
                      transitionToScene(
                        popupModal.hotspot.target_scene_id,
                        popupModal.hotspot.target_pitch,
                        popupModal.hotspot.target_yaw
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>{popupModal.hotspot.teks_tombol || 'Masuk ke Area Ini ➔'}</span>
                  </button>
                ) : popupModal.hotspot.program?.slug ? (
                  <Link
                    to={`/program/${popupModal.hotspot.program.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>{popupModal.hotspot.teks_tombol || 'Buka Profil Program'}</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


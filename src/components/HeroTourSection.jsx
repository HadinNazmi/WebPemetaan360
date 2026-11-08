import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { getFullImageUrl } from '../utils/imageUrl';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

export default function HeroTourSection() {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);

  const viewerContainerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  // 1. Ambil data konfigurasi Panorama Hero 360 dari backend
  useEffect(() => {
    async function loadHeroConfig() {
      try {
        const res = await apiClient.get('/tour-360-hero');
        if (res.data?.success && res.data.data) {
          setHeroData(res.data.data);
        }
      } catch (err) {
        console.error('Gagal memuat konfigurasi hero 360:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHeroConfig();
  }, []);

  // 2. Inisialisasi Pannellum Viewer di Hero Beranda
  useEffect(() => {
    if (!heroData || !viewerContainerRef.current || !window.pannellum) return;

    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Destroy error:', e);
      }
      viewerInstanceRef.current = null;
    }

    const panoramaUrl =
      getFullImageUrl(heroData.foto_panorama) || 'https://pannellum.org/images/alma.jpg';

    // Format Pin-Pin Kawasan Binaan di Foto Udara Kilang
    const formattedHotSpots = (heroData.pins || []).map((pin) => {
      return {
        id: `hero-pin-${pin.id || pin.wilayah_id}`,
        pitch: pin.pitch,
        yaw: pin.yaw,
        cssClass: 'custom-hero-region-pin',
        createTooltipFunc: (hotSpotDiv) => {
          hotSpotDiv.classList.add('cursor-pointer');
          hotSpotDiv.setAttribute('title', `📍 ${pin.label || 'Kawasan Binaan CSR'}`);
        },
        clickHandlerFunc: () => {
          setSelectedPin(pin);
        },
      };
    });

    try {
      const viewer = window.pannellum.viewer(viewerContainerRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        pitch: heroData.default_pitch || -8.0,
        yaw: heroData.default_yaw || 0.0,
        hfov: heroData.default_hfov || 100.0,
        autoRotate: isRotating ? (heroData.auto_rotate_speed ?? -1.2) : 0,
        autoLoad: true,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        mouseZoom: false, // Jangan hijack scroll wheel halaman beranda
        draggable: true,
        hotSpots: formattedHotSpots,
      });

      viewerInstanceRef.current = viewer;
    } catch (err) {
      console.error('Error inisialisasi Hero Pannellum:', err);
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
  }, [heroData, isRotating]);

  // Toggle Auto Rotate
  const toggleAutoRotate = () => {
    if (!viewerInstanceRef.current) return;
    if (isRotating) {
      viewerInstanceRef.current.stopAutoRotate();
      setIsRotating(false);
    } else {
      const speed = heroData?.auto_rotate_speed || -1.2;
      viewerInstanceRef.current.startAutoRotate(speed);
      setIsRotating(true);
    }
  };

  // Toggle Fullscreen Layar Penuh
  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-[88vh] min-h-[580px] md:h-screen bg-slate-950 overflow-hidden font-['Montserrat',sans-serif]">
      {/* Wadah Kanvas 360 Derajat Kilang (Plong 100% Full) */}
      <div
        ref={viewerContainerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Kontrol Ambience Atas (Badge Aerial View Kilang) */}
      <div className="absolute top-24 left-6 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-slate-700/60 shadow-xl text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
              Pertamina Patra Niaga
            </span>
            <span className="text-xs font-extrabold text-white">
              {heroData?.judul || 'Aerial 360° Kilang Dumai'}
            </span>
          </div>
        </div>
      </div>

      {/* Petunjuk Interaksi Bawah Kiri */}
      <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs pointer-events-none shadow-md">
        <span className="material-symbols-outlined text-[16px] text-amber-400">touch_app</span>
        <span>Geser mouse untuk melihat sekeliling | Klik pin lokasi untuk masuk ke kawasan binaan</span>
      </div>

      {/* Kontrol Tools Minimalis Bawah Kanan */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        {/* Tombol Auto Rotate */}
        <button
          onClick={toggleAutoRotate}
          className={`px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 transition shadow-lg ${
            isRotating
              ? 'bg-[#00529C] text-white border-blue-400'
              : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Putar Kamera Otomatis"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRotating ? 'sync' : 'sync_disabled'}
          </span>
          <span className="hidden md:inline">{isRotating ? 'Putar Aktif' : 'Putar Jeda'}</span>
        </button>

        {/* Tombol Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700 shadow-lg transition"
          title="Layar Penuh"
        >
          <span className="material-symbols-outlined text-[18px]">fullscreen</span>
        </button>
      </div>

      {/* MODAL POP-UP KETIKA PIN DAERAH DIKLIK DI FOTO UDARA */}
      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95 duration-200">
            {/* Foto Cover Wilayah */}
            {selectedPin.wilayah?.gambar_cover && (
              <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                <img
                  src={getFullImageUrl(selectedPin.wilayah.gambar_cover)}
                  alt={selectedPin.wilayah.nama_wilayah}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#00529C] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>Kawasan Binaan CSR</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedPin.label || selectedPin.wilayah?.nama_wilayah}
                </h3>
                {selectedPin.wilayah?.deskripsi && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {selectedPin.wilayah.deskripsi}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPin(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
                >
                  Tutup
                </button>

                {selectedPin.wilayah?.slug && (
                  <Link
                    to={`/tour-360/${selectedPin.wilayah.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-bold shadow-sm transition"
                  >
                    <span>Masuk Jelajahi Kawasan ➔</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

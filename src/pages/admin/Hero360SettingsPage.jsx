import React, { useEffect, useRef, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';
import AdminImagePicker from '../../components/admin/AdminImagePicker';
import { getFullImageUrl } from '../../utils/imageUrl';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

export default function Hero360SettingsPage() {
  const [heroSettings, setHeroSettings] = useState(null);
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Viewer state
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentYaw, setCurrentYaw] = useState(0);
  const [addPinMode, setAddPinMode] = useState(false);

  // Pin Modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [selectedPinCoords, setSelectedPinCoords] = useState({ pitch: 0, yaw: 0 });
  const [pinForm, setPinForm] = useState({
    wilayah_id: '',
    label: '',
  });

  const viewerContainerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  // 1. Muat data konfigurasi hero dan daftar wilayah
  const loadData = async () => {
    setLoading(true);
    try {
      const [hRes, wRes] = await Promise.all([
        adminService.getHero360Settings(),
        adminService.getTourWilayahList(),
      ]);

      if (hRes?.success && hRes.data) {
        setHeroSettings(hRes.data);
        setCurrentPitch(hRes.data.default_pitch || 0);
        setCurrentYaw(hRes.data.default_yaw || 0);
      }
      if (wRes?.success && wRes.data) {
        setWilayahList(wRes.data);
      }
    } catch (err) {
      console.error('Gagal memuat pengaturan hero 360:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Inisialisasi Pannellum Editor Live
  useEffect(() => {
    if (!heroSettings || !viewerContainerRef.current || !window.pannellum) return;

    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.destroy();
      } catch (e) {
        // ignore
      }
      viewerInstanceRef.current = null;
    }

    const panoramaUrl =
      getFullImageUrl(heroSettings.foto_panorama) || 'https://pannellum.org/images/alma.jpg';

    // Format Hotspots Pin Wilayah
    const formattedHotSpots = (heroSettings.pins || []).map((pin) => {
      const matchedW = wilayahList.find((w) => w.id === parseInt(pin.wilayah_id));
      const label = pin.label || matchedW?.nama_wilayah || 'Kawasan Binaan';

      return {
        id: `admin-pin-${pin.id || pin.wilayah_id}`,
        pitch: pin.pitch,
        yaw: pin.yaw,
        cssClass: 'custom-hero-region-pin',
        createTooltipFunc: (hotSpotDiv) => {
          hotSpotDiv.classList.add('cursor-pointer');
          hotSpotDiv.setAttribute('title', `📍 ${label} (Klik untuk hapus)`);
        },
        clickHandlerFunc: () => {
          handleDeletePin(pin.id || pin.wilayah_id, label);
        },
      };
    });

    try {
      const viewer = window.pannellum.viewer(viewerContainerRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        pitch: heroSettings.default_pitch || 0,
        yaw: heroSettings.default_yaw || 0,
        hfov: heroSettings.default_hfov || 100,
        autoLoad: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        mouseZoom: true,
        hotSpots: formattedHotSpots,
      });

      viewer.on('animatefinished', () => {
        setCurrentPitch(Math.round(viewer.getPitch() * 10) / 10);
        setCurrentYaw(Math.round(viewer.getYaw() * 10) / 10);
      });

      viewerInstanceRef.current = viewer;
    } catch (err) {
      console.error('Pannellum error:', err);
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
  }, [heroSettings?.foto_panorama, heroSettings?.pins, wilayahList]);

  // Tangkap klik di kanvas untuk tancapkan pin
  const handleCanvasClick = (e) => {
    if (!addPinMode || !viewerInstanceRef.current) return;

    const coords = viewerInstanceRef.current.mouseEventToCoords(e.nativeEvent);
    if (!coords || coords.length < 2) return;

    const [pitch, yaw] = coords;
    const roundedPitch = Math.round(pitch * 10) / 10;
    const roundedYaw = Math.round(yaw * 10) / 10;

    setSelectedPinCoords({ pitch: roundedPitch, yaw: roundedYaw });

    const defaultWilayah = wilayahList[0];
    setPinForm({
      wilayah_id: defaultWilayah ? defaultWilayah.id : '',
      label: defaultWilayah ? `Kawasan Binaan ${defaultWilayah.nama_wilayah}` : '',
    });

    setPinModalOpen(true);
    setAddPinMode(false);
  };

  // Simpan Pin Baru ke Array
  const handleSavePin = (e) => {
    e.preventDefault();
    if (!pinForm.wilayah_id) {
      alert('Pilih kawasan binaan terlebih dahulu.');
      return;
    }

    const newPin = {
      id: `pin-${Date.now()}`,
      wilayah_id: parseInt(pinForm.wilayah_id),
      pitch: selectedPinCoords.pitch,
      yaw: selectedPinCoords.yaw,
      label: pinForm.label,
    };

    const updatedPins = [...(heroSettings.pins || []), newPin];
    setHeroSettings({ ...heroSettings, pins: updatedPins });
    setPinModalOpen(false);
  };

  // Hapus Pin
  const handleDeletePin = (pinId, label) => {
    if (!window.confirm(`Hapus pin "${label}" dari foto udara kilang ini?`)) return;
    const updatedPins = (heroSettings.pins || []).filter((p) => (p.id || p.wilayah_id) !== pinId);
    setHeroSettings({ ...heroSettings, pins: updatedPins });
  };

  // Set sudut kamera saat ini sebagai default view beranda
  const handleCaptureCurrentView = () => {
    if (!viewerInstanceRef.current) return;
    const p = Math.round(viewerInstanceRef.current.getPitch() * 10) / 10;
    const y = Math.round(viewerInstanceRef.current.getYaw() * 10) / 10;
    const h = Math.round(viewerInstanceRef.current.getHfov() * 10) / 10;

    setHeroSettings({
      ...heroSettings,
      default_pitch: p,
      default_yaw: y,
      default_hfov: h,
    });
    alert(`Sudut pandang tersimpan: Pitch ${p}° | Yaw ${y}° | Zoom FOV ${h}°`);
  };

  // Simpan seluruh konfigurasi ke database
  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await adminService.updateHero360Settings(heroSettings);
      setMessage({ type: 'success', text: 'Pengaturan Panorama Hero 360 berhasil disimpan ke database!' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + (err.response?.data?.message || err.message) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
        <span className="text-sm">Memuat pengaturan hero 360...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Panorama Hero Beranda (Aerial Kilang 360°)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Atur foto 360 derajat kilang dari udara yang tampil langsung di halaman utama beranda tanpa penutup teks
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Hero'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. Form Pengaturan Foto & Rotasi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#00529C]">tune</span>
          <span>1. Foto Panorama 360 &amp; Konfigurasi Rotasi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Judul Panorama Beranda
            </label>
            <input
              type="text"
              required
              value={heroSettings?.judul || ''}
              onChange={(e) => setHeroSettings({ ...heroSettings, judul: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-[#00529C]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kecepatan Putar Otomatis (Auto-Rotate)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.2"
                value={heroSettings?.auto_rotate_speed ?? -1.2}
                onChange={(e) =>
                  setHeroSettings({ ...heroSettings, auto_rotate_speed: parseFloat(e.target.value) || 0 })
                }
                className="w-28 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-mono"
              />
              <span className="text-[11px] text-slate-500">
                Nilai negatif (-1.2) = putar ke kanan. 0 = diam tanpa putar otomatis.
              </span>
            </div>
          </div>
        </div>

        {/* Upload Foto Panorama 360 Udara */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Foto 360 Udara / Drone Kilang (Equirectangular 2:1) *
          </label>
          <AdminImagePicker
            value={heroSettings?.foto_panorama || ''}
            onChange={(url) => setHeroSettings({ ...heroSettings, foto_panorama: url })}
            folder="tour360/hero"
            helperText="Upload foto panorama bulat 360 derajat kilang dari udara/drone. Standar JPG/PNG rasio 2:1."
          />
        </div>
      </div>

      {/* 3. Live Viewer & Tancap Pin Wilayah */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00529C]">explore</span>
              <span>2. Visual Editor &amp; Tancapkan Pin Kawasan Binaan</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik pada daratan di foto udara untuk menancapkan pin yang mengarah ke daerah binaan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCaptureCurrentView}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Ambil posisi kamera saat ini sebagai sudut buka pertama kali di beranda"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span>Kunci Sudut Ini Sebagai Default</span>
            </button>

            <button
              type="button"
              onClick={() => setAddPinMode(!addPinMode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                addPinMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                  : 'bg-[#00529C] hover:bg-[#003B73] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {addPinMode ? 'ads_click' : 'add_location'}
              </span>
              <span>{addPinMode ? 'Klik Layar Foto!' : '+ Tancapkan Pin Wilayah'}</span>
            </button>
          </div>
        </div>

        {/* Wadah Pannellum */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-inner">
          {addPinMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg animate-bounce flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Klik pada lokasi daratan kawasan binaan di foto udara!</span>
            </div>
          )}

          <div
            ref={viewerContainerRef}
            onClick={handleCanvasClick}
            className={`w-full h-[55vh] min-h-[420px] ${addPinMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
          />

          <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-xl bg-slate-950/80 text-white text-xs font-mono border border-slate-700">
            Pitch: {currentPitch}° | Yaw: {currentYaw}°
          </div>
        </div>

        {/* Daftar Pin Wilayah yang Menempel */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Pin Daerah yang Menempel di Foto Udara ({(heroSettings?.pins || []).length}):
          </span>

          {(heroSettings?.pins || []).length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Belum ada pin daerah binaan yang ditancapkan. Klik tombol "+ Tancapkan Pin Wilayah" di atas untuk menambahkan.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {(heroSettings?.pins || []).map((pin) => {
                const matchedW = wilayahList.find((w) => w.id === parseInt(pin.wilayah_id));
                const label = pin.label || matchedW?.nama_wilayah || 'Kawasan Binaan';
                return (
                  <div
                    key={pin.id || pin.wilayah_id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (P:{pin.pitch}°, Y:{pin.yaw}°)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeletePin(pin.id || pin.wilayah_id, label)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Hapus Pin"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Modal Tancapkan Pin Wilayah Baru */}
      <AdminModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Tancapkan Pin Kawasan Binaan di Foto Udara"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSavePin} className="flex flex-col gap-4 text-sm font-medium">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#00529C] font-mono">
            Koordinat Titik: Pitch {selectedPinCoords.pitch}° / Yaw {selectedPinCoords.yaw}°
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Kawasan Binaan CSR *
            </label>
            <select
              required
              value={pinForm.wilayah_id}
              onChange={(e) => {
                const wId = e.target.value;
                const matched = wilayahList.find((w) => w.id === parseInt(wId));
                setPinForm({
                  ...pinForm,
                  wilayah_id: wId,
                  label: matched ? `Kawasan Binaan ${matched.nama_wilayah}` : pinForm.label,
                });
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-[#00529C]/20"
            >
              <option value="">-- Pilih Wilayah Binaan --</option>
              {wilayahList.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nama_wilayah} ({w.lokasi_koordinat || 'Dumai'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Label Penanda Pin *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kawasan Binaan Mundam Jaya"
              value={pinForm.label}
              onChange={(e) => setPinForm({ ...pinForm, label: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-[#00529C]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPinModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold"
            >
              Pasang Pin Ini
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


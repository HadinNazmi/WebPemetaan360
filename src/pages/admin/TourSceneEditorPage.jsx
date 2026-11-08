import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { programService } from '../../services/programService';
import AdminModal from '../../components/admin/AdminModal';
import { getFullImageUrl } from '../../utils/imageUrl';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

export default function TourSceneEditorPage() {
  const { wilayahId, sceneId } = useParams();
  const navigate = useNavigate();

  const [wilayah, setWilayah] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [allScenes, setAllScenes] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [addMode, setAddMode] = useState(false);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentYaw, setCurrentYaw] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({ pitch: 0, yaw: 0 });
  const [editingHotspot, setEditingHotspot] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formState, setFormState] = useState({
    tipe: 'direct', // 'direct' | 'popup_only' | 'popup_then_move'
    target_scene_id: '',
    program_id: '',
    judul_hotspot: '',
    deskripsi_hotspot: '',
    teks_tombol: 'Masuk ke Area Ini ➔',
    ikon_hotspot: 'arrow',
    auto_reverse: true,
  });

  const viewerContainerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  // 1. Muat data Scene, Wilayah, & Program CSR
  const loadData = async () => {
    setLoading(true);
    try {
      const [wRes, sRes, sceneDetailRes, progRes] = await Promise.all([
        adminService.getTourWilayah(wilayahId),
        adminService.getTourScenes(wilayahId),
        adminService.getTourScene(sceneId),
        programService.getShowcasePrograms(),
      ]);

      if (wRes?.success) setWilayah(wRes.data);
      if (sRes?.success) setAllScenes(sRes.data);
      if (sceneDetailRes?.success) {
        setCurrentScene(sceneDetailRes.data);
        setHotspots(sceneDetailRes.data.hotspots || []);
      }
      if (progRes?.success) setProgramsList(progRes.data || []);
    } catch (err) {
      console.error('Gagal memuat editor scene:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [wilayahId, sceneId]);

  // 2. Inisialisasi / Perbarui Pannellum Viewer
  useEffect(() => {
    if (!currentScene || !viewerContainerRef.current || !window.pannellum) return;

    // Hancurkan instance lama jika ada
    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Pannellum destroy error:', e);
      }
      viewerInstanceRef.current = null;
    }

    const panoramaUrl = getFullImageUrl(currentScene.foto_panorama) || 'https://pannellum.org/images/alma.jpg';

    // Format hotspots untuk Pannellum
    const formattedHotSpots = hotspots.map((h) => {
      let iconClass = 'custom-hotspot-nav';
      if (h.tipe === 'popup_only') iconClass = 'custom-hotspot-info';
      if (h.tipe === 'popup_then_move') iconClass = 'custom-hotspot-preview';

      return {
        id: `hs-${h.id}`,
        pitch: h.pitch,
        yaw: h.yaw,
        cssClass: iconClass,
        createTooltipFunc: (hotSpotDiv) => {
          hotSpotDiv.classList.add('cursor-pointer');
          const title = h.judul_hotspot || (h.target_scene ? h.target_scene.nama_scene : 'Titik Interaktif');
          hotSpotDiv.setAttribute('title', `${title} (Klik untuk kelola)`);
        },
        clickHandlerFunc: () => {
          handleHotspotClick(h);
        },
      };
    });

    try {
      const viewer = window.pannellum.viewer(viewerContainerRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        pitch: currentScene.default_pitch || 0,
        yaw: currentScene.default_yaw || 0,
        hfov: currentScene.default_hfov || 100,
        autoLoad: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        mouseZoom: true,
        hotSpots: formattedHotSpots,
      });

      // Listener perubahan sudut saat kamera digeser
      viewer.on('animatefinished', () => {
        setCurrentPitch(Math.round(viewer.getPitch() * 10) / 10);
        setCurrentYaw(Math.round(viewer.getYaw() * 10) / 10);
      });

      viewerInstanceRef.current = viewer;
    } catch (err) {
      console.error('Error saat inisialisasi Pannellum:', err);
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
  }, [currentScene, hotspots]);

  // 3. Tangani Klik pada Kanvas Viewer
  const handleCanvasClick = (e) => {
    if (!addMode || !viewerInstanceRef.current) return;

    // Hitung koordinat pitch & yaw dari posisi klik mouse
    const coords = viewerInstanceRef.current.mouseEventToCoords(e.nativeEvent);
    if (!coords || coords.length < 2) return;

    const [pitch, yaw] = coords;
    const roundedPitch = Math.round(pitch * 10) / 10;
    const roundedYaw = Math.round(yaw * 10) / 10;

    setSelectedCoords({ pitch: roundedPitch, yaw: roundedYaw });
    setEditingHotspot(null);

    // Default form untuk penambahan baru
    const defaultTarget = allScenes.find((s) => s.id !== currentScene.id);
    setFormState({
      tipe: 'direct',
      target_scene_id: defaultTarget ? defaultTarget.id : '',
      program_id: programsList[0]?.id || '',
      judul_hotspot: defaultTarget ? `Menuju ke ${defaultTarget.nama_scene}` : '',
      deskripsi_hotspot: '',
      teks_tombol: 'Masuk ke Area Ini ➔',
      ikon_hotspot: 'arrow',
      auto_reverse: true,
    });

    setModalOpen(true);
    setAddMode(false); // Matikan mode tambah setelah titik tertangkap
  };

  // 4. Klik Hotspot yang sudah ada untuk kelola
  const handleHotspotClick = (hotspot) => {
    setEditingHotspot(hotspot);
    setSelectedCoords({ pitch: hotspot.pitch, yaw: hotspot.yaw });
    setFormState({
      tipe: hotspot.tipe || 'direct',
      target_scene_id: hotspot.target_scene_id || '',
      program_id: hotspot.program_id || '',
      judul_hotspot: hotspot.judul_hotspot || '',
      deskripsi_hotspot: hotspot.deskripsi_hotspot || '',
      teks_tombol: hotspot.teks_tombol || 'Masuk ke Area Ini ➔',
      ikon_hotspot: hotspot.ikon_hotspot || 'arrow',
      auto_reverse: false,
    });
    setModalOpen(true);
  };

  // 5. Simpan Hotspot (Tambah atau Update)
  const handleSubmitHotspot = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        tipe: formState.tipe,
        pitch: selectedCoords.pitch,
        yaw: selectedCoords.yaw,
        target_scene_id: formState.tipe !== 'popup_only' && formState.target_scene_id ? parseInt(formState.target_scene_id) : null,
        program_id: formState.tipe === 'popup_only' && formState.program_id ? parseInt(formState.program_id) : null,
        judul_hotspot: formState.judul_hotspot,
        deskripsi_hotspot: formState.deskripsi_hotspot,
        teks_tombol: formState.teks_tombol,
        ikon_hotspot: formState.ikon_hotspot,
        auto_reverse: formState.auto_reverse,
      };

      if (editingHotspot) {
        await adminService.updateTourHotspot(editingHotspot.id, payload);
      } else {
        await adminService.createTourHotspot(sceneId, payload);
      }

      setModalOpen(false);
      // Muat ulang daftar hotspot untuk scene ini
      const res = await adminService.getTourScene(sceneId);
      if (res?.success && res.data) {
        setHotspots(res.data.hotspots || []);
      }
    } catch (err) {
      alert('Gagal menyimpan titik interaktif: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // 6. Hapus Hotspot
  const handleDeleteHotspot = async () => {
    if (!editingHotspot) return;
    if (!window.confirm('Yakin ingin menghapus titik interaktif ini?')) return;
    try {
      await adminService.deleteTourHotspot(editingHotspot.id);
      setModalOpen(false);
      const res = await adminService.getTourScene(sceneId);
      if (res?.success && res.data) {
        setHotspots(res.data.hotspots || []);
      }
    } catch (err) {
      alert('Gagal menghapus hotspot: ' + err.message);
    }
  };

  // 7. Berpindah langsung ke scene lain di editor (Walkthrough Mode)
  const handleJumpToScene = (targetId) => {
    setModalOpen(false);
    navigate(`/admin/tour-360/${wilayahId}/scenes/${targetId}/editor`);
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* 1. Header Toolbar Editor */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/tour-360/${wilayahId}/scenes`}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Kembali ke Daftar Scene"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#00529C]">
                {wilayah?.nama_wilayah || 'Wilayah'}
              </span>
              <span className="text-slate-300">/</span>
              <h1 className="text-lg font-bold text-slate-900">
                {currentScene?.nama_scene || 'Memuat Scene...'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Putar kamera dan klik pada area yang diinginkan untuk memasang titik interaktif (Hotspot)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Koordinat Live */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
            <span>P: {currentPitch}°</span>
            <span className="text-slate-300">|</span>
            <span>Y: {currentYaw}°</span>
          </div>

          {/* Toggle Tombol Tambah Hotspot */}
          <button
            onClick={() => setAddMode(!addMode)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
              addMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-[#00529C] hover:bg-[#003B73] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {addMode ? 'ads_click' : 'add_location'}
            </span>
            <span>{addMode ? 'Mode Tambah Aktif (Klik Layar!)' : '+ Tambah Titik di Foto'}</span>
          </button>
        </div>
      </div>

      {/* 2. Layar Utama Viewer 360 */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-sm">
        {/* Banner Instruksi saat Add Mode Aktif */}
        {addMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-amber-500/95 text-white text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[18px]">touch_app</span>
            <span>Klik langsung pada jalan atau objek di foto untuk menandai titik!</span>
            <button
              onClick={() => setAddMode(false)}
              className="ml-2 hover:bg-amber-600 p-0.5 rounded-full"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Wadah Pannellum */}
        <div
          ref={viewerContainerRef}
          onClick={handleCanvasClick}
          className={`w-full h-[62vh] min-h-[460px] ${addMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
        />

        {/* Indikator Jumlah Hotspot Terpasang */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-2 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{hotspots.length} Titik Interaktif Terpasang</span>
        </div>
      </div>

      {/* 3. Bottom Filmstrip / Tray Scene (Pindah Scene Cepat) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Galeri Titik Scene di Wilayah Ini ({allScenes.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Klik foto thumbnail untuk berpindah mengedit scene lain
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
          {allScenes.map((s) => {
            const isCurrent = s.id === parseInt(sceneId);
            return (
              <button
                key={s.id}
                onClick={() => handleJumpToScene(s.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 p-1.5 rounded-xl border text-left transition ${
                  isCurrent
                    ? 'border-[#00529C] bg-blue-50/70 ring-2 ring-[#00529C]/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
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
                  <span className={`text-xs font-bold truncate max-w-[140px] ${isCurrent ? 'text-[#00529C]' : 'text-slate-800'}`}>
                    {s.nama_scene}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {s.id === wilayah?.initial_scene_id ? '⭐ Titik Utama' : `Titik #${s.urutan}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Modal Konfigurasi Titik Interaktif (Hotspot) */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHotspot ? 'Kelola Titik Interaktif (Hotspot)' : 'Konfigurasi Titik Interaktif Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmitHotspot} className="flex flex-col gap-4 text-sm font-medium">
          {/* Koordinat Tag Header */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-[#00529C]">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>Posisi Sudut di Foto:</span>
            </span>
            <span className="font-mono font-bold">
              Pitch: {selectedCoords.pitch}° / Yaw: {selectedCoords.yaw}°
            </span>
          </div>

          {/* PILIHAN 3 MODE AKSI */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Aksi Ketika Titik Ini Diklik: *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Mode 1: Langsung Pindah */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  formState.tipe === 'direct'
                    ? 'border-[#00529C] bg-blue-50/50 text-[#00529C] ring-2 ring-[#00529C]/15 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hotspot_tipe"
                    value="direct"
                    checked={formState.tipe === 'direct'}
                    onChange={(e) => setFormState({ ...formState, tipe: e.target.value, ikon_hotspot: 'arrow' })}
                    className="text-[#00529C]"
                  />
                  <span className="text-xs">1. Langsung Jalan</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Klik panah $\rightarrow$ kamera langsung meluncur ke scene tujuan
                </p>
              </label>

              {/* Mode 2: Pop-up Saja */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  formState.tipe === 'popup_only'
                    ? 'border-[#00529C] bg-blue-50/50 text-[#00529C] ring-2 ring-[#00529C]/15 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hotspot_tipe"
                    value="popup_only"
                    checked={formState.tipe === 'popup_only'}
                    onChange={(e) => setFormState({ ...formState, tipe: e.target.value, ikon_hotspot: 'info' })}
                    className="text-[#00529C]"
                  />
                  <span className="text-xs">2. Pop-up Saja</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Tampilkan kartu program CSR atau info. Kamera tidak berpindah
                </p>
              </label>

              {/* Mode 3: Pop-up Dulu Baru Pindah */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  formState.tipe === 'popup_then_move'
                    ? 'border-[#00529C] bg-blue-50/50 text-[#00529C] ring-2 ring-[#00529C]/15 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hotspot_tipe"
                    value="popup_then_move"
                    checked={formState.tipe === 'popup_then_move'}
                    onChange={(e) => setFormState({ ...formState, tipe: e.target.value, ikon_hotspot: 'arrow' })}
                    className="text-[#00529C]"
                  />
                  <span className="text-xs">3. Info Dulu ➔ Jalan</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Tampilkan kartu pengantar area dengan tombol "Masuk ke Area Ini"
                </p>
              </label>
            </div>
          </div>

          {/* FORM SESUAI MODE YANG DIPILIH */}
          {/* A. Pemilihan Scene Tujuan (untuk Mode 1 & Mode 3) */}
          {(formState.tipe === 'direct' || formState.tipe === 'popup_then_move') && (
            <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Foto Scene Tujuan Jalan: *
              </label>
              <select
                required
                value={formState.target_scene_id}
                onChange={(e) => {
                  const targetId = e.target.value;
                  const targetScene = allScenes.find((s) => s.id === parseInt(targetId));
                  setFormState({
                    ...formState,
                    target_scene_id: targetId,
                    judul_hotspot: formState.judul_hotspot || (targetScene ? `Menuju ke ${targetScene.nama_scene}` : ''),
                  });
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20"
              >
                <option value="">-- Pilih Scene Tujuan --</option>
                {allScenes
                  .filter((s) => s.id !== parseInt(sceneId))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_scene} ({s.id === wilayah?.initial_scene_id ? 'Pintu Masuk Utama' : `Titik #${s.urutan}`})
                    </option>
                  ))}
              </select>

              {!editingHotspot && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="auto_reverse_check"
                    checked={formState.auto_reverse}
                    onChange={(e) => setFormState({ ...formState, auto_reverse: e.target.checked })}
                    className="w-4 h-4 rounded text-[#00529C]"
                  />
                  <label htmlFor="auto_reverse_check" className="text-xs text-slate-700 font-medium select-none">
                    Buat titik kembali otomatis di foto tujuan (sehingga pengunjung bisa bolak-balik)
                  </label>
                </div>
              )}
            </div>
          )}

          {/* B. Konten Pop-up Informasi / Program CSR (untuk Mode 2 & Mode 3) */}
          {(formState.tipe === 'popup_only' || formState.tipe === 'popup_then_move') && (
            <div className="flex flex-col gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              {formState.tipe === 'popup_only' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tautkan ke Program CSR (Opsional):
                  </label>
                  <select
                    value={formState.program_id}
                    onChange={(e) => {
                      const progId = e.target.value;
                      const prog = programsList.find((p) => p.id === parseInt(progId));
                      setFormState({
                        ...formState,
                        program_id: progId,
                        judul_hotspot: prog ? prog.judul_program : formState.judul_hotspot,
                        deskripsi_hotspot: prog ? prog.ringkasan : formState.deskripsi_hotspot,
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20"
                  >
                    <option value="">-- Teks Info Umum Bebas (Tanpa Hubungan Program) --</option>
                    {programsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.judul_program} ({p.kategori})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Judul Pop-up *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sentra Pengolahan Minyak Jelantah SiMinah"
                  value={formState.judul_hotspot}
                  onChange={(e) => setFormState({ ...formState, judul_hotspot: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deskripsi / Penjelasan Singkat
                </label>
                <textarea
                  rows="2"
                  placeholder="Keterangan singkat yang muncul saat titik diklik..."
                  value={formState.deskripsi_hotspot}
                  onChange={(e) => setFormState({ ...formState, deskripsi_hotspot: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20"
                />
              </div>

              {formState.tipe === 'popup_then_move' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Label Tombol Masuk
                  </label>
                  <input
                    type="text"
                    value={formState.teks_tombol}
                    onChange={(e) => setFormState({ ...formState, teks_tombol: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {editingHotspot ? (
              <button
                type="button"
                onClick={handleDeleteHotspot}
                className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Hapus Titik Ini</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : editingHotspot ? 'Perbarui Titik' : 'Simpan Titik Hotspot'}
              </button>
            </div>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

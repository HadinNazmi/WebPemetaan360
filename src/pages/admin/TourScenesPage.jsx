import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';
import AdminImagePicker from '../../components/admin/AdminImagePicker';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function TourScenesPage() {
  const { wilayahId } = useParams();
  const [wilayah, setWilayah] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    nama_scene: '',
    slug: '',
    foto_panorama: '',
    default_pitch: 0.0,
    default_yaw: 0.0,
    default_hfov: 100.0,
    urutan: 1,
    is_active: true,
    set_as_initial: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [wRes, sRes] = await Promise.all([
        adminService.getTourWilayah(wilayahId),
        adminService.getTourScenes(wilayahId),
      ]);

      if (wRes?.success && wRes.data) {
        setWilayah(wRes.data);
      }
      if (sRes?.success && sRes.data) {
        setScenes(sRes.data);
      }
    } catch (err) {
      console.error('Gagal memuat data scene wilayah:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [wilayahId]);

  const openCreateModal = () => {
    setEditingScene(null);
    setFormState({
      nama_scene: '',
      slug: '',
      foto_panorama: 'https://pannellum.org/images/alma.jpg',
      default_pitch: 0.0,
      default_yaw: 0.0,
      default_hfov: 100.0,
      urutan: scenes.length + 1,
      is_active: true,
      set_as_initial: scenes.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingScene(item);
    setFormState({
      nama_scene: item.nama_scene || '',
      slug: item.slug || '',
      foto_panorama: item.foto_panorama || '',
      default_pitch: item.default_pitch ?? 0.0,
      default_yaw: item.default_yaw ?? 0.0,
      default_hfov: item.default_hfov ?? 100.0,
      urutan: item.urutan || 1,
      is_active: Boolean(item.is_active),
      set_as_initial: wilayah?.initial_scene_id === item.id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Hapus titik scene "${nama}" beserta seluruh hotspot di dalamnya?`)) {
      return;
    }
    try {
      await adminService.deleteTourScene(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus scene: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSetInitial = async (sceneId) => {
    try {
      await adminService.setInitialTourScene(sceneId);
      loadData();
    } catch (err) {
      alert('Gagal mengatur titik awal: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingScene) {
        await adminService.updateTourScene(editingScene.id, formState);
        if (formState.set_as_initial) {
          await adminService.setInitialTourScene(editingScene.id);
        }
      } else {
        await adminService.createTourScene(wilayahId, formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan scene: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Navigasi Atas & Breadcrumb */}
      <div>
        <Link
          to="/admin/tour-360"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00529C] hover:text-[#003B73] mb-3 transition"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Master Wilayah 360</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Titik Panorama: {wilayah?.nama_wilayah || 'Memuat...'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#00529C] border border-blue-100">
                {scenes.length} Titik Terdaftar
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Kelola foto panorama 360 derajat dan tentukan titik masuk utama kawasan binaan ini
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>Tambah Titik 360 Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Kartu Scene */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
          <span className="text-sm">Memuat titik panorama 360...</span>
        </div>
      ) : scenes.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
          <span className="material-symbols-outlined text-[48px] text-slate-300">panorama_photosphere</span>
          <p className="text-base font-bold text-slate-700 mt-3">Belum ada titik foto 360 di kawasan ini</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol "+ Tambah Titik 360 Baru" di atas untuk mengunggah foto panorama equirectangular pertama Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => {
            const isInitial = wilayah?.initial_scene_id === scene.id;
            return (
              <div
                key={scene.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isInitial ? 'border-[#00529C] ring-2 ring-[#00529C]/10' : 'border-slate-200/80'
                }`}
              >
                {/* Visual Thumbnail Panorama */}
                <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden group">
                  <img
                    src={getFullImageUrl(scene.foto_panorama)}
                    alt={scene.nama_scene}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://pannellum.org/images/alma.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"></div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {isInitial ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span>PINTU MASUK UTAMA</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-white backdrop-blur-xs">
                        Urutan #{scene.urutan}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white backdrop-blur-xs">
                      <span className="material-symbols-outlined text-[13px]">pin_drop</span>
                      <span>{scene.hotspots_count || 0} Hotspot</span>
                    </span>
                  </div>

                  {/* Scene Title in Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base leading-snug drop-shadow-sm">
                      {scene.nama_scene}
                    </h3>
                    <span className="text-[11px] text-slate-300 font-mono mt-0.5 block truncate">
                      {scene.slug}
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Controls */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2.5">
                    <span>Sudut Awal Kamera:</span>
                    <span className="font-mono font-medium text-slate-700">
                      P: {scene.default_pitch}° / Y: {scene.default_yaw}°
                    </span>
                  </div>

                  {/* Primary Action Button: Buka Visual Hotspot Builder */}
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to={`/admin/tour-360/${wilayahId}/scenes/${scene.id}/editor`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-xs transition"
                    >
                      <span className="material-symbols-outlined text-[16px]">touch_app</span>
                      <span>Edit Hotspot Interaktif (Visual)</span>
                    </Link>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {!isInitial ? (
                        <button
                          onClick={() => handleSetInitial(scene.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#00529C] transition py-1 px-2 rounded hover:bg-slate-50"
                        >
                          <span className="material-symbols-outlined text-[15px]">star_border</span>
                          <span>Jadikan Titik Utama</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 py-1 px-2">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          <span>Titik Awal Aktif</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(scene)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#00529C] hover:bg-blue-50 transition"
                          title="Ubah Titik Scene"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(scene.id, scene.nama_scene)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Titik Scene"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Modal Tambah / Ubah Scene 360 */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingScene ? 'Ubah Titik Scene 360' : 'Tambah Titik Panorama 360 Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Titik Lokasi / Scene *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Gerbang Depan Binaan"
                value={formState.nama_scene}
                onChange={(e) => setFormState({ ...formState, nama_scene: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Urutan *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formState.urutan}
                onChange={(e) => setFormState({ ...formState, urutan: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              />
            </div>
          </div>

          {/* Upload Foto Panorama 360 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Foto Panorama 360 (Equirectangular 2:1) *
            </label>
            <AdminImagePicker
              value={formState.foto_panorama}
              onChange={(url) => setFormState({ ...formState, foto_panorama: url })}
              folder="tour360/panoramas"
              helperText="Foto 360 derajat bulat penuh rasio 2:1 (misal 4096x2048 atau 6000x3000 piksel format JPG/PNG)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600">Pitch Sudut Vertikal</label>
              <input
                type="number"
                step="0.5"
                value={formState.default_pitch}
                onChange={(e) => setFormState({ ...formState, default_pitch: parseFloat(e.target.value) || 0.0 })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600">Yaw Sudut Horizontal</label>
              <input
                type="number"
                step="0.5"
                value={formState.default_yaw}
                onChange={(e) => setFormState({ ...formState, default_yaw: parseFloat(e.target.value) || 0.0 })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-600">FOV Zoom Default</label>
              <input
                type="number"
                step="1"
                min="50"
                max="120"
                value={formState.default_hfov}
                onChange={(e) => setFormState({ ...formState, default_hfov: parseFloat(e.target.value) || 100.0 })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="set_as_initial_scene"
              checked={formState.set_as_initial}
              onChange={(e) => setFormState({ ...formState, set_as_initial: e.target.checked })}
              className="w-4 h-4 rounded text-[#00529C] focus:ring-[#00529C]"
            />
            <label htmlFor="set_as_initial_scene" className="text-xs font-semibold text-slate-700 select-none">
              Jadikan titik ini sebagai Pintu Masuk Utama (Scene pertama yang terbuka)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              {saving ? 'Menyimpan...' : editingScene ? 'Simpan Perubahan' : 'Tambah Titik Scene'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


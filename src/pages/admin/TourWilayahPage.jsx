import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';
import AdminImagePicker from '../../components/admin/AdminImagePicker';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function TourWilayahPage() {
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    nama_wilayah: '',
    slug: '',
    lokasi_koordinat: 'Dumai, Riau',
    deskripsi: '',
    gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
    urutan: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTourWilayahList();
      if (res?.success && res.data) {
        setWilayahList(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat wilayah tour 360:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      nama_wilayah: '',
      slug: '',
      lokasi_koordinat: 'Dumai, Riau',
      deskripsi: '',
      gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
      urutan: wilayahList.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      nama_wilayah: item.nama_wilayah || '',
      slug: item.slug || '',
      lokasi_koordinat: item.lokasi_koordinat || '',
      deskripsi: item.deskripsi || '',
      gambar_cover: item.gambar_cover || '',
      urutan: item.urutan || 1,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus wilayah "${nama}" beserta seluruh scene & hotspot di dalamnya?`)) {
      return;
    }
    try {
      await adminService.deleteTourWilayah(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus wilayah: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await adminService.updateTourWilayah(item.id, { is_active: !item.is_active });
      loadData();
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await adminService.updateTourWilayah(editingItem.id, formState);
      } else {
        await adminService.createTourWilayah(formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan wilayah: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const totalScenes = wilayahList.reduce((acc, w) => acc + (w.scenes_count || 0), 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Wilayah Virtual Tour 360
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola kawasan binaan CSR Pertamina, kartu visual cover, dan titik navigasi panorama 360
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          <span>Tambah Wilayah Baru</span>
        </button>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Kawasan Wilayah</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{wilayahList.length} Daerah</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00529C] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">map</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Titik Scene 360</span>
            <div className="text-xl font-bold text-[#00529C] mt-1">{totalScenes} Titik Panorama</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">360</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Status Publikasi</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              {wilayahList.filter((w) => w.is_active).length} Aktif di Portal
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
        </div>
      </div>

      {/* 3. Daftar Tabel Wilayah */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat wilayah 360 dari database...</span>
          </div>
        ) : wilayahList.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[40px] text-slate-300">travel_explore</span>
            <p className="text-sm font-medium text-slate-600 mt-2">Belum ada kawasan wilayah di database</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menambahkan wilayah pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Urutan</th>
                  <th className="py-3.5 px-4">Cover Daerah</th>
                  <th className="py-3.5 px-4">Nama Wilayah &amp; Slug</th>
                  <th className="py-3.5 px-4">Lokasi Wilayah</th>
                  <th className="py-3.5 px-4">Titik 360 Terdaftar</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wilayahList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{item.urutan}</td>
                    <td className="py-3.5 px-4">
                      <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={getFullImageUrl(item.gambar_cover)}
                          alt={item.nama_wilayah}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.nama_wilayah}</span>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                        <span>{item.lokasi_koordinat || 'Dumai, Riau'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#00529C] border border-blue-100 w-fit">
                          <span className="material-symbols-outlined text-[14px]">360</span>
                          <span>{item.scenes_count || 0} Titik Scene</span>
                        </span>
                        {item.initial_scene ? (
                          <span className="text-[10px] text-slate-400">
                            Pintu masuk: <strong>{item.initial_scene.nama_scene}</strong>
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-500 italic">Belum ada titik masuk</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer transition ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        ></span>
                        <span>{item.is_active ? 'Aktif' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Utama: Kelola Titik 360 */}
                        <Link
                          to={`/admin/tour-360/${item.id}/scenes`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00529C] text-white hover:bg-[#003B73] transition text-xs font-semibold shadow-xs"
                          title="Kelola Titik Panorama 360"
                        >
                          <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                          <span>Kelola Titik 360</span>
                        </Link>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#00529C] hover:bg-blue-50 transition"
                          title="Ubah Data Wilayah"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama_wilayah)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Wilayah"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal Tambah / Ubah Wilayah */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Ubah Data Wilayah 360' : 'Tambah Wilayah Tour 360 Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Wilayah / Daerah *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Mundam Jaya"
                value={formState.nama_wilayah}
                onChange={(e) => setFormState({ ...formState, nama_wilayah: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Urutan Kartu *
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lokasi / Alamat Wilayah
              </label>
              <input
                type="text"
                placeholder="Contoh: Kelurahan Mundam Jaya, Dumai, Riau"
                value={formState.lokasi_koordinat}
                onChange={(e) => setFormState({ ...formState, lokasi_koordinat: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Slug URL (Opsional)
              </label>
              <input
                type="text"
                placeholder="mundam-jaya"
                value={formState.slug}
                onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              />
              <span className="text-[10px] text-slate-400">Kosongkan untuk generate otomatis dari nama</span>
            </div>
          </div>

          {/* Upload Foto Cover Wilayah */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Foto Cover / Thumbnail Wilayah *
            </label>
            <AdminImagePicker
              value={formState.gambar_cover}
              onChange={(url) => setFormState({ ...formState, gambar_cover: url })}
              folder="tour360/cover"
              helperText="Rasio lanskap 16:9 ideal untuk kartu beranda"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deskripsi Singkat Kawasan Binaan
            </label>
            <textarea
              rows="3"
              placeholder="Deskripsi profil kawasan CSR binaan Pertamina Patra Niaga..."
              value={formState.deskripsi}
              onChange={(e) => setFormState({ ...formState, deskripsi: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_wilayah"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-[#00529C] focus:ring-[#00529C]"
            />
            <label htmlFor="is_active_wilayah" className="text-xs font-semibold text-slate-700 select-none">
              Tampilkan wilayah ini di portal publik
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
              {saving ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Wilayah'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


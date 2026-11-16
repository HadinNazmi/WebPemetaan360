import React, { useEffect, useState } from 'react';
import { tjslAdminService } from '../../../services/tjslAdminService';
import AdminModal from '../../../components/admin/AdminModal';

export default function TjslBantuanPage() {
  const [bantuanList, setBantuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formState, setFormState] = useState({
    judul_bantuan: '',
    penjelasan_bantuan: '',
    gambar_cover: '',
    urutan: 0,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await tjslAdminService.getBantuan();
      if (res.success && res.data) {
        setBantuanList(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat bantuan TJSL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormState({
      judul_bantuan: '',
      penjelasan_bantuan: '',
      gambar_cover: '',
      urutan: bantuanList.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormState({
      judul_bantuan: item.judul_bantuan || '',
      penjelasan_bantuan: item.penjelasan_bantuan || '',
      gambar_cover: item.gambar_cover || '',
      urutan: item.urutan || 0,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus agenda bantuan TJSL ini?')) return;
    try {
      const res = await tjslAdminService.deleteBantuan(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (editingId) {
        res = await tjslAdminService.updateBantuan(editingId, formState);
      } else {
        res = await tjslAdminService.createBantuan(formState);
      }

      if (res.success) {
        setModalOpen(false);
        loadData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Penyaluran Bantuan TJSL
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Agenda penyaluran bantuan langsung masyarakat, sarana umum, pendidikan, dan kesehatan
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Catat Bantuan Baru</span>
        </button>
      </div>

      {/* Grid Kartu Bantuan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            Memuat data bantuan TJSL...
          </div>
        ) : bantuanList.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            Belum ada agenda bantuan TJSL tercatat.
          </div>
        ) : (
          bantuanList.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Agenda #{idx + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.is_active ? 'Publik' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {item.judul_bantuan}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                  {item.penjelasan_bantuan || 'Tidak ada deskripsi rincian bantuan.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#00529C] hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Ubah Bantuan TJSL' : 'Tambah Penyaluran Bantuan TJSL'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul Penyaluran Bantuan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formState.judul_bantuan}
              onChange={(e) => setFormState({ ...formState, judul_bantuan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="Contoh: Bantuan Beasiswa Cerdas & Renovasi Laboratorium Komputer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rincian & Dampak Bantuan
            </label>
            <textarea
              rows={4}
              value={formState.penjelasan_bantuan}
              onChange={(e) => setFormState({ ...formState, penjelasan_bantuan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="Jelaskan penerima manfaat, jenis bantuan fisik, dan volume penyaluran..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              URL / Path Foto Dokumentasi
            </label>
            <input
              type="text"
              value={formState.gambar_cover}
              onChange={(e) => setFormState({ ...formState, gambar_cover: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="/uploads/bantuan/... atau https://..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active_bantuan"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-[#00529C] focus:ring-[#00529C]"
            />
            <label htmlFor="is_active_bantuan" className="text-xs font-medium text-slate-700">
              Tampilkan bantuan ini pada katalog publik beranda
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Bantuan'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


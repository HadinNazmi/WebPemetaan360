import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';
import AdminImagePicker from '../../components/admin/AdminImagePicker';

export default function PenyaluranBantuanPage() {
  const [bantuanList, setBantuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    judul_bantuan: '',
    penjelasan_bantuan: '',
    gambar_cover: '',
    urutan: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBantuan();
      if (res.success && res.data) {
        setBantuanList(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat bantuan CSR:', err);
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
      judul_bantuan: '',
      penjelasan_bantuan: '',
      gambar_cover: '',
      urutan: bantuanList.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
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
    if (!window.confirm('Yakin ingin menghapus kartu bantuan ini?')) return;
    try {
      await adminService.deleteBantuan(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await adminService.updateBantuan(item.id, { is_active: !item.is_active });
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
        await adminService.updateBantuan(editingItem.id, formState);
      } else {
        await adminService.createBantuan(formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan bantuan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Penyaluran Bantuan CSR
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola kartu-kartu slider carousel penyaluran bantuan di samping foto tim lapangan
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Kartu Bantuan</span>
        </button>
      </div>

      {/* Tabel Bantuan */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat data bantuan dari database...</span>
          </div>
        ) : bantuanList.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[36px] text-slate-300">volunteer_activism</span>
            <p className="text-sm font-medium text-slate-600 mt-2">Belum ada data bantuan di database</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menambah kartu bantuan pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Urutan</th>
                  <th className="py-3.5 px-4">Judul Program Bantuan</th>
                  <th className="py-3.5 px-4">Deskripsi / Penjelasan Singkat</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bantuanList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{item.urutan}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      {item.judul_bantuan}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-md line-clamp-2">
                      {item.penjelasan_bantuan}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide transition ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {item.is_active ? 'Tampil' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Ubah Bantuan"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Bantuan"
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

      {/* Modal Form Tambah / Edit */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Ubah Kartu Bantuan' : 'Tambah Kartu Bantuan Baru'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Judul Bantuan *
              </label>
              <input
                type="text"
                required
                value={formState.judul_bantuan}
                onChange={(e) => setFormState({ ...formState, judul_bantuan: e.target.value })}
                placeholder="Contoh: Bantuan Pendidikan"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urutan Slider *
              </label>
              <input
                type="number"
                value={formState.urutan}
                onChange={(e) => setFormState({ ...formState, urutan: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Penjelasan Singkat Bantuan (Maks. 2-3 kalimat) *
            </label>
            <textarea
              required
              rows={3}
              value={formState.penjelasan_bantuan}
              onChange={(e) => setFormState({ ...formState, penjelasan_bantuan: e.target.value })}
              placeholder="Penyaluran beasiswa berprestasi, renovasi ruang kelas..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <AdminImagePicker
            label="Foto / Ilustrasi Bantuan (Opsional)"
            value={formState.gambar_cover}
            onChange={(val) => setFormState({ ...formState, gambar_cover: val })}
            folder="bantuan"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="bantuan_active"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 text-[#00529C] rounded border-slate-300"
            />
            <label htmlFor="bantuan_active" className="text-sm text-slate-700 font-medium">
              Tampilkan di slider halaman beranda publik
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Bantuan'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


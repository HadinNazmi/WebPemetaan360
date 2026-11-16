import React, { useEffect, useState } from 'react';
import { tjslAdminService } from '../../../services/tjslAdminService';
import AdminModal from '../../../components/admin/AdminModal';

export default function TjslProgramPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formState, setFormState] = useState({
    nama_program: '',
    pilar_kategori: 'Pertamina Berdikari',
    lokasi: '',
    ringkasan: '',
    gambar_cover: '',
    urutan: 0,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await tjslAdminService.getPrograms();
      if (res.success && res.data) {
        setPrograms(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat program TJSL:', err);
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
      nama_program: '',
      pilar_kategori: 'Pertamina Berdikari',
      lokasi: '',
      ringkasan: '',
      gambar_cover: '',
      urutan: programs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormState({
      nama_program: item.nama_program || '',
      pilar_kategori: item.pilar_kategori || 'Pertamina Berdikari',
      lokasi: item.lokasi || '',
      ringkasan: item.ringkasan || '',
      gambar_cover: item.gambar_cover || '',
      urutan: item.urutan || 0,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus program TJSL ini?')) return;
    try {
      const res = await tjslAdminService.deleteProgram(id);
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
        res = await tjslAdminService.updateProgram(editingId, formState);
      } else {
        res = await tjslAdminService.createProgram(formState);
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
            Program Kerja TJSL
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen inisiatif program pemberdayaan dan tanggung jawab sosial lingkungan
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tambah Program TJSL</span>
        </button>
      </div>

      {/* Tabel Program */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6 w-12 text-center">No</th>
                <th className="py-3.5 px-6">Nama Program</th>
                <th className="py-3.5 px-6">Pilar / Kategori</th>
                <th className="py-3.5 px-6">Lokasi</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat daftar program TJSL...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data program TJSL.
                  </td>
                </tr>
              ) : (
                programs.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-center font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{item.nama_program}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {item.ringkasan || 'Tidak ada ringkasan'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#00529C] border border-blue-100">
                        {item.pilar_kategori || 'TJSL Pertamina'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      {item.lokasi || '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_active ? 'Aktif' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#00529C] hover:bg-blue-50 transition"
                          title="Edit Program"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Program"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Ubah Program TJSL' : 'Tambah Program TJSL Baru'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Inisiatif / Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formState.nama_program}
              onChange={(e) => setFormState({ ...formState, nama_program: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="Contoh: Konservasi Lahan Gambut & Hutan Mangrove"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                4 Pilar TJSL
              </label>
              <select
                value={formState.pilar_kategori}
                onChange={(e) => setFormState({ ...formState, pilar_kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C] bg-white"
              >
                <option value="Pertamina Cerdas">Pertamina Cerdas (Pendidikan)</option>
                <option value="Pertamina Sehat">Pertamina Sehat (Kesehatan)</option>
                <option value="Pertamina Hijau">Pertamina Hijau (Lingkungan)</option>
                <option value="Pertamina Berdikari">Pertamina Berdikari (Ekonomi & UMKM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lokasi / Desa Binaan
              </label>
              <input
                type="text"
                value={formState.lokasi}
                onChange={(e) => setFormState({ ...formState, lokasi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
                placeholder="Contoh: Kelurahan Mundam, Dumai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ringkasan Program
            </label>
            <textarea
              rows={3}
              value={formState.ringkasan}
              onChange={(e) => setFormState({ ...formState, ringkasan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="Deskripsi singkat capaian dan target program TJSL..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              URL / Path Gambar Cover
            </label>
            <input
              type="text"
              value={formState.gambar_cover}
              onChange={(e) => setFormState({ ...formState, gambar_cover: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]/20 focus:border-[#00529C]"
              placeholder="/uploads/program/... atau https://..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active_tjsl"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-[#00529C] focus:ring-[#00529C]"
            />
            <label htmlFor="is_active_tjsl" className="text-xs font-medium text-slate-700">
              Aktifkan dan tampilkan program ini di publik
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
              {saving ? 'Menyimpan...' : 'Simpan Program'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


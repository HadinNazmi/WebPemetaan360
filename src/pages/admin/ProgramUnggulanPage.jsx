import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';

export default function ProgramUnggulanPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    nama_program: '',
    pilar_kategori: 'PROGRAM UNGGULAN CSR',
    gambar_cover: '',
    ringkasan: '',
    deskripsi_lengkap: '',
    lokasi: '',
    link_eksternal: '',
    urutan: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPrograms();
      if (res.success && res.data) {
        setPrograms(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat program CSR:', err);
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
      nama_program: '',
      pilar_kategori: 'PROGRAM UNGGULAN CSR',
      gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
      ringkasan: '',
      deskripsi_lengkap: '',
      lokasi: 'Dumai, Riau',
      link_eksternal: '',
      urutan: programs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      nama_program: item.nama_program || '',
      pilar_kategori: item.pilar_kategori || '',
      gambar_cover: item.gambar_cover || '',
      ringkasan: item.ringkasan || '',
      deskripsi_lengkap: item.deskripsi_lengkap || '',
      lokasi: item.lokasi || '',
      link_eksternal: item.link_eksternal || '',
      urutan: item.urutan || 0,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus program ini dari database?')) return;
    try {
      await adminService.deleteProgram(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus program: ' + err.message);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await adminService.updateProgram(item.id, { is_active: !item.is_active });
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
        await adminService.updateProgram(editingItem.id, formState);
      } else {
        await adminService.createProgram(formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan program: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Program Unggulan CSR
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola kartu visual showcase 4 program di beranda beserta seluruh isi sub-halaman detailnya
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* Tabel Program CSR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat program dari database...</span>
          </div>
        ) : programs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[36px] text-slate-300">verified</span>
            <p className="text-sm font-medium text-slate-600 mt-2">Belum ada program CSR di database</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menambahkan program pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Urutan</th>
                  <th className="py-3.5 px-4">Cover</th>
                  <th className="py-3.5 px-4">Nama Program &amp; Slug</th>
                  <th className="py-3.5 px-4">Kategori Pilar</th>
                  <th className="py-3.5 px-4">Lokasi</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{item.urutan}
                    </td>
                    <td className="py-3.5 px-4">
                      <img
                        src={item.gambar_cover}
                        alt={item.nama_program}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
                        }}
                      />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-900 block truncate">{item.nama_program}</span>
                      <span className="text-[11px] text-slate-400 font-mono block">/{item.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#00529C]">
                        {item.pilar_kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.lokasi || '-'}
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
                        <a
                          href={`/program/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Halaman Publik"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </a>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Ubah Program"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Program"
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
        maxWidth="max-w-3xl"
        title={editingItem ? 'Ubah Program CSR' : 'Tambah Program CSR Baru'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Program *
              </label>
              <input
                type="text"
                required
                value={formState.nama_program}
                onChange={(e) => setFormState({ ...formState, nama_program: e.target.value })}
                placeholder="Contoh: Layanan Informasi Publik (PPID)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urutan Kartu *
              </label>
              <input
                type="number"
                value={formState.urutan}
                onChange={(e) => setFormState({ ...formState, urutan: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilar / Kategori Label *
              </label>
              <input
                type="text"
                required
                value={formState.pilar_kategori}
                onChange={(e) => setFormState({ ...formState, pilar_kategori: e.target.value })}
                placeholder="PROFIL PPID / PROGRAM KELAUTAN"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lokasi Pelaksanaan
              </label>
              <input
                type="text"
                value={formState.lokasi}
                onChange={(e) => setFormState({ ...formState, lokasi: e.target.value })}
                placeholder="Dumai, Riau"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              URL Gambar Cover / Banner *
            </label>
            <input
              type="text"
              required
              value={formState.gambar_cover}
              onChange={(e) => setFormState({ ...formState, gambar_cover: e.target.value })}
              placeholder="https://... / path file cover"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ringkasan Singkat (Muncul di kartu / preview) *
            </label>
            <textarea
              required
              rows={2}
              value={formState.ringkasan}
              onChange={(e) => setFormState({ ...formState, ringkasan: e.target.value })}
              placeholder="Ringkasan 1-2 kalimat tentang program ini..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Lengkap Sub-Halaman (Mendukung tag HTML &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, dll) *
            </label>
            <textarea
              required
              rows={6}
              value={formState.deskripsi_lengkap}
              onChange={(e) => setFormState({ ...formState, deskripsi_lengkap: e.target.value })}
              placeholder="<p>Pertamina berkomitmen dalam pengembangan...</p>"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tautan Eksternal (Opsional - Jika kartu langsung buka website lain)
            </label>
            <input
              type="text"
              value={formState.link_eksternal || ''}
              onChange={(e) => setFormState({ ...formState, link_eksternal: e.target.value })}
              placeholder="Kosongkan jika ingin membuka sub-halaman detail internal"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="program_active"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 text-[#00529C] rounded border-slate-300"
            />
            <label htmlFor="program_active" className="text-sm text-slate-700 font-medium">
              Tampilkan di halaman beranda publik
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
              {saving ? 'Menyimpan...' : 'Simpan Program'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


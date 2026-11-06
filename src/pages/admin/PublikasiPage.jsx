import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';
import AdminImagePicker from '../../components/admin/AdminImagePicker';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function PublikasiPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    judul_artikel: '',
    kategori_tag: 'SIARAN PERS',
    gambar_cover: '',
    url_media: '',
    sumber_media: 'Pertamina Newsroom',
    tanggal_publikasi: new Date().toISOString().split('T')[0],
    is_featured: false,
    urutan: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getArtikel();
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat artikel publikasi:', err);
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
      judul_artikel: '',
      kategori_tag: 'SIARAN PERS',
      gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
      url_media: 'https://www.pertamina.com/id/news-room/news-release',
      sumber_media: 'Pertamina Newsroom',
      tanggal_publikasi: new Date().toISOString().split('T')[0],
      is_featured: false,
      urutan: articles.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      judul_artikel: item.judul_artikel || '',
      kategori_tag: item.kategori_tag || 'SIARAN PERS',
      gambar_cover: item.gambar_cover || '',
      url_media: item.url_media || '',
      sumber_media: item.sumber_media || '',
      tanggal_publikasi: item.tanggal_publikasi ? item.tanggal_publikasi.split('T')[0] : '',
      is_featured: Boolean(item.is_featured),
      urutan: item.urutan || 0,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      await adminService.deleteArtikel(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleSetFeatured = async (item) => {
    try {
      await adminService.updateArtikel(item.id, { is_featured: true });
      loadData();
    } catch (err) {
      alert('Gagal mengatur berita utama: ' + err.message);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await adminService.updateArtikel(item.id, { is_active: !item.is_active });
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
        await adminService.updateArtikel(editingItem.id, formState);
      } else {
        await adminService.createArtikel(formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan artikel: ' + (err.response?.data?.message || err.message));
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
            Publikasi &amp; Siaran Pers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola berita, siaran pers, dan atur 1 berita utama (Featured) untuk bento grid beranda
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Tabel Artikel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat artikel dari database...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[36px] text-slate-300">newspaper</span>
            <p className="text-sm font-medium text-slate-600 mt-2">Belum ada artikel publikasi di database</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menerbitkan artikel pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Cover</th>
                  <th className="py-3.5 px-4">Judul Artikel</th>
                  <th className="py-3.5 px-4">Kategori Tag</th>
                  <th className="py-3.5 px-4">Tanggal Publikasi</th>
                  <th className="py-3.5 px-4 text-center">Posisi</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <img
                        src={getFullImageUrl(item.gambar_cover)}
                        alt={item.judul_artikel}
                        className="w-16 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
                        }}
                      />
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <span className="font-semibold text-slate-900 block truncate">{item.judul_artikel}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{item.sumber_media || 'Media Online'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.kategori_tag}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                      {item.tanggal_publikasi ? new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="material-symbols-outlined text-[13px]">star</span>
                          Featured Utama
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetFeatured(item)}
                          className="text-[11px] text-slate-400 hover:text-[#00529C] hover:underline"
                        >
                          Jadikan Utama
                        </button>
                      )}
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
                          href={item.url_media}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Buka Link Berita Asli"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Ubah Artikel"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Artikel"
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
        maxWidth="max-w-2xl"
        title={editingItem ? 'Ubah Artikel Publikasi' : 'Tulis Artikel Publikasi Baru'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Artikel / Siaran Pers *
            </label>
            <input
              type="text"
              required
              value={formState.judul_artikel}
              onChange={(e) => setFormState({ ...formState, judul_artikel: e.target.value })}
              placeholder="Contoh: Maknai Sumpah Pemuda, Pertamina Dorong Inovasi Generasi Muda"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Tag *
              </label>
              <select
                value={formState.kategori_tag}
                onChange={(e) => setFormState({ ...formState, kategori_tag: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              >
                <option value="SIARAN PERS">SIARAN PERS</option>
                <option value="BERITA CSR">BERITA CSR</option>
                <option value="ENERGIA">BERITA ENERGIA</option>
                <option value="SUSTAINABILITY">SUSTAINABILITY</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Publikasi *
              </label>
              <input
                type="date"
                required
                value={formState.tanggal_publikasi}
                onChange={(e) => setFormState({ ...formState, tanggal_publikasi: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <AdminImagePicker
            label="Foto Cover / Thumbnail Berita *"
            value={formState.gambar_cover}
            onChange={(val) => setFormState({ ...formState, gambar_cover: val })}
            folder="artikel"
            helperText="Rasio ideal landscape 16:9 (Maks. 10MB)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL Tautan Berita Asli *
              </label>
              <input
                type="text"
                required
                value={formState.url_media}
                onChange={(e) => setFormState({ ...formState, url_media: e.target.value })}
                placeholder="https://www.pertamina.com/id/news-room..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sumber Media
              </label>
              <input
                type="text"
                value={formState.sumber_media}
                onChange={(e) => setFormState({ ...formState, sumber_media: e.target.value })}
                placeholder="Pertamina Newsroom / Media"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formState.is_featured}
                onChange={(e) => setFormState({ ...formState, is_featured: e.target.checked })}
                className="w-4 h-4 text-[#00529C] rounded border-slate-300"
              />
              <label htmlFor="is_featured" className="text-sm text-slate-800 font-semibold">
                Jadikan Berita Utama (Featured Card Besar di Kiri)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="artikel_active"
                checked={formState.is_active}
                onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
                className="w-4 h-4 text-[#00529C] rounded border-slate-300"
              />
              <label htmlFor="artikel_active" className="text-sm text-slate-700 font-medium">
                Tampilkan di bento grid beranda publik
              </label>
            </div>
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
              {saving ? 'Menyimpan...' : 'Terbitkan Artikel'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


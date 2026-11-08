import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';

export default function MetrikDampakPage() {
  const [metrics, setMetrics] = useState([]);
  const [sistemList, setSistemList] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'siminah' | 'simon'
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState({
    sistem_csr_id: 1,
    nama_metrik: '',
    kategori_label: '',
    nilai_cached: 0,
    satuan: '',
    sub_satuan: '',
    suffix: '',
    format_angka: 'integer',
    deskripsi: '',
    urutan: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  // State untuk modal edit profil platform Sistem CSR (SiMinah / Simon+)
  const [sistemModalOpen, setSistemModalOpen] = useState(false);
  const [editingSistem, setEditingSistem] = useState(null);
  const [sistemForm, setSistemForm] = useState({
    nama_sistem: '',
    badge_label: '',
    deskripsi: '',
    deskripsi_lengkap: '',
    gambar_cover: '',
    url_portal: '',
    fitur_keunggulan: '',
    is_active: true,
  });
  const [savingSistem, setSavingSistem] = useState(false);

  const openEditSistemModal = (sistem) => {
    setEditingSistem(sistem);
    setSistemForm({
      nama_sistem: sistem.nama_sistem || '',
      badge_label: sistem.badge_label || '',
      deskripsi: sistem.deskripsi || '',
      deskripsi_lengkap: sistem.deskripsi_lengkap || '',
      gambar_cover: sistem.gambar_cover || '',
      url_portal: sistem.url_portal || '',
      fitur_keunggulan: Array.isArray(sistem.fitur_keunggulan)
        ? sistem.fitur_keunggulan.join('\n')
        : (sistem.fitur_keunggulan || ''),
      is_active: Boolean(sistem.is_active),
    });
    setSistemModalOpen(true);
  };

  const handleSaveSistem = async (e) => {
    e.preventDefault();
    if (!editingSistem) return;
    setSavingSistem(true);
    try {
      const payload = {
        ...sistemForm,
        fitur_keunggulan: sistemForm.fitur_keunggulan
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await adminService.updateSistemCsr(editingSistem.id, payload);
      setSistemModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan sistem: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingSistem(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMetrikDampak();
      if (res.success && res.data) {
        setMetrics(res.data.metrik_list || []);
        setSistemList(res.data.sistem || []);
      }
    } catch (err) {
      console.error('Gagal memuat metrik dampak:', err);
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
      sistem_csr_id: sistemList[0]?.id || 1,
      nama_metrik: '',
      kategori_label: '',
      nilai_cached: 0,
      satuan: '',
      sub_satuan: '',
      suffix: '',
      format_angka: 'integer',
      deskripsi: '',
      urutan: metrics.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      sistem_csr_id: item.sistem_csr_id || 1,
      nama_metrik: item.nama_metrik || '',
      kategori_label: item.kategori_label || '',
      nilai_cached: item.nilai_cached || 0,
      satuan: item.satuan || '',
      sub_satuan: item.sub_satuan || '',
      suffix: item.suffix || '',
      format_angka: item.format_angka || 'integer',
      deskripsi: item.deskripsi || '',
      urutan: item.urutan || 0,
      is_active: Boolean(item.is_active),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus metrik dampak ini?')) return;
    try {
      await adminService.deleteMetrikDampak(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await adminService.updateMetrikDampak(item.id, { is_active: !item.is_active });
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
        await adminService.updateMetrikDampak(editingItem.id, formState);
      } else {
        await adminService.createMetrikDampak(formState);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Filter list by tab
  const filteredMetrics = metrics.filter((m) => {
    if (activeTab === 'all') return true;
    const kode = m.sistem?.kode_sistem?.toLowerCase() || '';
    return kode.includes(activeTab);
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Metrik Dampak Digital
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola angka capaian numerik SiMinah &amp; Simon+ yang tampil pada counter animasi beranda
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Indikator Baru</span>
        </button>
      </div>

      {/* 1. KARTU PROFIL PLATFORM UTAMA (SIMINAH & SIMON+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sistemList.map((sis) => (
          <div
            key={sis.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00529C] font-bold text-base flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {sis.kode_sistem?.includes('simon') ? 'monitoring' : 'recycling'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sis.nama_sistem}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {sis.badge_label || 'Platform Digital CSR'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openEditSistemModal(sis)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Edit Profil</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {sis.deskripsi || 'Sistem informasi pengelolaan dan evaluasi program CSR terpadu.'}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
              <span className="truncate max-w-[200px]">
                {sis.url_portal ? (
                  <a href={sis.url_portal} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {sis.url_portal}
                  </a>
                ) : (
                  'Belum ada link portal'
                )}
              </span>
              <Link
                to={`/sistem/${sis.kode_sistem}`}
                target="_blank"
                className="text-slate-600 hover:text-[#00529C] font-medium flex items-center gap-1"
              >
                <span>Lihat Halaman Publik</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 2. TABEL CAPAIAN INDIKATOR METRIK */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-base font-bold text-slate-800">Daftar Angka Capaian Metrik</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-[#00529C] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Sistem ({metrics.length})
        </button>
        <button
          onClick={() => setActiveTab('siminah')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'siminah'
              ? 'bg-[#00529C] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          SiMinah (Minyak Jelantah)
        </button>
        <button
          onClick={() => setActiveTab('simon')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'simon'
              ? 'bg-[#00529C] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Simon+ (Monitoring CSR)
        </button>
      </div>

      {/* Tabel Data Metrik */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm">Memuat data dari database...</span>
          </div>
        ) : filteredMetrics.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-[36px] text-slate-300">bar_chart</span>
            <p className="text-sm font-medium text-slate-600 mt-2">Belum ada metrik dampak di kategori ini</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol "Tambah Indikator Baru" untuk mengisi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Urutan</th>
                  <th className="py-3.5 px-4">Nama Indikator</th>
                  <th className="py-3.5 px-4">Sistem</th>
                  <th className="py-3.5 px-4">Nilai Capaian</th>
                  <th className="py-3.5 px-4">Satuan &amp; Suffix</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{item.urutan}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{item.nama_metrik}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.kategori_label}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#00529C]">
                        {item.sistem?.nama_sistem || 'Umum'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-base">
                      {parseFloat(item.nilai_cached).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {item.satuan} {item.suffix && <span className="font-bold text-blue-600">({item.suffix})</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] uppercase font-semibold text-slate-500">
                        {item.format_angka}
                      </span>
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
                          title="Ubah Metrik"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Metrik"
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
        title={editingItem ? 'Ubah Indikator Metrik Dampak' : 'Tambah Indikator Metrik Baru'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sistem CSR *
              </label>
              <select
                value={formState.sistem_csr_id}
                onChange={(e) => setFormState({ ...formState, sistem_csr_id: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              >
                {sistemList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_sistem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urutan Tampil *
              </label>
              <input
                type="number"
                value={formState.urutan}
                onChange={(e) => setFormState({ ...formState, urutan: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Metrik *
              </label>
              <input
                type="text"
                required
                value={formState.nama_metrik}
                onChange={(e) => setFormState({ ...formState, nama_metrik: e.target.value })}
                placeholder="Contoh: Donatur Terdaftar"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Label Atas *
              </label>
              <input
                type="text"
                required
                value={formState.kategori_label}
                onChange={(e) => setFormState({ ...formState, kategori_label: e.target.value })}
                placeholder="DONATUR TERDAFTAR (SIMINAH)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nilai Angka *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formState.nilai_cached}
                onChange={(e) => setFormState({ ...formState, nilai_cached: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Satuan *
              </label>
              <input
                type="text"
                required
                value={formState.satuan}
                onChange={(e) => setFormState({ ...formState, satuan: e.target.value })}
                placeholder="Donatur / Ton"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Suffix
              </label>
              <input
                type="text"
                value={formState.suffix}
                onChange={(e) => setFormState({ ...formState, suffix: e.target.value })}
                placeholder="Contoh: +"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Format Angka
              </label>
              <select
                value={formState.format_angka}
                onChange={(e) => setFormState({ ...formState, format_angka: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              >
                <option value="integer">Bulat (1.450)</option>
                <option value="decimal">Desimal (28,5)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sub Satuan (Opsional)
              </label>
              <input
                type="text"
                value={formState.sub_satuan || ''}
                onChange={(e) => setFormState({ ...formState, sub_satuan: e.target.value })}
                placeholder="Contoh: (Jelantah)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Singkat Metrik
            </label>
            <textarea
              rows={2}
              value={formState.deskripsi || ''}
              onChange={(e) => setFormState({ ...formState, deskripsi: e.target.value })}
              placeholder="Keterangan pencapaian yang tampil di bawah counter..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="metrik_active"
              checked={formState.is_active}
              onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
              className="w-4 h-4 text-[#00529C] rounded border-slate-300"
            />
            <label htmlFor="metrik_active" className="text-sm text-slate-700 font-medium">
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
              {saving ? 'Menyimpan...' : 'Simpan Indikator'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* 4. MODAL EDIT PROFIL SISTEM CSR (SIMINAH / SIMON+) */}
      <AdminModal
        isOpen={sistemModalOpen}
        onClose={() => setSistemModalOpen(false)}
        title={`Edit Profil Platform: ${editingSistem?.nama_sistem || 'Sistem CSR'}`}
        subtitle="Ubah informasi profil, banner cover, deskripsi lengkap, dan link portal web"
      >
        <form onSubmit={handleSaveSistem} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Platform
              </label>
              <input
                type="text"
                required
                value={sistemForm.nama_sistem}
                onChange={(e) => setSistemForm({ ...sistemForm, nama_sistem: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori / Badge Label
              </label>
              <input
                type="text"
                value={sistemForm.badge_label}
                onChange={(e) => setSistemForm({ ...sistemForm, badge_label: e.target.value })}
                placeholder="Contoh: SIRKULARITAS MINYAK JELANTAH"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL Portal / Link Aplikasi Web
              </label>
              <input
                type="url"
                value={sistemForm.url_portal}
                onChange={(e) => setSistemForm({ ...sistemForm, url_portal: e.target.value })}
                placeholder="https://siminah.id"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL Gambar Cover / Banner
              </label>
              <input
                type="text"
                value={sistemForm.gambar_cover}
                onChange={(e) => setSistemForm({ ...sistemForm, gambar_cover: e.target.value })}
                placeholder="URL gambar atau /uploads/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Singkat (Tampil di Dropdown &amp; Kartu Beranda)
            </label>
            <textarea
              rows={2}
              value={sistemForm.deskripsi}
              onChange={(e) => setSistemForm({ ...sistemForm, deskripsi: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Lengkap (Tampil di Halaman Detail Sistem)
            </label>
            <textarea
              rows={4}
              value={sistemForm.deskripsi_lengkap}
              onChange={(e) => setSistemForm({ ...sistemForm, deskripsi_lengkap: e.target.value })}
              placeholder="Penjelasan mendalam mengenai sistem, manfaat lingkungan, dan latar belakang..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Fitur &amp; Keunggulan Utama (1 Fitur per Baris)
            </label>
            <textarea
              rows={3}
              value={sistemForm.fitur_keunggulan}
              onChange={(e) => setSistemForm({ ...sistemForm, fitur_keunggulan: e.target.value })}
              placeholder="Contoh:&#10;Tracking Logistik Penjemputan Jeriken&#10;Konversi Saldo Sedekah Digital&#10;Kalkulator Emisi Karbon"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sistem_active"
              checked={sistemForm.is_active}
              onChange={(e) => setSistemForm({ ...sistemForm, is_active: e.target.checked })}
              className="w-4 h-4 text-[#00529C] rounded border-slate-300"
            />
            <label htmlFor="sistem_active" className="text-sm text-slate-700 font-medium">
              Aktifkan sistem ini di navigasi header &amp; halaman publik
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setSistemModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={savingSistem}
              className="px-6 py-2 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {savingSistem ? 'Menyimpan...' : 'Simpan Perubahan Sistem'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


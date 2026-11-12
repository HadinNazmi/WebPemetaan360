import React, { useEffect, useState } from 'react';
import { umkmService } from '../../services/umkmService';
import { adminService } from '../../services/adminService';
import AdminModal from '../../components/admin/AdminModal';

export default function UmkmAdminPage() {
  const [activeTab, setActiveTab] = useState('kelompok'); // 'kelompok' | 'produk'

  // Data States
  const [kelompokList, setKelompokList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchKelompok, setSearchKelompok] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('Semua');
  const [searchProduk, setSearchProduk] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  // Modal States - Kelompok
  const [modalKelompokOpen, setModalKelompokOpen] = useState(false);
  const [editingKelompok, setEditingKelompok] = useState(null);
  const [formKelompok, setFormKelompok] = useState({
    nama_kelompok: '',
    nama_ketua: '',
    nomor_wa: '',
    tahun_berdiri: '',
    angkatan: '',
    jumlah_anggota: 0,
    kecamatan: 'Kec. Medang Kampai',
    alamat_lengkap: '',
    deskripsi: '',
    foto_cover: '',
    is_active: true,
  });

  // Modal States - Produk
  const [modalProdukOpen, setModalProdukOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formProduk, setFormProduk] = useState({
    kelompok_umkm_id: '',
    nama_produk: '',
    kategori: 'Olahan Nanas & Kuliner',
    harga: 0,
    satuan: 'per Pcs',
    foto_produk: '',
    deskripsi_produk: '',
    is_tersedia: true,
    is_featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load All Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [resKelompok, resProduk] = await Promise.all([
        umkmService.getAdminKelompokList(),
        umkmService.getAdminProdukList(),
      ]);

      if (resKelompok.success && Array.isArray(resKelompok.data)) {
        setKelompokList(resKelompok.data);
      }
      if (resProduk.success && Array.isArray(resProduk.data)) {
        setProdukList(resProduk.data);
      }
    } catch (err) {
      console.error('Gagal memuat data admin UMKM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Upload Handler
  const handleFileUpload = async (e, targetField, setForm) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await adminService.uploadImage(file, 'umkm');
      if (res.success && res.data?.url) {
        setForm((prev) => ({ ...prev, [targetField]: res.data.url }));
      } else {
        alert('Gagal mengunggah foto.');
      }
    } catch (err) {
      alert('Error saat mengunggah: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // HANDLERS KELOMPOK
  // ==========================================
  const openCreateKelompok = () => {
    setEditingKelompok(null);
    setFormKelompok({
      nama_kelompok: '',
      nama_ketua: '',
      nomor_wa: '',
      tahun_berdiri: new Date().getFullYear().toString(),
      angkatan: `Angkatan ${new Date().getFullYear()}`,
      jumlah_anggota: 10,
      kecamatan: 'Kec. Medang Kampai',
      alamat_lengkap: '',
      deskripsi: '',
      foto_cover: '',
      is_active: true,
    });
    setModalKelompokOpen(true);
  };

  const openEditKelompok = (item) => {
    setEditingKelompok(item);
    setFormKelompok({
      nama_kelompok: item.nama_kelompok || '',
      nama_ketua: item.nama_ketua || '',
      nomor_wa: item.nomor_wa || '',
      tahun_berdiri: item.tahun_berdiri || '',
      angkatan: item.angkatan || '',
      jumlah_anggota: item.jumlah_anggota || 0,
      kecamatan: item.kecamatan || 'Kec. Medang Kampai',
      alamat_lengkap: item.alamat_lengkap || '',
      deskripsi: item.deskripsi || '',
      foto_cover: item.foto_cover || '',
      is_active: Boolean(item.is_active),
    });
    setModalKelompokOpen(true);
  };

  const handleSaveKelompok = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingKelompok) {
        await umkmService.updateAdminKelompok(editingKelompok.id, formKelompok);
      } else {
        await umkmService.createAdminKelompok(formKelompok);
      }
      setModalKelompokOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan kelompok: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKelompok = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus kelompok "${nama}" beserta seluruh produknya?`)) return;
    try {
      await umkmService.deleteAdminKelompok(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  // ==========================================
  // HANDLERS PRODUK
  // ==========================================
  const openCreateProduk = () => {
    if (kelompokList.length === 0) {
      alert('Harap tambahkan minimal satu kelompok UMKM terlebih dahulu!');
      return;
    }
    setEditingProduk(null);
    setFormProduk({
      kelompok_umkm_id: kelompokList[0]?.id || '',
      nama_produk: '',
      kategori: 'Olahan Nanas & Kuliner',
      harga: 15000,
      satuan: 'per Botol',
      foto_produk: '',
      deskripsi_produk: '',
      is_tersedia: true,
      is_featured: false,
    });
    setModalProdukOpen(true);
  };

  const openEditProduk = (item) => {
    setEditingProduk(item);
    setFormProduk({
      kelompok_umkm_id: item.kelompok_umkm_id || '',
      nama_produk: item.nama_produk || '',
      kategori: item.kategori || 'Olahan Nanas & Kuliner',
      harga: item.harga || 0,
      satuan: item.satuan || 'per Pcs',
      foto_produk: item.foto_produk || '',
      deskripsi_produk: item.deskripsi_produk || '',
      is_tersedia: Boolean(item.is_tersedia),
      is_featured: Boolean(item.is_featured),
    });
    setModalProdukOpen(true);
  };

  const handleSaveProduk = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduk) {
        await umkmService.updateAdminProduk(editingProduk.id, formProduk);
      } else {
        await umkmService.createAdminProduk(formProduk);
      }
      setModalProdukOpen(false);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan produk: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduk = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${nama}"?`)) return;
    try {
      await umkmService.deleteAdminProduk(id);
      loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filtered lists
  const filteredKelompok = kelompokList.filter((item) => {
    const matchSearch =
      item.nama_kelompok.toLowerCase().includes(searchKelompok.toLowerCase()) ||
      item.nama_ketua.toLowerCase().includes(searchKelompok.toLowerCase());
    const matchKecamatan =
      filterKecamatan === 'Semua' || item.kecamatan === filterKecamatan;
    return matchSearch && matchKecamatan;
  });

  const filteredProduk = produkList.filter((item) => {
    const matchSearch =
      item.nama_produk.toLowerCase().includes(searchProduk.toLowerCase()) ||
      (item.kelompok?.nama_kelompok || '').toLowerCase().includes(searchProduk.toLowerCase());
    const matchKategori =
      filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  // Unique lists for dropdowns
  const uniqueKategori = Array.from(new Set(produkList.map((p) => p.kategori).filter(Boolean)));
  const uniqueKecamatan = Array.from(new Set(kelompokList.map((k) => k.kecamatan).filter(Boolean)));

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola UMKM &amp; Produk Binaan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen profil kelompok binaan dan katalog produk mitra TJSL PT Pertamina Patra Niaga Dumai
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'kelompok'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab('kelompok')}
          >
            Kelompok UMKM ({kelompokList.length})
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'produk'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab('produk')}
          >
            Katalog Produk ({produkList.length})
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: KELOMPOK UMKM
         ======================================================== */}
      {activeTab === 'kelompok' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 flex flex-col gap-5">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama kelompok / nama ketua..."
                  value={searchKelompok}
                  onChange={(e) => setSearchKelompok(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00529C]"
                />
              </div>
              <select
                value={filterKecamatan}
                onChange={(e) => setFilterKecamatan(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="Semua">Semua Kecamatan</option>
                {uniqueKecamatan.map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openCreateKelompok}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#00529C] hover:bg-[#003e75] text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah Kelompok UMKM</span>
            </button>
          </div>

          {/* Table Kelompok */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Memuat data kelompok UMKM...
            </div>
          ) : filteredKelompok.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada data kelompok UMKM yang sesuai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Kelompok</th>
                    <th className="py-3 px-3">Pengelola / Ketua</th>
                    <th className="py-3 px-3">WhatsApp</th>
                    <th className="py-3 px-3">Kecamatan</th>
                    <th className="py-3 px-3 text-center">Anggota</th>
                    <th className="py-3 px-3 text-center">Produk</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKelompok.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.foto_cover ||
                              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={item.nama_kelompok}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">
                              {item.nama_kelompok}
                            </span>
                            {item.angkatan && (
                              <span className="text-[10px] text-slate-400">
                                {item.angkatan}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {item.nama_ketua}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {item.nomor_wa}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {item.kecamatan}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {item.jumlah_anggota || 0}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {item.produk_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditKelompok(item)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit kelompok"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKelompok(item.id, item.nama_kelompok)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus kelompok"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
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
      )}

      {/* ========================================================
          TAB 2: KATALOG PRODUK
         ======================================================== */}
      {activeTab === 'produk' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 flex flex-col gap-5">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama produk / nama UMKM..."
                  value={searchProduk}
                  onChange={(e) => setSearchProduk(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00529C]"
                />
              </div>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="Semua">Semua Kategori</option>
                {uniqueKategori.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openCreateProduk}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#00529C] hover:bg-[#003e75] text-white text-xs font-semibold shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          {/* Table Produk */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Memuat data katalog produk...
            </div>
          ) : filteredProduk.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada produk yang sesuai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Produk</th>
                    <th className="py-3 px-3">UMKM Pemilik</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Harga &amp; Satuan</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProduk.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.foto_produk ||
                              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={item.nama_produk}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">
                              {item.nama_produk}
                            </span>
                            {item.is_featured && (
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                Unggulan
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {item.kelompok?.nama_kelompok || '-'}
                        <span className="block text-[10px] text-slate-400">
                          {item.kelompok?.kecamatan || ''}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-red-600 block text-xs">
                          Rp {item.harga?.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.satuan || 'per Pcs'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.is_tersedia
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.is_tersedia ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditProduk(item)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit produk"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduk(item.id, item.nama_produk)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Hapus produk"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
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
      )}

      {/* ========================================================
          MODAL KELOMPOK (TAMBAH / EDIT)
         ======================================================== */}
      <AdminModal
        isOpen={modalKelompokOpen}
        onClose={() => setModalKelompokOpen(false)}
        title={editingKelompok ? 'Edit Kelompok UMKM' : 'Tambah Kelompok UMKM'}
      >
        <form onSubmit={handleSaveKelompok} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kelompok UMKM *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Wanita Mundam Berseri"
                value={formKelompok.nama_kelompok}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, nama_kelompok: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pengelola / Ketua *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Hj. Ernawati"
                value={formKelompok.nama_ketua}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, nama_ketua: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Resmi *
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: 081268499201"
                value={formKelompok.nomor_wa}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, nomor_wa: e.target.value })
                }
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Nomor ini akan menerima pesanan WhatsApp otomatis dari keranjang.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kecamatan *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Kec. Medang Kampai"
                value={formKelompok.kecamatan}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, kecamatan: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tahun Berdiri
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: 2018"
                value={formKelompok.tahun_berdiri}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, tahun_berdiri: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Angkatan / Tahun Binaan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Angkatan 2018"
                value={formKelompok.angkatan}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, angkatan: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Anggota (Orang)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                value={formKelompok.jumlah_anggota}
                onChange={(e) =>
                  setFormKelompok({
                    ...formKelompok,
                    jumlah_anggota: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
              value={formKelompok.alamat_lengkap}
              onChange={(e) =>
                setFormKelompok({ ...formKelompok, alamat_lengkap: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tentang Kelompok Usaha (Deskripsi Profil)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
              placeholder="Ceritakan latar belakang, fokus usaha, dan pemberdayaan oleh CSR..."
              value={formKelompok.deskripsi}
              onChange={(e) =>
                setFormKelompok({ ...formKelompok, deskripsi: e.target.value })
              }
            />
          </div>

          {/* Upload / URL Foto Banner */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Foto Banner / Header Kelompok
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="https://... atau klik tombol unggah"
                value={formKelompok.foto_cover}
                onChange={(e) =>
                  setFormKelompok({ ...formKelompok, foto_cover: e.target.value })
                }
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer border border-slate-300 font-semibold flex items-center gap-1.5 transition">
                <span className="material-symbols-outlined text-[16px]">
                  upload
                </span>
                <span>{uploading ? 'Mengunggah...' : 'Pilih File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'foto_cover', setFormKelompok)}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_kelompok"
              checked={formKelompok.is_active}
              onChange={(e) =>
                setFormKelompok({ ...formKelompok, is_active: e.target.checked })
              }
              className="rounded text-blue-600"
            />
            <label htmlFor="is_active_kelompok" className="font-semibold text-slate-700 cursor-pointer">
              Tampilkan kelompok ini di portal publik (Aktif)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalKelompokOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00529C] hover:bg-[#003e75] text-white rounded-lg font-semibold shadow-xs transition"
              disabled={saving || uploading}
            >
              {saving ? 'Menyimpan...' : 'Simpan Kelompok'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ========================================================
          MODAL PRODUK (TAMBAH / EDIT)
         ======================================================== */}
      <AdminModal
        isOpen={modalProdukOpen}
        onClose={() => setModalProdukOpen(false)}
        title={editingProduk ? 'Edit Produk UMKM' : 'Tambah Produk UMKM'}
      >
        <form onSubmit={handleSaveProduk} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pilih Kelompok UMKM Pemilik *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C] bg-white font-medium"
              value={formProduk.kelompok_umkm_id}
              onChange={(e) =>
                setFormProduk({ ...formProduk, kelompok_umkm_id: e.target.value })
              }
            >
              <option value="">-- Pilih Kelompok Binaan --</option>
              {kelompokList.map((kel) => (
                <option key={kel.id} value={kel.id}>
                  {kel.nama_kelompok} ({kel.kecamatan})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Berseri juice"
                value={formProduk.nama_produk}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, nama_produk: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Produk *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: Olahan Nanas & Kuliner"
                value={formProduk.kategori}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, kategori: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: 15000"
                value={formProduk.harga}
                onChange={(e) =>
                  setFormProduk({
                    ...formProduk,
                    harga: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Keterangan Satuan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="Contoh: per Botol, per kemasan 150g"
                value={formProduk.satuan}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, satuan: e.target.value })
                }
              />
            </div>
          </div>

          {/* Upload / URL Foto Produk */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Foto Produk
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
                placeholder="https://... atau klik tombol unggah file"
                value={formProduk.foto_produk}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, foto_produk: e.target.value })
                }
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer border border-slate-300 font-semibold flex items-center gap-1.5 transition">
                <span className="material-symbols-outlined text-[16px]">
                  upload
                </span>
                <span>{uploading ? 'Mengunggah...' : 'Pilih Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'foto_produk', setFormProduk)}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#00529C]"
              placeholder="Jelaskan rasa, bahan baku, berat bersih, izin P-IRT/Halal..."
              value={formProduk.deskripsi_produk}
              onChange={(e) =>
                setFormProduk({ ...formProduk, deskripsi_produk: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formProduk.is_tersedia}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, is_tersedia: e.target.checked })
                }
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-700">
                Stok Tersedia
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formProduk.is_featured}
                onChange={(e) =>
                  setFormProduk({ ...formProduk, is_featured: e.target.checked })
                }
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-700">
                Jadikan Produk Unggulan
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalProdukOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00529C] hover:bg-[#003e75] text-white rounded-lg font-semibold shadow-xs transition"
              disabled={saving || uploading}
            >
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}


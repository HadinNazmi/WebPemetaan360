import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

export default function HeroVisiMisiPage() {
  const [formData, setFormData] = useState({
    eyebrow: 'TENTANG KAMI',
    judul_utama: 'Visi & Misi TJSL Pertamina',
    deskripsi_pengantar: '',
    visi: '',
    misi: '',
    logo_url: '',
    url_selengkapnya: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminService.getVisiMisi();
        if (res.success && res.data) {
          setFormData({
            eyebrow: res.data.eyebrow || 'TENTANG KAMI',
            judul_utama: res.data.judul_utama || '',
            deskripsi_pengantar: res.data.deskripsi_pengantar || '',
            visi: res.data.visi || '',
            misi: res.data.misi || '',
            logo_url: res.data.logo_url || '',
            url_selengkapnya: res.data.url_selengkapnya || '',
            is_active: Boolean(res.data.is_active),
          });
        }
      } catch (err) {
        console.error('Gagal memuat data visi misi:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminService.updateVisiMisi(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Data Hero & Visi Misi berhasil disimpan ke database!' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          Kelola Hero &amp; Visi Misi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Atur teks visi, butir misi keberlanjutan, dan teks pengantar yang tampil di landing page
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Editor */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        {/* Toggle Status Aktif */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-sm font-bold text-slate-800">Status Tampil di Beranda</span>
            <p className="text-xs text-slate-400 mt-0.5">Aktifkan agar seksi visi misi ini dapat dilihat publik</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00529C]"></div>
          </label>
        </div>

        {/* Input Eyebrow & Judul Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teks Kategori (Eyebrow)
            </label>
            <input
              type="text"
              name="eyebrow"
              value={formData.eyebrow}
              onChange={handleChange}
              placeholder="Contoh: TENTANG KAMI"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Utama Seksi *
            </label>
            <input
              type="text"
              name="judul_utama"
              required
              value={formData.judul_utama}
              onChange={handleChange}
              placeholder="Contoh: Visi & Misi TJSL Pertamina"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
            />
          </div>
        </div>

        {/* Deskripsi Pengantar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deskripsi Pengantar
          </label>
          <textarea
            name="deskripsi_pengantar"
            rows={3}
            value={formData.deskripsi_pengantar}
            onChange={handleChange}
            placeholder="Ringkasan pengantar visi misi CSR..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
          />
        </div>

        {/* Teks Visi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Teks Visi CSR *
          </label>
          <textarea
            name="visi"
            required
            rows={3}
            value={formData.visi}
            onChange={handleChange}
            placeholder="Menjadi pelopor keberlanjutan energi terbarukan..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
          />
        </div>

        {/* Butir-Butir Misi (Pisahkan per baris) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Butir-Butir Misi CSR (Gunakan baris baru untuk setiap butir)
          </label>
          <textarea
            name="misi"
            rows={5}
            value={formData.misi}
            onChange={handleChange}
            placeholder="1. Meningkatkan kemandirian ekonomi masyarakat pesisir&#10;2. Melindungi keanekaragaman hayati dan ekosistem mangrove&#10;3. Mendorong digitalisasi sirkularitas limbah rumah tangga"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Setiap baris akan otomatis dirender sebagai butir daftar berpoin di landing page.
          </span>
        </div>

        {/* URL Logo & Tautan Selengkapnya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Logo / Ilustrasi
            </label>
            <input
              type="text"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://... / path logo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tautan Selengkapnya
            </label>
            <input
              type="text"
              name="url_selengkapnya"
              value={formData.url_selengkapnya}
              onChange={handleChange}
              placeholder="/#visi-misi atau link luar"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


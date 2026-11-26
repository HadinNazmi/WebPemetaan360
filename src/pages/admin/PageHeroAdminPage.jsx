import React, { useState, useEffect } from 'react';
import { pageHeroService } from '../../services/pageHeroService';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function PageHeroAdminPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Muat data hero halaman
  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await pageHeroService.getAll();
      if (res?.success && res.data) {
        const list = Object.values(res.data);
        setHeroes(list);
        if (list.length > 0 && !selectedHero) {
          selectHero(list[0]);
        } else if (selectedHero) {
          const updated = list.find((h) => h.page_key === selectedHero.page_key);
          if (updated) selectHero(updated);
        }
      }
    } catch (err) {
      console.error('Gagal memuat banner hero:', err);
      setErrorMsg('Gagal memuat data banner hero dari server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const selectHero = (hero) => {
    setSelectedHero(hero);
    setTitle(hero.title || '');
    setSubtitle(hero.subtitle || '');
    setBgImage(hero.background_image || '');
    setImageFile(null);
    setImagePreview('');
    setIsDragOver(false);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('File harus berupa gambar (JPG, PNG, WEBP, dll).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 10MB.');
      return;
    }
    setErrorMsg('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHero) return;

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      let payload;
      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle || '');
        formData.append('image_file', imageFile);
        payload = formData;
      } else {
        payload = {
          title,
          subtitle: subtitle || null,
          background_image: bgImage,
        };
      }

      const res = await pageHeroService.update(selectedHero.page_key, payload);
      if (res?.success) {
        setSuccessMsg(`Hero ${selectedHero.page_name} berhasil diperbarui!`);
        await fetchHeroes();
      }
    } catch (err) {
      console.error('Gagal menyimpan hero:', err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const currentCoverUrl = imagePreview
    ? imagePreview
    : getFullImageUrl(bgImage) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-6xl">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Banner &amp; Hero Halaman
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola judul utama, subjudul, dan foto latar belakang (cover) banner di setiap halaman web.
        </p>
      </div>

      {/* Tabs Pilihan Halaman */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {loading ? (
          <div className="text-sm text-slate-400 py-2">Memuat daftar halaman...</div>
        ) : (
          heroes.map((hero) => {
            const isActive = selectedHero?.page_key === hero.page_key;
            return (
              <button
                key={hero.page_key}
                type="button"
                onClick={() => selectHero(hero)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#00529C] text-white shadow-sm shadow-blue-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {hero.page_key.includes('produk')
                    ? 'inventory_2'
                    : hero.page_key.includes('umkm')
                    ? 'storefront'
                    : 'info'}
                </span>
                <span>{hero.page_name}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Alert Notifikasi */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {selectedHero && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form Pengaturan */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00529C]">
                Edit Hero: {selectedHero.page_name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                key: {selectedHero.page_key}
              </span>
            </div>

            {/* Input Judul Utama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Judul Utama Banner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Katalog Produk UMKM Binaan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>

            {/* Input Subtitle / Eyebrow */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subjudul / Eyebrow (Teks Biru Kecil)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Program TJSL CSR Pertamina Patra Niaga Dumai"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00529C] outline-none"
              />
            </div>

            {/* Input Upload Foto Latar Belakang */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload Foto Banner Baru
              </label>
              
              <input
                id="pageHeroFileInput"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => document.getElementById('pageHeroFileInput')?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragOver
                    ? 'border-[#00529C] bg-blue-100/50 scale-[1.01] shadow-md ring-2 ring-[#00529C]/30'
                    : 'border-slate-300 hover:border-[#00529C] hover:bg-blue-50/20 bg-slate-50/50'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[32px] transition ${
                    isDragOver ? 'text-[#00529C] scale-110' : 'text-slate-400'
                  }`}
                >
                  {isDragOver ? 'file_download' : imageFile ? 'image' : 'cloud_upload'}
                </span>
                <div className="text-xs">
                  {isDragOver ? (
                    <span className="font-bold text-[#00529C] text-sm">
                      Lepaskan file foto di sini
                    </span>
                  ) : imageFile ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-emerald-600">
                        Foto dipilih: {imageFile.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Klik atau seret foto lain untuk mengganti
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800">
                        Seret &amp; lepas foto di sini, atau <span className="text-[#00529C] underline">telusuri</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Bisa diseret langsung dari File Explorer komputer Anda
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Format: JPG, PNG, WEBP. Maks 10MB. Disarankan rasio lebar (16:9).
                </span>
              </div>
            </div>

            {/* Input Alternatif: Link URL Gambar Langsung */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Atau Gunakan Link URL Gambar Latar
              </label>
              <input
                type="text"
                value={bgImage}
                onChange={(e) => {
                  setBgImage(e.target.value);
                  setImageFile(null);
                  setImagePreview('');
                }}
                placeholder="https://... atau /uploads/heroes/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00529C] outline-none font-mono text-xs"
              />
            </div>

            {/* Tombol Simpan */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#00529C] hover:bg-[#003d75] disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      save
                    </span>
                    <span>Simpan Perubahan Banner</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Kolom Kanan: Live Preview Banner Persis Tampilan Halaman */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Preview Banner Hero
            </span>

            {/* Mockup Preview Hero */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[360px] flex items-end shadow-lg border border-slate-200">
              {/* Gambar Latar */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentCoverUrl}
                  alt={title || 'Preview Hero'}
                  className="w-full h-full object-cover object-center"
                />
                {/* Dual Gradient Overlay persis komponen PageHero Pertamina */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              {/* Konten Hero */}
              <div className="relative z-10 w-full p-6 md:p-8">
                {/* Breadcrumb dummy */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-3">
                  <span>Home</span>
                  <span>/</span>
                  <span className="text-white font-semibold">{selectedHero.page_name}</span>
                </div>

                {/* Eyebrow */}
                {subtitle && (
                  <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-400 mb-1.5">
                    {subtitle}
                  </span>
                )}

                {/* Judul Besar */}
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {title || 'Judul Banner Hero'}
                </h2>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00529C] shrink-0 mt-0.5">
                visibility
              </span>
              <span>
                Pratinjau ini merefleksikan tampilan persis yang akan dilihat oleh pengunjung saat membuka halaman <strong>{selectedHero.page_name}</strong>.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

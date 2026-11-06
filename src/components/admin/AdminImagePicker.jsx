import React, { useState, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function AdminImagePicker({
  label = 'Gambar Cover / Foto',
  value = '',
  onChange,
  folder = 'general',
  helperText = 'Mendukung format JPG, PNG, WEBP (maks. 10MB)',
}) {
  const [mode, setMode] = useState(value && value.startsWith('http') && !value.includes('/uploads/') ? 'link' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WEBP, dll).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await adminService.uploadImage(file, folder);
      if (res.success && res.data?.path) {
        onChange(res.data.path);
      } else {
        setError(res.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const previewUrl = getFullImageUrl(value);

  return (
    <div className="flex flex-col gap-2">
      {/* Label & Toggle Mode Upload vs Link */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
              mode === 'upload'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File Lokal
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
              mode === 'link'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tautan / URL
          </button>
        </div>
      </div>

      {/* Mode 1: Upload File Lokal */}
      {mode === 'upload' && (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
          />

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
              uploading
                ? 'border-blue-300 bg-blue-50/50 cursor-wait'
                : 'border-slate-300 hover:border-[#00529C] hover:bg-blue-50/20 bg-slate-50/50'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] text-slate-400">
              {uploading ? 'cloud_sync' : 'add_photo_alternate'}
            </span>
            <div className="text-xs">
              {uploading ? (
                <span className="font-semibold text-[#00529C] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Sedang mengunggah file ke server...
                </span>
              ) : (
                <span className="font-semibold text-slate-700">
                  Klik untuk pilih foto dari komputer/laptop
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{helperText}</span>
          </div>
        </div>
      )}

      {/* Mode 2: Tautan / URL Luar */}
      {mode === 'link' && (
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tempelkan URL gambar (https://...)"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
          />
          <span className="text-[11px] text-slate-400">
            Gunakan opsi ini jika gambar sudah tersimpan di server luar/CDN.
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </p>
      )}

      {/* Kotak Pratinjau (Preview) jika ada gambar terpilih */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/70 border border-slate-200 mt-1">
          <img
            src={previewUrl}
            alt="Pratinjau"
            className="w-16 h-14 object-cover rounded-lg border border-slate-300 bg-white shrink-0 shadow-2xs"
            onError={(e) => {
              e.currentTarget.src = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-slate-800 block truncate">
              {value}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              {value.startsWith('/uploads/') ? 'Tersimpan di server lokal' : 'Tersimpan via URL'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Hapus / Ganti Foto"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      )}
    </div>
  );
}


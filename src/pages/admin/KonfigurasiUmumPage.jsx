import React, { useState } from 'react';

export default function KonfigurasiUmumPage() {
  const [config, setConfig] = useState({
    portal_name: 'CSR Virtual Tour 360 & Portal Keberlanjutan',
    mitra_label: 'Pertamina x Politeknik Caltex Riau',
    contact_email: 'csr.dumai@pertaminapatraniaga.com',
    hotline: '135',
    kantor_pusat: 'Jl. Medan Merdeka Timur No. 1A, Gambir, Jakarta Pusat',
    kantor_operasional: 'Unit Kilang Dumai, Kelurahan Tanjung Palas, Dumai, Riau',
    instagram_url: 'https://instagram.com/pertamina',
    youtube_url: 'https://youtube.com/@pertamina',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          Konfigurasi Umum Web
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pengaturan identitas portal, informasi kontak hotline, dan alamat operasional
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Konfigurasi umum web berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Portal
            </label>
            <input
              type="text"
              value={config.portal_name}
              onChange={(e) => setConfig({ ...config, portal_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Label Kolaborasi / Kemitraan
            </label>
            <input
              type="text"
              value={config.mitra_label}
              onChange={(e) => setConfig({ ...config, mitra_label: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Resmi CSR
            </label>
            <input
              type="email"
              value={config.contact_email}
              onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hotline Call Center
            </label>
            <input
              type="text"
              value={config.hotline}
              onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Alamat Kantor Operasional
          </label>
          <textarea
            rows={2}
            value={config.kantor_operasional}
            onChange={(e) => setConfig({ ...config, kantor_operasional: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Instagram
            </label>
            <input
              type="url"
              value={config.instagram_url}
              onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              URL YouTube
            </label>
            <input
              type="url"
              value={config.youtube_url}
              onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00529C] outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003B73] text-white text-sm font-semibold shadow-sm transition active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Simpan Konfigurasi</span>
          </button>
        </div>
      </form>
    </div>
  );
}


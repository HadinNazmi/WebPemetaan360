import React, { useEffect, useState } from 'react';
import { tjslAdminService } from '../../../services/tjslAdminService';

export default function TjslPilarPage() {
  const [pilars, setPilars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPilar() {
      try {
        const res = await tjslAdminService.getPilarList();
        if (res?.success && res.data) {
          setPilars(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat daftar pilar:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPilar();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          4 Pilar Utama TJSL Pertamina
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pedoman kerangka kerja Tanggung Jawab Sosial dan Lingkungan berstandar ISO 26000 & Permen BUMN
        </p>
      </div>

      {/* Grid Pilar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pilars.map((pilar) => (
          <div
            key={pilar.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-xs"
                    style={{ backgroundColor: pilar.warna }}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {pilar.kode === 'cerdas'
                        ? 'school'
                        : pilar.kode === 'sehat'
                        ? 'health_and_safety'
                        : pilar.kode === 'hijau'
                        ? 'eco'
                        : 'store'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{pilar.nama}</h2>
                    <span className="text-xs font-semibold text-slate-500">{pilar.bidang}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {pilar.realisasi_persen}% Tercapai
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Target Penerima:</span>
                  <span className="font-semibold text-slate-800">{pilar.target_penerima}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status Operasional:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Aktif Berkelanjutan
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Area Cakupan:</span>
                  <span className="font-medium text-slate-700">Ring 1 IT Dumai & Sungai Pakning</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                <span>Realisasi Target Program</span>
                <span className="font-bold text-slate-800">{pilar.realisasi_persen}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pilar.realisasi_persen}%`,
                    backgroundColor: pilar.warna,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


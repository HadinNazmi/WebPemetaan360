import React, { useEffect, useState } from 'react';
import { tjslAdminService } from '../../../services/tjslAdminService';

export default function TjslLaporanPage() {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLaporan() {
      try {
        const res = await tjslAdminService.getLaporan();
        if (res?.success && res.data) {
          setLaporanList(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat laporan TJSL:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLaporan();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Laporan Akuntabilitas Dampak Sosial & SROI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pengukuran dampak berbasis Social Return on Investment (SROI) dan kepatuhan ISO 26000 Social Responsibility
        </p>
      </div>

      {/* Ringkasan Skor SROI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00529C] to-[#003366] text-white shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Rasio SROI Terkini (2026)
            </span>
            <div className="text-3xl font-extrabold mt-2 tracking-tight">
              1 : 3.84
            </div>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Setiap Rp 1,- investasi dana TJSL menghasilkan dampak sosial & ekonomi senilai Rp 3,84 bagi komunitas Ring 1.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center gap-2 text-[11px] text-blue-200">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Tervalidasi Lembaga Independen SROI</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Standar ISO 26000
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              7 Subjek Inti
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Tata kelola organisasi, HAM, ketenagakerjaan, lingkungan, operasional yang adil, konsumen, dan keterlibatan komunitas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>100% Selaras Pedoman BUMN</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status Proper KLHK
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              Kandidat Emas
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Pemberdayaan terintegrasi inovasi lingkungan sirkularitas jelantah SiMinah & mitigasi kebencanaan gambut.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Periode Audit 2026/2027</span>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Laporan SROI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Daftar Dokumen Audit & Akuntabilitas TJSL
          </h2>
          <span className="text-xs text-slate-500">
            Total: {laporanList.length} Berkas Laporan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Periode</th>
                <th className="py-3 px-6">Nama Dokumen Laporan</th>
                <th className="py-3 px-6">Rasio SROI</th>
                <th className="py-3 px-6">Standar Acuan</th>
                <th className="py-3 px-6">Tanggal Terbit</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat data dokumen...
                  </td>
                </tr>
              ) : (
                laporanList.map((lap) => (
                  <tr key={lap.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {lap.periode}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#00529C] hover:underline cursor-pointer">
                        {lap.judul}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {lap.skor_sroi}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {lap.standar}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {lap.tanggal_terbit}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                        {lap.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tjslAdminService } from '../../../services/tjslAdminService';
import AdminStatCard from '../../../components/admin/AdminStatCard';

export default function TjslDashboardOverviewPage() {
  const [stats, setStats] = useState({
    total_program_tjsl: 0,
    program_tjsl_aktif: 0,
    total_penyaluran_bantuan: 0,
    bantuan_tervalidasi: 0,
    indeks_sroi: 3.84,
    pilar_terbanyak: 'Pertamina Berdikari & Hijau',
    capaian_realisasi: '94.6%',
  });
  const [pilars, setPilars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, pilarRes] = await Promise.all([
          tjslAdminService.getDashboardStats(),
          tjslAdminService.getPilarList(),
        ]);

        if (statsRes?.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (pilarRes?.success && pilarRes.data) {
          setPilars(pilarRes.data);
        }
      } catch (err) {
        console.warn('Gagal memuat statistik TJSL:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Header Ringkasan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#ED1B24]/10 text-[#ED1B24] border border-[#ED1B24]/20 uppercase tracking-wider">
              Portal Tanggung Jawab Sosial & Lingkungan
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Dashboard Manajemen TJSL
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau dan kelola 4 pilar program, penyaluran bantuan komunitas, dan skor akuntabilitas SROI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/tjsl/program"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00529C] text-white text-xs font-semibold shadow-sm hover:bg-[#003B73] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Tambah Inisiatif TJSL</span>
          </Link>
          <Link
            to="/admin/tjsl/bantuan"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            <span>Penyaluran Bantuan</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Kartu Statistik Khusus TJSL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Inisiatif Program TJSL"
          value={`${stats.total_program_tjsl} Program`}
          icon="verified"
          badge={`${stats.program_tjsl_aktif} Aktif`}
          badgeColor="bg-blue-50 text-blue-700"
          subText="Showcase 4 Pilar"
        />
        <AdminStatCard
          title="Penyaluran Bantuan"
          value={`${stats.total_penyaluran_bantuan} Agenda`}
          icon="volunteer_activism"
          badge={`${stats.bantuan_tervalidasi} Tervalidasi`}
          badgeColor="bg-emerald-50 text-emerald-700"
          subText="Bantuan Masyarakat"
        />
        <AdminStatCard
          title="Indeks Dampak SROI"
          value={`1 : ${stats.indeks_sroi}`}
          icon="trending_up"
          badge="Sangat Signifikan"
          badgeColor="bg-amber-50 text-amber-700"
          subText="ISO 26000 Social Return"
        />
        <AdminStatCard
          title="Capaian Realisasi"
          value={stats.capaian_realisasi}
          icon="donut_large"
          badge="Target Ring 1"
          badgeColor="bg-slate-100 text-slate-700"
          subText="Tahun Berjalan 2026"
        />
      </div>

      {/* 3. 4 Pilar Utama TJSL Showcase */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Progres 4 Pilar Utama TJSL Pertamina
            </h2>
            <p className="text-xs text-slate-500">
              Klasifikasi pilar operasional pemberdayaan masyarakat terukur
            </p>
          </div>
          <Link
            to="/admin/tjsl/pilar"
            className="text-xs font-semibold text-[#00529C] hover:underline flex items-center gap-1"
          >
            <span>Detail Pilar</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pilars.map((pilar) => (
            <div
              key={pilar.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-xs"
                    style={{ backgroundColor: pilar.warna }}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {pilar.kode === 'cerdas'
                        ? 'school'
                        : pilar.kode === 'sehat'
                        ? 'health_and_safety'
                        : pilar.kode === 'hijau'
                        ? 'eco'
                        : 'store'}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {pilar.realisasi_persen}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{pilar.nama}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {pilar.bidang}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                  <span>Penerima Manfaat</span>
                  <span className="font-semibold text-slate-700">{pilar.target_penerima}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
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

      {/* 4. Panel Pintasan Navigasi Cepat TJSL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box 1: Program Kerja */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#00529C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Program Kerja TJSL</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kelola daftar program unggulan pada 4 pilar, ringkasan dampak, dokumentasi foto, dan lokasi desa binaan.
              </p>
            </div>
          </div>
          <Link
            to="/admin/tjsl/program"
            className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Buka Program Kerja</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Box 2: Penyaluran Bantuan */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Penyaluran Bantuan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Catat dan tampilkan agenda bantuan sarana pendidikan, renovasi fasilitas kesehatan, dan sanitasi warga.
              </p>
            </div>
          </div>
          <Link
            to="/admin/tjsl/bantuan"
            className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Buka Bantuan TJSL</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Box 3: Laporan SROI */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">assessment</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Laporan SROI & ISO 26000</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tinjau indikator Social Return on Investment, keselarasan regulasi BUMN, dan audit akuntabilitas TJSL.
              </p>
            </div>
          </div>
          <Link
            to="/admin/tjsl/laporan"
            className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Buka Laporan SROI</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


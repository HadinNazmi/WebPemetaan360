import React from 'react';

export default function TjslProfilPage() {
  const regulasiList = [
    {
      judul: 'Undang-Undang No. 40 Tahun 2007',
      tentang: 'Perseroan Terbatas (Pasal 74 Kewajiban TJSL BUMN & Swasta)',
      nomor: 'UU 40/2007',
      status: 'Berlaku Penuh',
    },
    {
      judul: 'Peraturan Menteri BUMN No. PER-05/MBU/04/2021',
      tentang: 'Program Tanggung Jawab Sosial dan Lingkungan Badan Usaha Milik Negara',
      nomor: 'PER-05/MBU/04/2021',
      status: 'Pedoman Operasional',
    },
    {
      judul: 'ISO 26000:2010 Guidance on Social Responsibility',
      tentang: 'Standar Internasional Tanggung Jawab Sosial Terintegrasi',
      nomor: 'ISO 26000',
      status: 'Standar Mutu Global',
    },
    {
      judul: 'Permen LHK No. 1 Tahun 2021',
      tentang: 'Program Penilaian Peringkat Kinerja Perusahaan (PROPER)',
      nomor: 'Permen LHK 1/2021',
      status: 'Kriteria Emas & Hijau',
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profil Regulasi & Tata Kelola TJSL
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Landasan hukum dan prinsip tata kelola program Tanggung Jawab Sosial dan Lingkungan PT Pertamina Patra Niaga
        </p>
      </div>

      {/* Box Profil Unit TJSL */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#00529C] text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[40px]">shield</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#00529C] border border-blue-200">
              Unit Kerja Resmi
            </span>
            <span className="text-xs text-slate-400">Regional Sumbagut</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Tim TJSL Integrated Terminal Dumai & Sungai Pakning
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Unit pelaksana program Tanggung Jawab Sosial dan Lingkungan yang berfokus pada pemberdayaan masyarakat ring 1 kilang, konservasi lingkungan gambut dan mangrove, serta inkubasi kemandirian UMKM lokal.
          </p>
        </div>
      </div>

      {/* Grid Regulasi Payung Hukum */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#00529C]">gavel</span>
          <span>Daftar Regulasi & Kebijakan Acuan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regulasiList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#00529C] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {item.nomor}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.judul}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{item.tentang}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


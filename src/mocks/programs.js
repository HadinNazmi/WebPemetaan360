// Mock data program CSR sesuai PRD Bagian 2.5
// Menggunakan URL placeholder yang diberikan user
const DEFAULT_HERO_IMAGE = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export const mockShowcasePrograms = [
  {
    id: 1,
    slug: 'ppid',
    href: '/program/ppid',
    target: '_self',
    judul_program: 'Layanan Informasi Publik (PPID)',
    kategori: 'PROFIL PPID',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-ppid.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
    page_title: 'PPID',
    sub_title: 'Keterbukaan Informasi Publik',
    konten_lengkap: `
      <p>Pertamina berkomitmen pada Keterbukaan Informasi Publik yang diamanatkan dalam Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.</p>
      <p>Melalui surat keputusan Direktur Utama PT Pertamina (Persero) No. Kpts-07/C00000/2025-S0, tanggal 15 Mei 2025, tentang Pejabat Pengelola Layanan Informasi Publik Pertamina, Susunan Struktur Organisasi di PT Pertamina (Persero) sebagai berikut:</p>
      <ol class="list-decimal pl-5 space-y-2 text-slate-700 my-4">
        <li><strong>Corporate Secretary PT Pertamina (Persero)</strong> sebagai Atasan Pejabat Pengelola Informasi dan Dokumentasi (Atasan PPID)</li>
        <li><strong>Vice President Corporate Communication PT Pertamina (Persero)</strong> sebagai Pejabat Pengelola Informasi dan Dokumentasi (PPID)</li>
        <li><strong>Manager Media Communication PT Pertamina (Persero)</strong> sebagai PPID Pelaksana</li>
      </ol>
      <p>Sebagai Badan Publik, Pertamina berkomitmen terhadap keterbukaan informasi publik, mengacu kepada Peraturan Komisi Informasi Pusat RI No. 1 Tahun 2021 Tentang Standard Layanan Informasi Publik. Dalam pelaksanaannya, Pertamina telah terintegrasi dengan PPID seluruh Subholding dan Anak Perusahaan Pertamina Group, sesuai keputusan pimpinan tertinggi Badan Publik Pertamina. Diantaranya PPID Subholding PT Pertamina Hulu Energi, PT Pertamina International Shipping, PT Kilang Pertamina Internasional, PT Pertamina Power Indonesia, PT Pertamina Gas Negara, PT Pertamina Patra Niaga dan anak perusahaan services Pertamina.</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Daftar Informasi Publik</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-slate-900 text-sm">Informasi Wajib Diumumkan Berkala</h4>
          <p class="text-slate-600 text-sm mt-1">Informasi wajib diumumkan berkala merupakan Informasi Publik yang wajib diumumkan secara rutin, teratur dan dalam jangka waktu tertentu.</p>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">Informasi Wajib Diumumkan Serta Merta</h4>
          <p class="text-slate-600 text-sm mt-1">Informasi wajib diumumkan serta merta merupakan informasi publik yang wajib diumumkan secara spontan pada saat itu juga, yang bila tidak diumumkan akan mengancam hajat hidup orang banyak dan ketertiban umum.</p>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">Informasi Wajib Tersedia Setiap Saat</h4>
          <p class="text-slate-600 text-sm mt-1">Informasi wajib tersedia setiap saat merupakan informasi yang bersifat terbuka, dan wajib disediakan ketika ada permintaan.</p>
        </div>
      </div>
    `,
    metadata: [
      {
        label: 'Alamat',
        value: 'PPID PT Pertamina (Persero)\nKantor Pusat Pertamina\nJl. Medan Merdeka Timur No. 1A\nGambir Jakarta Pusat',
      },
      {
        label: 'Telp',
        value: '135',
        isPhone: true,
      },
      {
        label: 'Email',
        value: 'infopublik@pertamina.com',
        isEmail: true,
      },
      {
        label: 'Website',
        value: 'https://www.pertamina.com/ppid',
        href: 'https://www.pertamina.com/ppid',
      },
    ],
  },
  {
    id: 2,
    slug: 'harga-bbm',
    href: 'https://mypertamina.id/about/product-price',
    target: '_blank',
    judul_program: 'Harga BBM Pertamina',
    kategori: 'INFORMASI',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-bbm.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
  },
  {
    id: 3,
    slug: 'tata-kelola-perseroan',
    href: '/program/tata-kelola-perseroan',
    target: '_self',
    judul_program: 'Tata Kelola Perseroan',
    kategori: 'GCG',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-gcg.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
    page_title: 'Tata Kelola Perseroan',
    sub_title: 'Good Corporate Governance (GCG)',
    konten_lengkap: `
      <p>PT Pertamina Patra Niaga berkomitmen menerapkan prinsip-prinsip Good Corporate Governance (GCG) yaitu Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Kewajaran dalam setiap proses bisnis dan pengambilan keputusan operasional.</p>
      <p>Penerapan tata kelola yang kuat menjadi landasan bagi perseroan dalam menjaga integritas, memperkuat kepatuhan terhadap perundang-undangan, serta memaksimalkan nilai tambah jangka panjang bagi pemangku kepentingan.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Pilar Utama Tata Kelola</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-700">
        <li>Sistem Manajemen Anti Penyuapan (SMAP) berbasis ISO 37001</li>
        <li>Kepatuhan Pelaporan LHKPN Pejabat Wajib Lapor</li>
        <li>Whistleblowing System (WBS) yang terintegrasi dan aman</li>
      </ul>
    `,
    metadata: [
      {
        label: 'Unit Pengelola',
        value: 'Fungsi Compliance & Governance PT Pertamina Patra Niaga',
      },
      {
        label: 'Layanan Pengaduan (WBS)',
        value: 'pertaminaclean@pertamina.com',
        isEmail: true,
      },
      {
        label: 'Website WBS',
        value: 'https://pertaminaclean.tipoffs.info',
        href: 'https://pertaminaclean.tipoffs.info',
      },
    ],
  },
  {
    id: 4,
    slug: 'program-mundam',
    href: '/program/program-mundam',
    target: '_self',
    judul_program: 'Program Kampung Mundam Berdikari',
    kategori: 'PEMBERDAYAAN CSR',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    fallbackImg: DEFAULT_HERO_IMAGE,
    page_title: 'Program Kampung Mundam',
    sub_title: 'Pemberdayaan Masyarakat & Ekonomi Sirkular',
    konten_lengkap: `
      <p>Program Kampung Mundam Berdikari merupakan program Tanggung Jawab Sosial dan Lingkungan (TJSL) unggulan PT Pertamina Patra Niaga yang berfokus pada kemandirian ekonomi masyarakat pesisir melalui budidaya perikanan, pengolahan hasil mangrove, dan integrasi sirkularitas minyak jelantah.</p>
      <p>Program ini berhasil menggerakkan puluhan kelompok usaha bersama nelayan dan kelompok wanita tani, meningkatkan taraf pendapatan keluarga hingga 35%, serta memulihkan ekosistem pesisir seluas 12 hektar.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Fokus Kegiatan & Capaian</h3>
      <ol class="list-decimal pl-5 space-y-2 text-slate-700">
        <li><strong>Pengembangan UMKM Olahan Pesisir:</strong> Pelatihan pengolahan sirup mangrove dan keripik ikan dengan legalitas P-IRT dan Sertifikasi Halal.</li>
        <li><strong>Bank Jelantah Komunitas:</strong> Edukasi pengumpulan minyak jelantah rumah tangga yang ditukar menjadi saldo tabungan emas dan sembako.</li>
        <li><strong>Fasilitas Air Bersih Mandiri:</strong> Pemasangan instalasi desalinasi dan filter air bersih berbasis panel surya ramah lingkungan.</li>
      </ol>
    `,
    metadata: [
      {
        label: 'Lokasi Wilayah',
        value: 'Kelurahan Mundam, Kecamatan Medang Kampai, Kota Dumai, Riau',
      },
      {
        label: 'Kelompok Sasaran',
        value: 'Kelompok Tani Pesisir Berdikari & Kelompok Wanita Nelayan Mandiri',
      },
      {
        label: 'Kontak Officer CSR',
        value: 'csr.dumai@pertaminapatraniaga.com',
        isEmail: true,
      },
      {
        label: 'Hotline Layanan',
        value: '135',
        isPhone: true,
      },
    ],
  },
];


export const mockCsrAidPrograms = [
  {
    id: 1,
    title: 'Bantuan Pendidikan',
    desc: 'Penyaluran beasiswa berprestasi, renovasi ruang kelas sekolah dasar, serta pengadaan buku literasi dan perangkat komputer di wilayah sekitar operasi.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
  {
    id: 2,
    title: 'Bantuan Kesehatan',
    desc: 'Layanan pengobatan gratis keliling, program penurunan stunting anak usia dini, dan pemberian makanan tambahan gizi seimbang serta sarana posyandu.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
  {
    id: 3,
    title: 'Sarana Air Bersih (APO)',
    desc: 'Pembangunan instalasi filtrasi air bersih, pengeboran sumur air tawar, serta jaringan pipa mandiri bagi ratusan kepala keluarga pesisir.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
  {
    id: 4,
    title: 'Pemberdayaan UMKM',
    desc: 'Bantuan alat produksi bagi kelompok usaha wanita nelayan, pendampingan sertifikasi halal dan izin edar, serta akses pameran produk lokal.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
  {
    id: 5,
    title: 'Pelestarian Mangrove',
    desc: 'Penyaluran bibit mangrove unggul, pembuatan tanggul pemecah ombak ramah lingkungan, dan sarana penunjang kelompok tani hutan mangrove pesisir.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
  {
    id: 6,
    title: 'Tanggap Bencana & Sembako',
    desc: 'Distribusi bantuan sembako berkala untuk masyarakat pra-sejahtera dan respon cepat tanggap darurat logistik bagi wilayah terdampak musibah.',
    gambar_cover: DEFAULT_HERO_IMAGE,
  },
];

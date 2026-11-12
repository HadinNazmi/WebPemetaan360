// Mock data Program CSR Showcase Slider
const DEFAULT_HERO_IMAGE = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';
const PLACEHOLDER_IMG = DEFAULT_HERO_IMAGE;

export const mockShowcasePrograms = [
  {
    id: 1,
    slug: 'ppid',
    href: '/program/ppid',
    target: '_self',
    title: 'Layanan Informasi Publik (PPID)',
    judul_program: 'Layanan Informasi Publik (PPID)',
    category: 'PROFIL PPID',
    kategori: 'PROFIL PPID',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
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
      <p>Sebagai Badan Publik, Pertamina berkomitmen terhadap keterbukaan informasi publik, mengacu kepada Peraturan Komisi Informasi Pusat RI No. 1 Tahun 2021 Tentang Standard Layanan Informasi Publik. Dalam pelaksanaannya, Pertamina telah terintegrasi dengan PPID seluruh Subholding dan Anak Perusahaan Pertamina Group.</p>
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
    slug: 'harga-bbm-pertamina',
    href: '/program/harga-bbm-pertamina',
    target: '_self',
    title: 'Harga BBM Pertamina',
    judul_program: 'Harga BBM Pertamina',
    category: 'INFORMASI',
    kategori: 'INFORMASI',
    img: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    fallbackImg: PLACEHOLDER_IMG,
    page_title: 'Harga BBM Pertamina',
    sub_title: 'Informasi Penyesuaian Harga',
    konten_lengkap: '<p>Informasi berkala mengenai penyesuaian harga bahan bakar minyak nonsubsidi.</p>',
    metadata: [
      { label: 'Hotline', value: '135', isPhone: true },
    ],
  },
  {
    id: 3,
    slug: 'tata-kelola-perseroan',
    href: '/program/tata-kelola-perseroan',
    target: '_self',
    title: 'Tata Kelola Perseroan',
    judul_program: 'Tata Kelola Perseroan',
    category: 'GCG',
    kategori: 'GCG',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-gcg.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
    page_title: 'Tata Kelola Perseroan',
    sub_title: 'Good Corporate Governance (GCG)',
    konten_lengkap: `
      <p>PT Pertamina Patra Niaga berkomitmen menerapkan prinsip-prinsip Good Corporate Governance (GCG) yaitu Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Kewajaran dalam setiap proses bisnis dan pengambilan keputusan operasional.</p>
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
    ],
  },
  {
    id: 4,
    slug: 'program-mundam',
    href: '/program/program-mundam',
    target: '_self',
    title: 'Program Kampung Mundam Berdikari',
    judul_program: 'Program Kampung Mundam Berdikari',
    category: 'PEMBERDAYAAN CSR',
    kategori: 'PEMBERDAYAAN CSR',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    fallbackImg: DEFAULT_HERO_IMAGE,
    page_title: 'Program Kampung Mundam',
    sub_title: 'Pemberdayaan Masyarakat & Ekonomi Sirkular',
    konten_lengkap: `
      <p>Program Kampung Mundam Berdikari merupakan program Tanggung Jawab Sosial dan Lingkungan (TJSL) unggulan PT Pertamina Patra Niaga yang berfokus pada kemandirian ekonomi masyarakat pesisir.</p>
    `,
    metadata: [
      {
        label: 'Lokasi Wilayah',
        value: 'Kelurahan Mundam, Kecamatan Medang Kampai, Kota Dumai, Riau',
      },
    ],
  },
];

export const mockCsrAidPrograms = [
  {
    id: 1,
    title: 'Bantuan Pendidikan',
    desc: 'Penyaluran beasiswa berprestasi, renovasi ruang kelas sekolah dasar, serta pengadaan buku literasi dan perangkat komputer di wilayah sekitar operasi.',
    gambar_cover: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Bantuan Kesehatan',
    desc: 'Layanan pengobatan gratis keliling, program penurunan stunting anak usia dini, dan pemberian makanan tambahan gizi seimbang serta sarana posyandu.',
    gambar_cover: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Sarana Air Bersih (APO)',
    desc: 'Pembangunan instalasi filtrasi air bersih, pengeboran sumur air tawar, serta jaringan pipa mandiri bagi ratusan kepala keluarga pesisir.',
    gambar_cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Pemberdayaan UMKM',
    desc: 'Bantuan alat produksi bagi kelompok usaha wanita nelayan, pendampingan sertifikasi halal dan izin edar, serta akses pameran produk lokal.',
    gambar_cover: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Pelestarian Mangrove',
    desc: 'Penyaluran bibit mangrove unggul, pembuatan tanggul pemecah ombak ramah lingkungan, dan sarana penunjang kelompok tani hutan mangrove pesisir.',
    gambar_cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Tanggap Bencana & Sembako',
    desc: 'Distribusi bantuan sembako berkala untuk masyarakat pra-sejahtera dan respon cepat tanggap darurat logistik bagi wilayah terdampak musibah.',
    gambar_cover: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  },
];

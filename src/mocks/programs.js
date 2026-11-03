// Mock data program CSR sesuai PRD Bagian 2.5
// Menggunakan URL placeholder yang diberikan user
const DEFAULT_HERO_IMAGE = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

export const mockShowcasePrograms = [
  {
    id: 1,
    slug: 'ppid',
    href: 'https://www.pertamina.com/ppid',
    target: '_self',
    judul_program: 'Layanan Informasi Publik',
    kategori: 'PROFIL PPID',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-ppid.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
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
    href: '/tata-kelola-perseroan',
    target: '_self',
    judul_program: 'Tata Kelola Perseroan',
    kategori: 'GCG',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-gcg.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
  },
  {
    id: 4,
    slug: 'recruitment',
    href: 'https://recruitment.pertamina.com/',
    target: '_blank',
    judul_program: 'Menjadi Perwira Pertamina',
    kategori: 'REKRUTMEN',
    banner: 'https://www.pertamina.com/file/files/2025/05/banner-recruitment.webp',
    fallbackImg: DEFAULT_HERO_IMAGE,
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

import { apiClient } from './api';
import { getFullImageUrl } from '../utils/imageUrl';
import { mockImpactMetrics } from '../mocks/impactMetrics';
import { mockShowcasePrograms } from '../mocks/programs';
import { mockArticles } from '../mocks/articles';

const DEFAULT_HERO_IMAGE = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

const mockBantuanData = [
  {
    id: 1,
    title: 'Bantuan Sarana Fasilitas Komunitas Lingkungan',
    desc: 'Penyaluran sarana prasarana pengolahan limbah dan tong pemilahan sampah organik untuk mendukung lingkungan hijau dan sehat di kawasan pesisir.',
    gambar_cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Bantuan Perlengkapan UMKM Kuliner Ramah Lingkungan',
    desc: 'Fasilitasi wadah jeriken penampungan sedekah jelantah dan alat produksi higienis bagi puluhan pelaku UMKM binaan sirkularitas SiMinah.',
    gambar_cover: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Bantuan Pendidikan & Pelatihan Kejuruan Generasi Muda',
    desc: 'Beasiswa sertifikasi dan pelatihan teknologi terapan hasil kerja sama Pertamina Patra Niaga bersama institusi vokasi Politeknik Caltex Riau.',
    gambar_cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
];

const mockSistemData = [
  {
    id: 1,
    kode_sistem: 'siminah',
    slug: 'siminah',
    nama_sistem: 'SiMinah',
    badge_label: 'SIRKULARITAS MINYAK JELANTAH',
    deskripsi: 'Sistem Informasi Pengelolaan Minyak Jelantah Berbasis Komunitas dan Digitalisasi Bank Sampah.',
    gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
    deskripsi_lengkap: `SiMinah (Sistem Informasi Minyak Jelantah) merupakan platform digital inovatif hasil kolaborasi CSR PT Pertamina Patra Niaga bersama Politeknik Caltex Riau.\n\nPlatform ini memfasilitasi sirkularitas ekonomi limbah minyak jelantah dari rumah tangga, pelaku UMKM kuliner, dan komunitas masyarakat pesisir di sekitar wilayah operasi Dumai. Melalui aplikasi SiMinah, masyarakat dapat mendaftarkan diri sebagai donatur, memantau jadwal penjemputan jeriken jelantah secara terjadwal, dan mengonversi sedekah jelantah menjadi tabungan lingkungan atau insentif bernilai ekonomis.\n\nMinyak jelantah yang terkumpul disalurkan secara bertanggung jawab ke rantai pasok industri pengolahan energi terbarukan (biofuel/biodiesel), sekaligus mencegah pencemaran saluran air tanah dan ekosistem perairan pesisir.`,
    url_portal: 'https://siminah.id',
    fitur_keunggulan: [
      'Pencatatan Donatur & Bank Jelantah Digital',
      'Tracking Logistik Penjemputan Jeriken Real-Time',
      'Konversi Saldo Sedekah & Tabungan Komunitas',
      'Kalkulator Reduksi Emisi Karbon Lingkungan',
    ],
    logo_url: '/images/logocsr.jpeg',
    metrik: [
      { nama_metrik: 'Donatur Terdaftar', nilai: '1.450+', satuan: 'Donatur' },
      { nama_metrik: 'Jelantah Tertampung', nilai: '28,5', satuan: 'Ton' },
    ],
  },
  {
    id: 2,
    kode_sistem: 'simon_plus',
    slug: 'simon_plus',
    nama_sistem: 'Simon+',
    badge_label: 'MONITORING & EVALUASI TJSL',
    deskripsi: 'Sistem Monitoring dan Evaluasi Kinerja Ketercapaian Program CSR Terpadu.',
    gambar_cover: 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
    deskripsi_lengkap: `Simon+ (Sistem Monitoring dan Evaluasi CSR) adalah platform terintegrasi manajemen program Tanggung Jawab Sosial dan Lingkungan (TJSL) PT Pertamina Patra Niaga.\n\nSistem ini dirancang bersama Politeknik Caltex Riau untuk menyajikan transparansi data, memantau indikator capaian Social Return on Investment (SROI), serta mengukur efektivitas intervensi program pemberdayaan masyarakat di berbagai pilar (Pendidikan, Kesehatan, Lingkungan, dan Kemandirian Ekonomi).\n\nSimon+ memudahkan seluruh pemangku kepentingan dalam memvalidasi penerima manfaat, merekam progres fisik dan keuangan bantuan, serta menghasilkan laporan akuntabilitas keberlanjutan yang sesuai dengan standar ISO 26000 dan target SDGs.`,
    url_portal: 'https://simonplus.pertamina.com',
    fitur_keunggulan: [
      'Dashboard Executive Ketercapaian SDGs & ESG',
      'Kalkulasi Skor Dampak & SROI Terotomasi',
      'Verifikasi Multi-Layer Penerima Manfaat',
      'Ekspor Laporan Kinerja TJSL Standar ISO 26000',
    ],
    logo_url: '/images/Logo Pertamina Patra Niaga Horizontal.png',
    metrik: [
      { nama_metrik: 'Penerima Manfaat', nilai: '8.450+', satuan: 'Jiwa' },
      { nama_metrik: 'Desa Binaan', nilai: '14', satuan: 'Wilayah' },
    ],
  },
];

function normalizeProgram(p) {
  if (!p) return null;
  const imageSource = getFullImageUrl(p.gambar_cover) || p.banner || p.img || DEFAULT_HERO_IMAGE;
  return {
    id: p.id,
    slug: p.slug,
    href: p.link_eksternal || p.href || `/program/${p.slug}`,
    target: p.link_eksternal || p.target === '_blank' ? '_blank' : '_self',
    judul_program: p.nama_program || p.judul_program || p.title,
    kategori: p.pilar_kategori || p.kategori || p.category,
    banner: imageSource,
    fallbackImg: imageSource,
    page_title: p.nama_program || p.page_title || p.title,
    sub_title: p.pilar_kategori || p.sub_title || p.category,
    konten_lengkap: p.deskripsi_lengkap || p.konten_lengkap || '',
    ringkasan: p.ringkasan || '',
    metadata: Array.isArray(p.metadata) && p.metadata.length > 0
      ? p.metadata
      : [
          ...(p.lokasi ? [{ label: 'Lokasi Wilayah', value: p.lokasi }] : []),
          ...(p.link_eksternal ? [{ label: 'Tautan Resmi', value: p.link_eksternal }] : []),
        ],
  };
}

export const programService = {
  // 1. Ambil metrik dampak SiMinah & Simon+ dari database (fallback dummy jika DB kosong)
  async getImpactMetrics() {
    try {
      const response = await apiClient.get('/metrik-dampak');
      const resData = response.data?.data;
      const list = resData?.metrik_list || (Array.isArray(resData) ? resData : []);

      // JIKA DI DATABASE SUDAH ADA DATA (SETIDAKNYA 1 RECORD):
      // Langsung gunakan data murni database, SEMUA DUMMY TERTIMPA
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map((m) => ({
          id: m.id,
          nama_metrik: m.nama_metrik,
          kategori: m.kategori_label || m.kategori || m.nama_metrik?.toUpperCase(),
          nilai_angka: parseFloat(m.nilai_cached ?? m.nilai_angka ?? 0),
          satuan: m.satuan || '',
          sub_satuan: m.sub_satuan || null,
          suffix: m.suffix || '',
          format_angka: m.format_angka || 'integer',
          deskripsi: m.deskripsi || '',
          urutan: m.urutan || 0,
        }));
        return { success: true, data: normalized, isDummy: false };
      }

      // JIKA DATABASE MASIH KOSONG:
      // Gunakan dummy SiMinah & Simon+ sementara
      return { success: true, data: mockImpactMetrics, isDummy: true };
    } catch (error) {
      console.warn('DB metrik-dampak kosong/offline, fallback ke dummy:', error);
      return { success: true, data: mockImpactMetrics, isDummy: true };
    }
  },

  // 2. Ambil program showcase dari database (fallback dummy jika DB kosong)
  async getShowcasePrograms() {
    try {
      const response = await apiClient.get('/program');
      const list = response.data?.data || [];

      // JIKA DI DATABASE SUDAH ADA DATA:
      // Langsung gunakan data murni database, SEMUA DUMMY TERTIMPA
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map(normalizeProgram);
        return { success: true, data: normalized, isDummy: false };
      }

      // JIKA DATABASE MASIH KOSONG:
      return { success: true, data: mockShowcasePrograms.map(normalizeProgram), isDummy: true };
    } catch (error) {
      console.warn('DB program kosong/offline, fallback ke dummy:', error);
      return { success: true, data: mockShowcasePrograms.map(normalizeProgram), isDummy: true };
    }
  },

  // 3. Ambil detail program berdasarkan slug (database utama, fallback dummy)
  async getProgramBySlug(slug) {
    try {
      const response = await apiClient.get(`/program/${slug}`);
      if (response.data?.success && response.data?.data) {
        return { success: true, data: normalizeProgram(response.data.data), isDummy: false };
      }
      
      // Fallback dummy jika tidak ada di DB
      const dummyMatch = mockShowcasePrograms.find((p) => p.slug === slug);
      if (dummyMatch) {
        return { success: true, data: normalizeProgram(dummyMatch), isDummy: true };
      }

      return {
        success: false,
        data: null,
        message: response.data?.message || 'Program tidak ditemukan.',
      };
    } catch (error) {
      const dummyMatch = mockShowcasePrograms.find((p) => p.slug === slug);
      if (dummyMatch) {
        return { success: true, data: normalizeProgram(dummyMatch), isDummy: true };
      }
      return { success: false, data: null, error: error.message };
    }
  },

  // 4. Ambil kartu bantuan CSR dari database (fallback dummy jika DB kosong)
  async getCsrAidPrograms() {
    try {
      const response = await apiClient.get('/bantuan');
      const list = response.data?.data || [];

      // JIKA DI DATABASE SUDAH ADA DATA:
      // Langsung gunakan data murni database, SEMUA DUMMY TERTIMPA
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map((b) => ({
          id: b.id,
          title: b.judul_bantuan || b.title,
          desc: b.penjelasan_bantuan || b.desc,
          gambar_cover: getFullImageUrl(b.gambar_cover) || DEFAULT_HERO_IMAGE,
        }));
        return { success: true, data: normalized, isDummy: false };
      }

      // JIKA DATABASE MASIH KOSONG:
      return { success: true, data: mockBantuanData, isDummy: true };
    } catch (error) {
      return { success: true, data: mockBantuanData, isDummy: true };
    }
  },

  // 5. Ambil artikel berita dari database (fallback dummy jika DB kosong)
  async getArticles() {
    try {
      const response = await apiClient.get('/artikel');
      const list = response.data?.data || [];

      // JIKA DI DATABASE SUDAH ADA DATA:
      // Langsung gunakan data murni database, SEMUA DUMMY TERTIMPA
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map((a) => ({
          id: a.id,
          featured: Boolean(a.is_featured ?? a.featured),
          tipe: 'news',
          kategori_tag: a.kategori_tag || 'SIARAN PERS',
          kategori_filter: 'all',
          judul: a.judul_artikel || a.judul,
          slug: a.slug || `artikel-${a.id}`,
          gambar: getFullImageUrl(a.gambar_cover) || DEFAULT_HERO_IMAGE,
          fallbackImg: DEFAULT_HERO_IMAGE,
          published_at: a.tanggal_publikasi
            ? new Date(a.tanggal_publikasi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : (a.published_at || 'Terbaru'),
          url: a.url_media || a.url || '#',
        }));
        return { success: true, data: normalized, isDummy: false };
      }

      // JIKA DATABASE MASIH KOSONG:
      return { success: true, data: mockArticles, isDummy: true };
    } catch (error) {
      return { success: true, data: mockArticles, isDummy: true };
    }
  },

  // 6. Ambil data Visi & Misi CSR dari database
  async getVisiMisi() {
    try {
      const response = await apiClient.get('/visi-misi');
      return response.data;
    } catch (error) {
      console.error('Error mengambil visi misi dari database:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // 7. Ambil daftar Sistem CSR (SiMinah & Simon+) dari database
  async getSistemList() {
    try {
      const response = await apiClient.get('/sistem-csr');
      const list = response.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return { success: true, data: list, isDummy: false };
      }
      return { success: true, data: mockSistemData, isDummy: true };
    } catch (error) {
      return { success: true, data: mockSistemData, isDummy: true };
    }
  },

  // 8. Ambil detail Sistem CSR berdasarkan slug/kode_sistem
  async getSistemDetail(slug) {
    try {
      const response = await apiClient.get(`/sistem-csr/${slug}`);
      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data, isDummy: false };
      }
      const normalizedSlug = slug === 'simonplus' ? 'simon_plus' : slug;
      const found = mockSistemData.find((s) => s.slug === slug || s.slug === normalizedSlug || s.kode_sistem === slug);
      if (found) {
        return { success: true, data: found, isDummy: true };
      }
      return { success: false, data: null };
    } catch (error) {
      const normalizedSlug = slug === 'simonplus' ? 'simon_plus' : slug;
      const found = mockSistemData.find((s) => s.slug === slug || s.slug === normalizedSlug || s.kode_sistem === slug);
      if (found) {
        return { success: true, data: found, isDummy: true };
      }
      return { success: false, data: null };
    }
  },
};

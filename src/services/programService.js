import { apiClient } from './api';
import { getFullImageUrl } from '../utils/imageUrl';

const DEFAULT_HERO_IMAGE = 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp';

function normalizeProgram(p) {
  if (!p) return null;
  const imageSource = getFullImageUrl(p.gambar_cover) || DEFAULT_HERO_IMAGE;
  return {
    id: p.id,
    slug: p.slug,
    href: p.link_eksternal || `/program/${p.slug}`,
    target: p.link_eksternal ? '_blank' : '_self',
    judul_program: p.nama_program || p.judul_program,
    kategori: p.pilar_kategori || p.kategori,
    banner: imageSource,
    fallbackImg: imageSource,
    page_title: p.nama_program || p.page_title,
    sub_title: p.pilar_kategori || p.sub_title,
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
  // 1. Ambil metrik dampak SiMinah & Simon+ murni dari database
  async getImpactMetrics() {
    try {
      const response = await apiClient.get('/metrik-dampak');
      const resData = response.data?.data;
      const list = resData?.metrik_list || (Array.isArray(resData) ? resData : []);

      const normalized = (list || []).map((m) => ({
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

      return { success: true, data: normalized };
    } catch (error) {
      console.error('Error mengambil metrik dampak dari database:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // 2. Ambil program showcase murni dari database
  async getShowcasePrograms() {
    try {
      const response = await apiClient.get('/program');
      const list = response.data?.data || [];
      const normalized = Array.isArray(list) ? list.map(normalizeProgram) : [];

      return { success: true, data: normalized };
    } catch (error) {
      console.error('Error mengambil program dari database:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // 3. Ambil detail program berdasarkan slug murni dari database
  async getProgramBySlug(slug) {
    try {
      const response = await apiClient.get(`/program/${slug}`);
      if (response.data?.success && response.data?.data) {
        return { success: true, data: normalizeProgram(response.data.data) };
      }
      return {
        success: false,
        data: null,
        message: response.data?.message || 'Program tidak ditemukan di database.',
      };
    } catch (error) {
      console.error(`Error mengambil detail program "${slug}" dari database:`, error);
      return { success: false, data: null, error: error.message };
    }
  },

  // 4. Ambil kartu bantuan CSR murni dari database
  async getCsrAidPrograms() {
    try {
      const response = await apiClient.get('/bantuan');
      const list = response.data?.data || [];

      const normalized = (Array.isArray(list) ? list : []).map((b) => ({
        id: b.id,
        title: b.judul_bantuan || b.title,
        desc: b.penjelasan_bantuan || b.desc,
        gambar_cover: getFullImageUrl(b.gambar_cover) || DEFAULT_HERO_IMAGE,
      }));

      return { success: true, data: normalized };
    } catch (error) {
      console.error('Error mengambil data bantuan CSR dari database:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // 5. Ambil artikel berita murni dari database
  async getArticles() {
    try {
      const response = await apiClient.get('/artikel');
      const list = response.data?.data || [];

      const normalized = (Array.isArray(list) ? list : []).map((a) => ({
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

      return { success: true, data: normalized };
    } catch (error) {
      console.error('Error mengambil artikel dari database:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // 6. Ambil data Visi & Misi CSR murni dari database
  async getVisiMisi() {
    try {
      const response = await apiClient.get('/visi-misi');
      return response.data;
    } catch (error) {
      console.error('Error mengambil visi misi dari database:', error);
      return { success: false, data: null, error: error.message };
    }
  },
};

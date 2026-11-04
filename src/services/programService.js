import { mockImpactMetrics } from '../mocks/impactMetrics';
import { mockShowcasePrograms, mockCsrAidPrograms } from '../mocks/programs';
import { mockArticles } from '../mocks/articles';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const programService = {
  // Ambil metrik dampak SiMinah & Simon+
  async getImpactMetrics() {
    if (USE_MOCK) {
      return {
        success: true,
        message: 'Data metrik dampak berhasil dimuat (mock)',
        data: mockImpactMetrics,
      };
    }
  },

  // Ambil program showcase 4 foto
  async getShowcasePrograms() {
    if (USE_MOCK) {
      return {
        success: true,
        message: 'Data showcase berhasil dimuat (mock)',
        data: mockShowcasePrograms,
      };
    }
  },

  // Ambil detail program berdasarkan slug
  async getProgramBySlug(slug) {
    if (USE_MOCK) {
      const found = mockShowcasePrograms.find((p) => p.slug === slug);
      if (found) {
        return {
          success: true,
          data: found,
        };
      }
      // Jika tidak ditemukan langsung, gunakan item pertama sebagai fallback yang aman
      return {
        success: true,
        data: mockShowcasePrograms[0],
      };
    }
  },

  // Ambil kartu bantuan CSR
  async getCsrAidPrograms() {
    if (USE_MOCK) {
      return {
        success: true,
        message: 'Data bantuan CSR berhasil dimuat (mock)',
        data: mockCsrAidPrograms,
      };
    }
  },

  // Ambil artikel berita
  async getArticles() {
    if (USE_MOCK) {
      return {
        success: true,
        message: 'Data artikel berita berhasil dimuat (mock)',
        data: mockArticles,
      };
    }
  },
};

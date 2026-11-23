import { apiClient } from './api';

export const pageHeroService = {
  /**
   * Mengambil semua data banner hero halaman (Publik)
   */
  getAll: async () => {
    const res = await apiClient.get('/page-heroes');
    return res.data;
  },

  /**
   * Mengambil data hero untuk 1 halaman spesifik (Publik)
   * @param {string} pageKey 'katalog_produk' | 'direktori_umkm' | 'tentang_kami'
   */
  getByKey: async (pageKey) => {
    const res = await apiClient.get(`/page-heroes/${pageKey}`);
    return res.data;
  },

  /**
   * Update hero halaman (Admin)
   * Mendukung FormData (jika upload file foto) atau JSON biasa
   * @param {string} pageKey
   * @param {FormData|object} data
   */
  update: async (pageKey, data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    // Gunakan POST agar FormData multipart/form-data terbaca sempurna oleh PHP
    const res = await apiClient.post(`/admin/page-heroes/${pageKey}`, data, config);
    return res.data;
  },
};

import { apiClient } from './api';

export const umkmService = {
  /**
   * Dapatkan daftar katalog produk dengan filter (search, kategori, min_price, max_price, kecamatan, sort).
   */
  async getProduk(params = {}) {
    const res = await apiClient.get('/umkm/produk', { params });
    return res.data;
  },

  /**
   * Dapatkan daftar kelompok UMKM binaan dengan opsi pencarian & filter kecamatan.
   */
  async getKelompok(params = {}) {
    const res = await apiClient.get('/umkm/kelompok', { params });
    return res.data;
  },

  /**
   * Dapatkan profil detail kelompok UMKM beserta katalog produk miliknya berdasarkan slug.
   */
  async getKelompokDetail(slug) {
    const res = await apiClient.get(`/umkm/kelompok/${slug}`);
    return res.data;
  },

  /**
   * Dapatkan metadata kategori (total per kategori) & daftar kecamatan untuk sidebar filter.
   */
  async getKategoriMeta() {
    const res = await apiClient.get('/umkm/kategori-meta');
    return res.data;
  },

  // ==========================================
  // Admin Endpoints
  // ==========================================
  async getAdminKelompokList() {
    const res = await apiClient.get('/admin/umkm/kelompok');
    return res.data;
  },
  async createAdminKelompok(data) {
    const res = await apiClient.post('/admin/umkm/kelompok', data);
    return res.data;
  },
  async updateAdminKelompok(id, data) {
    const res = await apiClient.put(`/admin/umkm/kelompok/${id}`, data);
    return res.data;
  },
  async deleteAdminKelompok(id) {
    const res = await apiClient.delete(`/admin/umkm/kelompok/${id}`);
    return res.data;
  },

  async getAdminProdukList() {
    const res = await apiClient.get('/admin/umkm/produk');
    return res.data;
  },
  async createAdminProduk(data) {
    const res = await apiClient.post('/admin/umkm/produk', data);
    return res.data;
  },
  async updateAdminProduk(id, data) {
    const res = await apiClient.put(`/admin/umkm/produk/${id}`, data);
    return res.data;
  },
  async deleteAdminProduk(id) {
    const res = await apiClient.delete(`/admin/umkm/produk/${id}`);
    return res.data;
  },
};

export default umkmService;


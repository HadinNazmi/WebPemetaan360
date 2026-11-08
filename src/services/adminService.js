import { apiClient } from './api';

export const adminService = {
  // 1. Dashboard Stats & Overview
  async getStats() {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  // 2. Hero & Visi Misi
  async getVisiMisi() {
    const res = await apiClient.get('/admin/visi-misi');
    return res.data;
  },
  async updateVisiMisi(data) {
    const res = await apiClient.post('/admin/visi-misi', data);
    return res.data;
  },

  // 3. Metrik Dampak
  async getMetrikDampak() {
    const res = await apiClient.get('/admin/metrik-dampak');
    return res.data;
  },
  async createMetrikDampak(data) {
    const res = await apiClient.post('/admin/metrik-dampak', data);
    return res.data;
  },
  async updateMetrikDampak(id, data) {
    const res = await apiClient.put(`/admin/metrik-dampak/${id}`, data);
    return res.data;
  },
  async deleteMetrikDampak(id) {
    const res = await apiClient.delete(`/admin/metrik-dampak/${id}`);
    return res.data;
  },

  // 4. Program Unggulan CSR
  async getPrograms() {
    const res = await apiClient.get('/admin/program');
    return res.data;
  },
  async createProgram(data) {
    const res = await apiClient.post('/admin/program', data);
    return res.data;
  },
  async updateProgram(id, data) {
    const res = await apiClient.put(`/admin/program/${id}`, data);
    return res.data;
  },
  async deleteProgram(id) {
    const res = await apiClient.delete(`/admin/program/${id}`);
    return res.data;
  },

  // 5. Penyaluran Bantuan CSR
  async getBantuan() {
    const res = await apiClient.get('/admin/bantuan');
    return res.data;
  },
  async createBantuan(data) {
    const res = await apiClient.post('/admin/bantuan', data);
    return res.data;
  },
  async updateBantuan(id, data) {
    const res = await apiClient.put(`/admin/bantuan/${id}`, data);
    return res.data;
  },
  async deleteBantuan(id) {
    const res = await apiClient.delete(`/admin/bantuan/${id}`);
    return res.data;
  },

  // 6. Artikel & Publikasi Media
  async getArtikel() {
    const res = await apiClient.get('/admin/artikel');
    return res.data;
  },
  async createArtikel(data) {
    const res = await apiClient.post('/admin/artikel', data);
    return res.data;
  },
  async updateArtikel(id, data) {
    const res = await apiClient.put(`/admin/artikel/${id}`, data);
    return res.data;
  },
  async deleteArtikel(id) {
    const res = await apiClient.delete(`/admin/artikel/${id}`);
    return res.data;
  },

  // 7. Pengguna Admin
  async getUsers() {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },
  async createUser(data) {
    const res = await apiClient.post('/admin/users', data);
    return res.data;
  },
  async deleteUser(id) {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },

  // 8. Upload File Gambar Lokal (Standar Shared Hosting)
  async uploadImage(file, folder = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await apiClient.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // 9. Virtual Tour 360
  async getTourWilayahList() {
    const res = await apiClient.get('/admin/tour-360/wilayah');
    return res.data;
  },
  async createTourWilayah(data) {
    const res = await apiClient.post('/admin/tour-360/wilayah', data);
    return res.data;
  },
  async getTourWilayah(id) {
    const res = await apiClient.get(`/admin/tour-360/wilayah/${id}`);
    return res.data;
  },
  async updateTourWilayah(id, data) {
    const res = await apiClient.put(`/admin/tour-360/wilayah/${id}`, data);
    return res.data;
  },
  async deleteTourWilayah(id) {
    const res = await apiClient.delete(`/admin/tour-360/wilayah/${id}`);
    return res.data;
  },

  // Scene Manajer
  async getTourScenes(wilayahId) {
    const res = await apiClient.get(`/admin/tour-360/wilayah/${wilayahId}/scenes`);
    return res.data;
  },
  async createTourScene(wilayahId, data) {
    const res = await apiClient.post(`/admin/tour-360/wilayah/${wilayahId}/scenes`, data);
    return res.data;
  },
  async getTourScene(id) {
    const res = await apiClient.get(`/admin/tour-360/scenes/${id}`);
    return res.data;
  },
  async updateTourScene(id, data) {
    const res = await apiClient.put(`/admin/tour-360/scenes/${id}`, data);
    return res.data;
  },
  async deleteTourScene(id) {
    const res = await apiClient.delete(`/admin/tour-360/scenes/${id}`);
    return res.data;
  },
  async setInitialTourScene(id) {
    const res = await apiClient.post(`/admin/tour-360/scenes/${id}/set-initial`);
    return res.data;
  },

  // Hotspot Interaktif
  async getTourHotspots(sceneId) {
    const res = await apiClient.get(`/admin/tour-360/scenes/${sceneId}/hotspots`);
    return res.data;
  },
  async createTourHotspot(sceneId, data) {
    const res = await apiClient.post(`/admin/tour-360/scenes/${sceneId}/hotspots`, data);
    return res.data;
  },
  async updateTourHotspot(id, data) {
    const res = await apiClient.put(`/admin/tour-360/hotspots/${id}`, data);
    return res.data;
  },
  async deleteTourHotspot(id) {
    const res = await apiClient.delete(`/admin/tour-360/hotspots/${id}`);
    return res.data;
  },

  // Upload Media Khusus Tour 360
  async uploadTourMedia(file, type = 'panoramas', wilayahSlug = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('wilayah_slug', wilayahSlug);
    const res = await apiClient.post('/admin/tour-360/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default adminService;


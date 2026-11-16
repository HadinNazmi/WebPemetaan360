import { apiClient } from './api';

export const tjslAdminService = {
  // 1. Dashboard Stats
  async getDashboardStats() {
    const res = await apiClient.get('/admin/tjsl/stats');
    return res.data;
  },

  // 2. 4 Pilar TJSL
  async getPilarList() {
    const res = await apiClient.get('/admin/tjsl/pilar');
    return res.data;
  },

  // 3. Program TJSL
  async getPrograms() {
    const res = await apiClient.get('/admin/tjsl/program');
    return res.data;
  },

  async createProgram(data) {
    const res = await apiClient.post('/admin/tjsl/program', data);
    return res.data;
  },

  async updateProgram(id, data) {
    const res = await apiClient.put(`/admin/tjsl/program/${id}`, data);
    return res.data;
  },

  async deleteProgram(id) {
    const res = await apiClient.delete(`/admin/tjsl/program/${id}`);
    return res.data;
  },

  // 4. Penyaluran Bantuan TJSL
  async getBantuan() {
    const res = await apiClient.get('/admin/tjsl/bantuan');
    return res.data;
  },

  async createBantuan(data) {
    const res = await apiClient.post('/admin/tjsl/bantuan', data);
    return res.data;
  },

  async updateBantuan(id, data) {
    const res = await apiClient.put(`/admin/tjsl/bantuan/${id}`, data);
    return res.data;
  },

  async deleteBantuan(id) {
    const res = await apiClient.delete(`/admin/tjsl/bantuan/${id}`);
    return res.data;
  },

  // 5. Laporan Akuntabilitas & SROI
  async getLaporan() {
    const res = await apiClient.get('/admin/tjsl/laporan');
    return res.data;
  },
};


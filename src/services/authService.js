import { apiClient } from './api';

const TOKEN_KEY = 'csr_admin_token';
const USER_KEY = 'csr_admin_user';

export const authService = {
  /**
   * Login ke sistem dengan email & password.
   * Disimpan di localStorage agar persistent di semua tab browser yang sama.
   */
  async login(credentials) {
    const res = await apiClient.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (res.data?.success && res.data?.data?.token) {
      const { token, user } = res.data.data;

      // Bersihkan sesi lama di session/local
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);

      // Simpan di localStorage agar seluruh tab di browser yang sama langsung aktif
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return res.data;
  },

  /**
   * Dapatkan data profil admin saat ini dari backend.
   */
  async getMe() {
    const res = await apiClient.get('/admin/me');
    if (res.data?.success && res.data?.data) {
      const user = res.data.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return res.data;
  },

  /**
   * Logout dan cabut token di backend.
   */
  async logout() {
    try {
      await apiClient.post('/admin/logout');
    } catch {
      // Abaikan jika token sudah tidak valid di server
    } finally {
      this.clearSession();
    }
  },

  /**
   * Ambil token yang tersimpan di browser (localStorage).
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  },

  /**
   * Ambil data profil user yang tersimpan di browser.
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Cek apakah pengguna memiliki token aktif di browser.
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },

  /**
   * Hapus semua data sesi di browser saat logout.
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};

export default authService;

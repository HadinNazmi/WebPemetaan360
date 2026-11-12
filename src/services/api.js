import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Sisipkan Bearer token jika user sudah login
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('csr_admin_token') ||
      sessionStorage.getItem('csr_admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Tangani 401 Unauthorized otomatis
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus token lokal jika sesi kedaluwarsa atau invalid
      localStorage.removeItem('csr_admin_token');
      sessionStorage.removeItem('csr_admin_token');
      localStorage.removeItem('csr_admin_user');
      sessionStorage.removeItem('csr_admin_user');

      // Jika sedang berada di area admin dan bukan di halaman login, redirect
      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

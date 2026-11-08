/**
 * Helper untuk memastikan URL gambar valid baik untuk:
 * 1. File lokal yang di-upload ke server (/uploads/...)
 * 2. Tautan gambar eksternal (https://...)
 */
export function getFullImageUrl(path) {
  if (!path) return '';

  // Jika URL berupa data URI atau blob internal
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  // Jika berupa URL absolut (http / https)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Di mode development lokal (Vite), jika merujuk ke localhost:8000/uploads,
    // alihkan ke relative path /uploads agar melewati Vite proxy (bebas kendala CORS WebGL)
    if (import.meta.env.DEV && path.includes('localhost:8000/uploads/')) {
      return path.substring(path.indexOf('/uploads/'));
    }
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Di mode development lokal (Vite), gunakan relative path agar otomatis di-proxy oleh Vite
  if (import.meta.env.DEV && cleanPath.startsWith('/uploads/')) {
    return cleanPath;
  }

  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendBase}${cleanPath}`;
}

export default getFullImageUrl;

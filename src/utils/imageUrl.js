/**
 * Helper untuk memastikan URL gambar valid baik untuk:
 * 1. File lokal yang di-upload ke server (/uploads/...)
 * 2. Tautan gambar eksternal (https://...)
 */
export function getFullImageUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendBase}${cleanPath}`;
}

export default getFullImageUrl;


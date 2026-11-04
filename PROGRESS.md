# PROGRESS PROYEK: WebPemetaan360
**Terakhir Diperbarui:** 4 November 2026

Dokumen ini menjadi acuan status teknis proyek agar kelanjutan pengembangan langsung fokus ke langkah berikutnya tanpa perlu audit ulang.

---

## 1. Arsitektur & Stack
- **Frontend**: React 19 + Vite 8 + Tailwind CSS + React Router v7 + Axios + Lucide Icons.
- **Backend**: Laravel 11 (REST API) + MySQL (Port 3306, DB: `csr_pemetaan360`).
- **Mode Integrasi**: 100% Real API Database (Seluruh Mock/Dummy sudah dihapus total).

---

## 2. Status Modul yang Selesai Dikerjakan

### A. Backend Laravel
1. **Database & Migrasi**:
   - `users` (Superadmin)
   - `visi_misi_csr` (Teks visi, misi, status aktif)
   - `sistem_csr` (Sistem SiMinah & Simon+)
   - `metrik_dampak_digital` (Capaian numerik terhubung ke sistem CSR)
   - `program_csr` (Showcase program, slug, galeri, metadata, rich HTML)
   - `bantuan_csr` (Kartu penyaluran bantuan CSR)
   - `artikel_csr` (Siaran pers, filter kategori, media URL)
2. **Seeders**:
   - Berhasil dieksekusi di database phpMyAdmin (`AdminUserSeeder`, `VisiMisiCsrSeeder`, `SistemCsrSeeder`, `ProgramCsrSeeder`, `BantuanCsrSeeder`, `ArtikelCsrSeeder`).
3. **CORS & Routing**:
   - CORS dikonfigurasi di `backend/config/cors.php` mengizinkan origin frontend.
   - Endpoint terdaftar di `backend/routes/api.php`:
     - `GET /api/v1/home` (Bundle semua konten beranda)
     - `GET /api/v1/visi-misi`
     - `GET /api/v1/metrik-dampak`
     - `GET /api/v1/program` & `GET /api/v1/program/{slug}`
     - `GET /api/v1/bantuan`
     - `GET /api/v1/artikel`
4. **Controller**:
   - `App\Http\Controllers\Api\PublicContentController` sudah menangani seluruh response GET publik.

### B. Frontend React
1. **API Client**:
   - `src/services/api.js` (Axios instance terhubung ke `VITE_API_BASE_URL=http://localhost:8000/api/v1`).
2. **Service Layer**:
   - `src/services/programService.js` murni mengambil data dari API Laravel tanpa fallback dummy.
3. **Komponen Publik & Empty State Handling**:
   - `ProgramList.jsx`: Menampilkan kartu program atau empty state jika tabel kosong.
   - `CsrAidSection.jsx`: Slider bantuan dinamis dari API atau empty state jika tabel kosong.
   - `NewsSection.jsx`: Bento grid siaran pers dari API atau empty state jika tabel kosong.
   - `Stats.jsx`: Counter metrik capaian dari API atau empty state jika tabel kosong.
   - `ProgramDetailPage.jsx`: Halaman detail program dinamis dengan error page 404 jika slug tidak ada di DB.
4. **Build Status**:
   - `npm run build` berhasil 100% tanpa error.

---

## 3. Yang Belum Dikerjakan (Next Steps)
1. **Dashboard Admin (CMS)**:
   - Desain UI di Stitch (mengacu pada `DASHBOARD_ADMIN_PRD.md`).
   - Implementasi frontend CMS admin & otentikasi login (Laravel Sanctum).
   - Backend API CRUD (POST, PUT, DELETE) untuk tiap section konten.
2. **Virtual Tour 360 Dinamis**:
   - Tabel migrasi untuk `wilayah`, `scenes`, dan `hotspots` (sesuai PRD).
   - Visual Hotspot Editor di Dashboard Admin.
   - Integrasi viewer panorama 360 di frontend publik.


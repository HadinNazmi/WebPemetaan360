# PROGRESS PROYEK: WebPemetaan360
**Terakhir Diperbarui:** 5 November 2026

Dokumen acuan status teknis proyek agar kelanjutan pengembangan langsung fokus ke langkah berikutnya tanpa perlu audit ulang.

---

## 1. Arsitektur & Stack
- **Frontend**: React 19 + Vite 8 + Tailwind CSS + React Router v7 (Nested Routing) + Axios + Google Fonts + Material Symbols.
- **Backend**: Laravel 11 (REST API) + MySQL (Port 3306, DB: `csr_pemetaan360`).
- **CMS Architecture**: Reusable Admin Layout dengan SPA Nested Routing (`<AdminLayout>` fixed sidebar/topbar + dynamic `<Outlet />`).

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
3. **API Controller & Routes**:
   - `PublicContentController.php`: Endpoint GET publik `/api/v1/...`
   - `AdminContentController.php`: Endpoint CRUD lengkap `/api/v1/admin/...` untuk:
     - `/admin/stats` (Overview 4 counter ringkasan)
     - `/admin/visi-misi` (GET, POST update)
     - `/admin/metrik-dampak` (GET, POST, PUT, DELETE)
     - `/admin/program` (GET, POST, PUT, DELETE)
     - `/admin/bantuan` (GET, POST, PUT, DELETE)
     - `/admin/artikel` (GET, POST, PUT, DELETE, featured toggle)
     - `/admin/users` (GET, POST, DELETE)

### B. Frontend React (Admin CMS & Public)
1. **Admin Components (`src/components/admin/`)**:
   - `AdminLayout.jsx`: Shell pembungkus utama dengan `<Outlet />`. Sidebar dan Topbar tetap di posisi saat berpindah antar menu.
   - `AdminSidebar.jsx`: Navigasi sidebar bernuansa Pertamina x PCR persis sesuai acuan `dashboard.html`.
   - `AdminHeader.jsx`: Breadcrumbs dinamis, tombol "Lihat Web Publik" (open new tab), notifikasi, profil superadmin.
   - `AdminStatCard.jsx`: Reusable metric card dengan badge status.
   - `AdminModal.jsx`: Reusable modal dialog untuk form tambah/ubah data.
2. **Admin Pages (`src/pages/admin/`)**:
   - `DashboardOverviewPage.jsx`: Ringkasan 4 stat cards, corporate SVG chart tren capaian, dan panel pintasan per section.
   - `HeroVisiMisiPage.jsx`: Editor teks visi, butir-butir misi dinamis, dan toggle status tampil.
   - `MetrikDampakPage.jsx`: Filter tab (All/SiMinah/Simon+), tabel data capaian, toggle tampil/draft, dan modal tambah/edit indikator.
   - `ProgramUnggulanPage.jsx`: Manajemen 4 kartu showcase beranda, preview slug, form upload banner & editor HTML konten detail.
   - `PenyaluranBantuanPage.jsx`: Manajemen kartu carousel bantuan dan urutan slide.
   - `PublikasiPage.jsx`: Manajemen artikel berita, filter kategori, dan tombol cepat "Set as Featured Utama".
   - `PenggunaAdminPage.jsx`: Manajemen akun superadmin dan penambahan user admin baru.
   - `KonfigurasiUmumPage.jsx`: Konfigurasi nama portal, hotline 135, dan kontak resmi.
3. **Admin Service (`src/services/adminService.js`)**:
   - Jembatan API Axios langsung ke endpoint `/api/v1/admin/...`.
4. **Verifikasi Build**:
   - `npm run build` sukses 100% tanpa error.

---

## 3. Yang Belum Dikerjakan (Next Steps / Pengembangan Lanjutan)
1. **Fitur Khusus Virtual Tour 360 (Tahap 6 - Sesuai instruksi ditunda dulu)**:
   - Migrasi tabel `wilayah`, `scenes`, `hotspots`.
   - Visual Hotspot Editor pada foto panorama 360.
   - Integrasi viewer 360 publik.
2. **Otentikasi Login Session/Token (Laravel Sanctum)** jika ingin halaman login terproteksi sebelum masuk ke `/admin`.

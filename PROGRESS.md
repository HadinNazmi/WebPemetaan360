# PROGRESS PROYEK: WebPemetaan360
**Terakhir Diperbarui:** 5 November 2026

Dokumen acuan status teknis proyek agar kelanjutan pengembangan langsung fokus ke langkah berikutnya tanpa perlu audit ulang.

---

## 1. Arsitektur & Stack
- **Frontend**: React 19 + Vite 8 + Tailwind CSS + React Router v7 (Nested Routing) + Axios + Google Fonts + Material Symbols.
- **Backend**: Laravel 11 (REST API) + MySQL (Port 3306, DB: `csr_pemetaan360`).
- **CMS Architecture**: Reusable Admin Layout dengan SPA Nested Routing (`<AdminLayout>` fixed sidebar/topbar + dynamic `<Outlet />`).
- **Target Deployment**: Shared Hosting (Hostinger cPanel/hPanel) & Localhost Development.

---

## 2. Standar Teknis Penyimpanan Foto (Keputusan Arsitektur Shared Hosting)

> **Disepakati & Selesai Diimplementasikan:** Sistem upload mendukung **Dual Mode**: Upload File Lokal (dari laptop admin) ATAU Tempel Tautan Eksternal (URL).

1. **Penyimpanan File Fisik (Ramah Hostinger)**:
   - File fisik disimpan langsung ke folder publik: `public/uploads/{kategori}/` menggunakan fungsi Laravel `$file->move(public_path('uploads/{kategori}'), $filename)`.
   - **Bebas Symlink**: Tidak memerlukan akses SSH terminal `php artisan storage:link`, sehingga 100% aman dan langsung berfungsi di Shared Hosting Hostinger.
2. **Penyimpanan di Database MySQL**:
   - Kolom gambar tetap bertipe **`VARCHAR(255)`**.
   - MySQL hanya mencatat string path relatif (contoh: `/uploads/program/173000_abcd.jpg`).
   - Database tetap sangat ringan dan cepat di-query.
3. **Komponen Reusable Admin (`AdminImagePicker.jsx`)**:
   - Tab switcher: **"Upload File Lokal"** vs **"Tautan / URL"**.
   - Dilengkapi area dropzone, drag-and-drop, validasi tipe gambar, indikator progres upload, dan kotak pratinjau (preview) foto dengan tombol hapus.

---

## 3. Status Modul yang Selesai Dikerjakan

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
     - `/admin/upload` (**POST**: Upload file lokal langsung ke `public/uploads/{folder}`)
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
   - `AdminImagePicker.jsx`: Reusable dual-mode image picker (Upload lokal ke server / Tempel URL eksternal) dengan preview real-time.
2. **Admin Pages (`src/pages/admin/`)**:
   - `DashboardOverviewPage.jsx`: Ringkasan 4 stat cards, corporate SVG chart tren capaian, dan panel pintasan per section.
   - `HeroVisiMisiPage.jsx`: Editor teks visi, butir-butir misi dinamis, toggle status tampil, dan picker foto logo/hero.
   - `MetrikDampakPage.jsx`: Filter tab (All/SiMinah/Simon+), tabel data capaian, toggle tampil/draft, dan modal tambah/edit indikator.
   - `ProgramUnggulanPage.jsx`: Manajemen 4 kartu showcase beranda, preview slug, picker upload banner & editor HTML konten detail.
   - `PenyaluranBantuanPage.jsx`: Manajemen kartu carousel bantuan, picker upload foto bantuan, dan urutan slide.
   - `PublikasiPage.jsx`: Manajemen artikel berita, filter kategori, picker upload cover berita, dan tombol cepat "Set as Featured Utama".
   - `PenggunaAdminPage.jsx`: Manajemen akun superadmin dan penambahan user admin baru.
   - `KonfigurasiUmumPage.jsx`: Konfigurasi nama portal, hotline 135, dan kontak resmi.
3. **Image Resolver Helper (`src/utils/imageUrl.js`)**:
   - Mengubah path lokal `/uploads/...` menjadi URL absolut yang valid secara otomatis di semua komponen tampilan publik (`programService.js`, `ProgramList`, `NewsSection`, `ProgramDetailPage`, `VisiMisiSection`).
4. **Sinkronisasi Komponen Publik Dinamis**:
   - `VisiMisiSection.jsx`: Telah dihubungkan secara dinamis ke database via `programService.getVisiMisi()`.
   - `DetailLayout.jsx`: Mendukung rendering `{children || content}` untuk sub-halaman detail program.
5. **Verifikasi Build**:
   - `npm run build` sukses 100% tanpa error.

---

## 4. Yang Belum Dikerjakan (Next Steps / Roadmap Lanjutan)
1. **Fitur Khusus Virtual Tour 360 (Tahap 6 - Ditunda ke tahap berikutnya)**:
   - Migrasi database master wilayah, scene 360, dan hotspot.
   - Visual Hotspot Editor pada kanvas 360.
2. **Otentikasi Login Session/Token (Laravel Sanctum)** untuk memproteksi rute `/admin`.

# Ringkasan Perubahan pada Project **WebPemetaan360**

Dokumen ini mencatat semua penambahan dan modifikasi yang telah dilakukan untuk menambahkan **role Admin TJSL** serta dukungan UI/Backend terkait.

---

## 1. Backend (Laravel)

| File / Komponen | Perubahan Utama |
|-----------------|----------------|
| `app/Http/Controllers/AuthController.php` | - Menambahkan `admin_tjsl` ke dalam **validation rule** `allowed_roles` pada method `storeUser` sehingga akun dengan role ini dapat dibuat dan login. |
| `app/Http/Middleware/EnsureUserRole.php` | - Middleware baru yang memeriksa apakah pengguna memiliki salah satu role yang di‑allow. Digunakan untuk proteksi route berbasis role. |
| `bootstrap/app.php` | - Mendaftarkan alias middleware: `\App\Http\Middleware\EnsureUserRole::class` dengan nama `role`. |
| `routes/api.php` | - **Grup route CSR** tetap menggunakan `middleware('role:superadmin,admin')`.
- **Grup route baru** `admin/tjsl` dengan prefix `/admin/tjsl` dan `middleware('role:admin_tjsl')`.
- Menambahkan import `App\Http\Controllers\Api\TjslAdminController` (placeholder controller). |
| `database/seeders/AdminUserSeeder.php` | - Menambahkan **seed** untuk akun `admin.tjsl@pertamina.com` dengan password `123456` dan `role = 'admin_tjsl'` (menggunakan `User::updateOrCreate`). |
| `.env` (backend) | - `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=csr_pemetaan360`
- `DB_USERNAME=root`
- `DB_PASSWORD=` (kosong, sesuaikan bila ada password). |
| Migration files | Tidak ada migrasi baru karena tabel `users` sudah memiliki kolom `role` yang dapat menampung string `admin_tjsl`. |

### Langkah yang telah dilakukan
1. **Database** `csr_pemetaan360` dibuat (phpMyAdmin atau CLI). 
2. **Migrations** dijalankan (`php artisan migrate`) – tidak ada migrasi baru, namun tabel `users` ter‑update. 
3. **Seeder** dijalankan (`php artisan db:seed --class=AdminUserSeeder`) untuk menambahkan akun Admin TJSL. 

---

## 2. Frontend (React + Vite)

| File / Komponen | Perubahan / Penambahan |
|-----------------|------------------------|
| `src/components/admin/tjsl/TjslAdminSidebar.jsx` | Sidebar khusus TJSL (menu navigasi yang mirip sidebar CSR). |
| `src/components/admin/tjsl/TjslAdminHeader.jsx` | Header dengan badge role “Admin TJSL”. |
| `src/components/admin/tjsl/TjslAdminLayout.jsx` | Layout wrapper yang meng‑include sidebar + header, mirip layout CSR. |
| `src/pages/admin/tjsl/TjslDashboardOverviewPage.jsx` | Halaman beranda dashboard TJSL. |
| `src/pages/admin/tjsl/TjslPilarPage.jsx` | Page “Pilar”. |
| `src/pages/admin/tjsl/TjslProgramPage.jsx` | Page “Program”. |
| `src/pages/admin/tjsl/TjslBantuanPage.jsx` | Page “Bantuan”. |
| `src/pages/admin/tjsl/TjslLaporanPage.jsx` | Page “Laporan”. |
| `src/pages/admin/tjsl/TjslProfilPage.jsx` | Page “Profil”. |
| `src/App.jsx` | - Import layout & pages TJSL.
- Tambahkan **protected route** `<Route path="/admin/tjsl/*" element={<RoleProtectedRoute allowedRoles={['admin_tjsl']}><TjslAdminLayout/></RoleProtectedRoute>} />`. |
| `src/pages/auth/LoginPage.jsx` | Logika login kini memeriksa `user.role` dan **mengarahkan** ke `/admin` (CSR) atau `/admin/tjsl` (TJSL) setelah autentikasi berhasil. |
| `src/components/admin/AdminHeader.jsx` | Menampilkan badge “Admin TJSL” bila `user.role === 'admin_tjsl'`. |
| `src/components/admin/AdminModal.jsx` (atau modal pembuatan admin) | Menambahkan **dropdown/select** untuk memilih role (`superadmin`, `admin`, `admin_tjsl`). Nilai default tetap `admin`. |

### Catatan UI
- Semua komponen baru menggunakan **Tailwind CSS** yang sudah ada, sehingga tampilan konsisten dengan dashboard CSR.
- Warna dan ikon badge mengikuti konvensi existing (mis. `bg-indigo-600` untuk admin, `bg-green-600` untuk admin_tjsl).

---

## 3. Database & Lingkungan

- **Database**: `csr_pemetaan360` (MySQL) berada pada host `127.0.0.1:3306`.
- **Tabel penting**: `users` (memiliki kolom `role`). 
- **Akun Admin TJSL**: 
  - **Email**: `admin.tjsl@pertamina.com`
  - **Password**: `123456`
  - **Role**: `admin_tjsl`

Jika ingin men‑reset akun, cukup jalankan kembali seeder atau gunakan tinker:
```bash
php artisan tinker
>>> \App\Models\User::updateOrCreate(['email' => 'admin.tjsl@pertamina.com'], ['password' => bcrypt('123456'), 'role' => 'admin_tjsl']);
```

---

## 4. Cara Menjalankan Proyek (Ringkas)

1. **Pastikan MySQL service di Laragon berjalan**.
2. **Buat/cek database** `csr_pemetaan360` (phpMyAdmin atau CLI). 
3. **Instal dependensi** pada folder `backend`:
   ```cmd
   cd D:\laragon(2)\www\WebPemetaan360\backend
   "D:\laragon(2)\bin\php\php-8.3.36-1-Win32-vs16-x64\php.exe" artisan migrate
   "D:\laragon(2)\bin\php\php-8.3.36-1-Win32-vs16-x64\php.exe" artisan db:seed --class=AdminUserSeeder
   ```
4. **Frontend**:
   ```cmd
   cd D:\laragon(2)\www\WebPemetaan360\backend
   npm install
   npm run dev   # jalankan Vite dev server
   ```
5. **Akses aplikasi** di `http://localhost:8000`.
   - Login dengan **admin CSR** (sebelumnya) → diarahkan ke `/admin`.
   - Login dengan **admin.tjsl@pertamina.com` → diarahkan ke `/admin/tjsl`.

---

## 5. File‑file yang Relevan (klik untuk membuka)

- Backend
  - [AuthController.php](file:///D:/laragon(2)/www/WebPemetaan360/backend/app/Http/Controllers/AuthController.php)
  - [EnsureUserRole.php](file:///D:/laragon(2)/www/WebPemetaan360/backend/app/Http/Middleware/EnsureUserRole.php)
  - [api.php (routes)](file:///D:/laragon(2)/www/WebPemetaan360/backend/routes/api.php)
  - [AdminUserSeeder.php](file:///D:/laragon(2)/www/WebPemetaan360/backend/database/seeders/AdminUserSeeder.php)
  - [.env (backend)](file:///D:/laragon(2)/www/WebPemetaan360/backend/.env)
- Frontend
  - [LoginPage.jsx](file:///D:/laragon(2)/www/WebPemetaan360/src/pages/auth/LoginPage.jsx)
  - [TjslAdminLayout.jsx](file:///D:/laragon(2)/www/WebPemetaan360/src/components/admin/tjsl/TjslAdminLayout.jsx)
  - [TjslDashboardOverviewPage.jsx](file:///D:/laragon(2)/www/WebPemetaan360/src/pages/admin/tjsl/TjslDashboardOverviewPage.jsx)
  - [AdminHeader.jsx (badge update)](file:///D:/laragon(2)/www/WebPemetaan360/src/components/admin/AdminHeader.jsx)

---

## 6. Apa yang Belum Dikerjakan / Catatan Selanjutnya

- **Pengujian unit / feature** untuk route `admin/tjsl/*` (belum ada test). 
- **Validasi lebih ketat** pada input CRUD di halaman TJSL (mis. validasi form). 
- **Dokumentasi** pada README untuk menambah penjelasan tentang role baru. 
- **Deploy**: Pastikan environment production memiliki database dengan nama yang sama atau sesuaikan `.env` produksi.

---

*Dokumen ini dibuat otomatis pada *2026‑11‑16 13:34* oleh Antigravity.*

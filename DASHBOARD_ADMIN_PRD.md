# PRD DASHBOARD ADMIN (CMS) - CSR PEMETAAN 360
**Tujuan Dokumen:** Panduan terstruktur rancangan antarmuka (UI/UX) Dashboard Admin untuk acuan pembuatan desain di **Stitch**.

---

## 1. Filosofi & Konsep Desain
- **Section-Driven Management**: Struktur menu diatur **per section halaman web** agar admin awam sekalipun langsung paham: *"Menu ini mengubah tampilan di bagian web sebelah mana"*.
- **Live State & User Friendly**: Setiap data memiliki tombol *Toggle On/Off (Publish/Draft)*, indikator urutan (urutan tampil), dan tombol *Preview Web*.
- **Layout Standar**:
  - **Sidebar Kiri**: Navigasi hierarkis modular dengan ikon intuitif.
  - **Topbar**: Breadcrumbs halaman, tombol pintas *"Lihat Web Publik"*, notifikasi, dan profil admin.
  - **Area Konten Utama**: Header ringkas + Tombol Aksi Utama (Tambah Data) + Tabel/Grid Interaktif.

---

## 2. Struktur Menu & Sitemap Sidebar

```
📁 DASHBOARD ADMIN
├── 📊 Ringkasan (Overview / Analytics)
│
├── 🌐 KELOLA KONTEN BERANDA (LANDING PAGE)
│   ├── 🏷️ 1. Hero & Visi Misi
│   ├── 🧭 2. Virtual Tour 360 & Hotspot
│   ├── 📈 3. Metrik Dampak (SiMinah & Simon+)
│   ├── 🌟 4. Program Unggulan CSR
│   ├── 🤝 5. Penyaluran Bantuan
│   └── 📰 6. Publikasi & Siaran Pers
│
└── ⚙️ PENGATURAN SISTEM
    ├── 👥 Kelola Pengguna Admin
    └── 🛠️ Konfigurasi Umum Web
```

---

## 3. Rincian Halaman & Spesifikasi Fitur (Untuk Desain Stitch)

### 3.1. Halaman Ringkasan (Dashboard Overview)
*Halaman pertama saat admin berhasil login.*
- **Komponen UI**:
  - **Stat Cards (4 Kartu Ringkasan)**:
    - Total Wilayah & Scene 360 Aktif.
    - Total Program CSR yang Ditampilkan.
    - Total Bantuan CSR Tersalurkan.
    - Total Artikel Publikasi.
  - **Quick Action Bar**: Tombol cepat *"Tambah Scene 360 Baru"*, *"Tulis Artikel Baru"*, *"Update Angka Metrik"*.
  - **Tabel Aktivitas Terakhir**: Log perubahan terakhir yang dilakukan oleh tim admin.

---

### 3.2. Section 1: Hero & Visi Misi
*Mengatur teks judul pembuka web, visi perusahaan, dan butir-butir misi CSR.*
- **Komponen UI**:
  - **Tab / Card Visi**: Input teks Visi CSR + upload gambar latar/banner hero.
  - **Card Butir Misi (Dynamic Repeater)**:
    - Daftar butir misi yang bisa ditambah/dihapus secara dinamis (ada tombol *"+ Tambah Butir Misi"*).
  - **Status Toggle**: Aktif / Nonaktifkan seksi visi misi di beranda.
  - **Tombol Aksi**: *"Simpan Perubahan"* dengan feedback notifikasi sukses.

---

### 3.3. Section 2: Virtual Tour 360 & Hotspot Editor (Fitur Utama)
*Mengatur wilayah operasional, foto panorama 360, dan pemasangan titik interaktif (hotspot).*
- **Sub-Tab / Halaman**:
  1. **Master Wilayah**:
     - Tabel daftar wilayah (Nama Wilayah, Slug, Thumbnail, Jumlah Scene, Status Aktif).
     - Tombol Tambah Wilayah (Modal form: Nama, Deskripsi, Foto Thumbnail).
  2. **Kelola Scene 360**:
     - Galeri thumbnail panorama per wilayah.
     - Upload foto panorama 360 (equirectangular JPEG/WebP resolusi tinggi).
     - Set initial view: Pitch, Yaw, dan Zoom (Hfov) awal.
  3. **Visual Hotspot Editor (Screen Desain Utama di Stitch)**:
     - Area interaktif preview 360 full-screen/canvas.
     - Mode Klik untuk Menambah Hotspot:
       - Tipe 1: **Pindah Scene** (Pilih scene tujuan).
       - Tipe 2: **Modal Pop-Up Program** (Hubungkan ke program CSR terkait).
       - Tipe 3: **Info Pin** (Teks tooltip keterangan).

---

### 3.4. Section 3: Metrik Dampak Digital (SiMinah & Simon+)
*Mengatur angka capaian dampak keberlanjutan yang tampil di counter beranda.*
- **Komponen UI**:
  - **Filter Tab Sistem**: Tab `SiMinah` & Tab `Simon+`.
  - **Tabel Daftar Metrik**:
    - Kolom: Nama Metrik, Nilai Angka, Satuan, Format (Bulat / Desimal), Kategori Label, Status Tampil.
    - Switch Toggle: Aktif / Sembunyikan per item metrik.
    - Tombol Aksi: Edit & Hapus.
  - **Modal Tambah / Edit Metrik**:
    - Input Nama Metrik (contoh: *Donatur Terdaftar*).
    - Input Nilai Capaian (contoh: *1450*).
    - Input Satuan (contoh: *Donatur* atau *Ton*) & Suffix (*+*).
    - Pilihan Format: Integer / Decimal (1 desimal di belakang koma).
    - Input Deskripsi singkat keterangan metrik.

---

### 3.5. Section 4: Program Unggulan CSR (Showcase 4 Card & Detail)
*Mengatur 4 kartu visual besar di beranda beserta seluruh isi halaman detail sub-halamannya.*
- **Komponen UI**:
  - **Tabel List Program**:
    - Kolom: Foto Banner, Judul Program, Kategori Pilar, Slug URL, Urutan (Drag-and-Drop / Nomor), Status Aktif.
    - Aksi: Tombol Edit Konten, Preview Halaman, Hapus.
  - **Halaman Form / Editor Program (Screen Desain Stitch)**:
    - **Data Dasar**: Judul Program, Kategori (misal: *PROFIL PPID*, *PROGRAM KELAUTAN*), Slug URL otomatis.
    - **Media**: Upload Banner Cover Utama & Galeri Foto Tambahan.
    - **Tautan Eksternal (Opsional)**: Jika kartu ingin langsung membuka link website lain.
    - **Rich Text Editor**: WYSIWYG Editor untuk isi artikel lengkap program di halaman detail.
    - **Tabel Metadata Repeater**: Input pasangan data informasi (Label: contoh *Lokasi*, Nilai: contoh *Dumai, Riau*).

---

### 3.6. Section 5: Penyaluran Bantuan CSR (Slider Bantuan)
*Mengatur kartu-kartu slider carousel yang ada di samping foto tim lapangan.*
- **Komponen UI**:
  - **Preview Foto Tim Lapangan**: Upload / ganti foto tim CSR lapangan di sisi kiri.
  - **Tabel Kartu Bantuan**:
    - Kolom: Nomor Urut, Judul Bantuan (contoh: *Bantuan Pendidikan*), Ringkasan Penjelasan, Status Aktif.
    - Tombol Urutan (Naik/Turun) untuk menyusun alur slide kartu.
  - **Modal Form Bantuan**:
    - Input Judul Bantuan.
    - Input Deskripsi Bantuan (maks. 2-3 kalimat agar kartu tetap rapi).

---

### 3.7. Section 6: Publikasi & Siaran Pers (Bento Grid Berita)
*Mengatur berita utama besar (Featured) dan 4 kartu berita pendukung.*
- **Komponen UI**:
  - **Filter Tab**: Siaran Pers, Berita CSR, Berita Energia.
  - **Tabel Artikel Berita**:
    - Kolom: Gambar Cover, Judul Artikel, Tag Kategori, Tanggal Terbit, Badge *"Featured (Utama)"*, Status Aktif.
    - Tombol Set sebagai Featured (Hanya 1 artikel yang jadi kartu besar utama).
  - **Modal / Form Tambah Artikel**:
    - Judul Artikel Berita.
    - Kategori Tag (contoh: *SIARAN PERS*, *SUSTAINABILITY*).
    - Upload Gambar Cover (Rasio landscape 16:9).
    - URL Tautan Berita Asli (contoh: link ke pertamina.com atau portal berita).
    - Tanggal Publikasi (Date picker).
    - Checkbox: *"Jadikan Berita Utama (Featured)"*.

---

### 3.8. Halaman Pengaturan Akun & Superadmin
*Mengelola siapa saja yang berhak masuk ke CMS admin.*
- **Komponen UI**:
  - Tabel Akun Admin (Nama, Email, Role, Terakhir Login, Aksi).
  - Tombol Tambah Admin Baru (Input Nama, Email, Password, Konfirmasi).
  - Modal Ubah Password Akun Sendiri.

---

## 4. Panduan Visual (Design Tokens untuk Stitch)

- **Color Palette**:
  - *Primary Corporate*: `#00529C` (Pertamina Blue) / `#0284C7` (Sky Blue).
  - *Accent / Energy*: `#ED1C24` (Pertamina Red) atau `#16A34A` (Sustainability Green).
  - *Background CMS*: `#F8FAFC` (Slate-50) & `#FFFFFF` (White Card Surfaces).
  - *Sidebar Background*: `#0F172A` (Slate-900 / Dark Navy) dengan aksen aktif `#1E293B` & teks putih.
- **Komponen UI Wajib di Setiap Tabel**:
  - Search input (Cari berdasarkan judul/nama).
  - Filter status (Semua / Aktif / Nonaktif).
  - Indikator badge status hijau (`Aktif`) dan abu-abu (`Draft`).
  - Tombol aksi dengan ikon jelas: Ubah (Pensil), Hapus (Tempat Sampah), Preview (Mata).
- **Feedback Interaksi**:
  - Modal dialog konfirmasi hapus data (*"Apakah Anda yakin ingin menghapus data ini?"*).
  - Toast notification di pojok kanan atas saat simpan sukses / gagal.


# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## CSR Virtual Tour 360 & Sustainability Portal

- **Status**: Disetujui (Approved)
- **Tech Stack**: React.js (Frontend SPA / Reusable Components) + Laravel (Backend REST API) + MySQL (Database)
- **Target Pengguna**: 
  1. **Pengunjung Publik / Stakeholder** (Web Tampilan User)
  2. **Pengelola CSR / Officer Wilayah / Superadmin** (Web Admin CMS)

---

## 1. Ringkasan Eksekutif & Tujuan Produk

Aplikasi ini adalah platform digital interaktif berbasis **Virtual Tour 360** yang menampilkan program Tanggung Jawab Sosial dan Lingkungan (TJSL / CSR) PT Pertamina. Sistem ini memadukan pengalaman visual imersif 360° per wilayah operasional dengan sistem pelaporan dampak keberlanjutan (seperti inisiatif SiMinah dan Simon+) serta keterbukaan informasi program pemberdayaan masyarakat.

### Tujuan Utama:
1. **Transparansi & Imersifitas**: Membawa publik dan stakeholder menjelajahi area konservasi, kilang, dan wilayah binaan secara virtual (360° panorama tour).
2. **Skalabilitas Lokasi & Foto 360**: Memungkinkan penambahan wilayah baru dan banyak titik scene 360 secara dinamis tanpa mengubah kode.
3. **Kemudahan Pengelolaan (CMS)**: Menyediakan dashboard admin lengkap dengan *Visual Hotspot Editor* untuk mempermudah pemasangan titik interaktif pada foto 360.
4. **Arsitektur Modular**: Frontend dibangun dengan komponen React yang bersih dan dapat digunakan kembali (*reusable*), serta backend Laravel dengan REST API standar industri.

---

## 2. Arsitektur Database (MySQL)

Rancangan database dirancang untuk mendukung struktur **1 Wilayah memiliki Banyak Foto 360 (Scenes)**, dan setiap Scene dapat memiliki banyak **Hotspot (Titik Interaktif)** yang menghubungkan scene lain atau membuka pop-up program CSR.

```
                    ┌──────────────┐
                    │   wilayah    │
                    └──────┬───────┘
                           │ 1:N
             ┌─────────────┴─────────────┐
             ▼                           ▼
      ┌─────────────┐             ┌──────────────┐
      │   scenes    │             │ csr_programs │
      └──────┬──────┘             └──────┬───────┘
             │ 1:N                       │ 1:N
             ▼                           ▼
      ┌─────────────┐             ┌──────────────┐
      │  hotspots   │──(opsional)►│program_artic.│
      └─────────────┘             └──────────────┘
```

---

### 2.1. Tabel `wilayah` (Master Wilayah / Unit Operasi)
Menyimpan data master area atau unit kerja (contoh: Unit Kilang Dumai, Tanjung Palas, Mundam).

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik wilayah |
| `nama_wilayah` | VARCHAR(150) | Not Null | Nama lokasi/wilayah |
| `slug` | VARCHAR(150) | Not Null, Unique | URL slug ramah SEO |
| `deskripsi` | TEXT | Nullable | Ringkasan wilayah |
| `thumbnail_cover` | VARCHAR(255) | Nullable | Foto preview pada tab navigasi |
| `urutan` | INT | Default 0 | Urutan kemunculan di tab bawah |
| `is_active` | BOOLEAN | Default true | Status tampil di web publik |
| `created_at` | TIMESTAMP | Nullable | Waktu dibuat |
| `updated_at` | TIMESTAMP | Nullable | Waktu diubah |

---

### 2.2. Tabel `scenes` (Foto 360 / Panorama Node)
Menyimpan setiap foto 360 equirectangular yang ada di dalam suatu wilayah.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik scene |
| `wilayah_id` | BIGINT | FK -> `wilayah.id` | Wilayah induk |
| `kode_scene` | VARCHAR(50) | Not Null, Unique | ID scene unik (misal: `tanjungpalas-1`) |
| `judul_scene` | VARCHAR(150) | Not Null | Judul titik pandang |
| `file_panorama` | VARCHAR(255) | Not Null | Path/URL file foto 360 (equirectangular) |
| `file_preview` | VARCHAR(255) | Nullable | Thumbnail kecil untuk portal transisi |
| `initial_pitch` | FLOAT | Default 0.0 | Sudut pandang vertikal awal |
| `initial_yaw` | FLOAT | Default 0.0 | Sudut pandang horizontal awal |
| `initial_hfov` | INT | Default 100 | Zoom Field of View awal |
| `is_hub_scene` | BOOLEAN | Default false | `true` jika scene utama saat web dibuka |
| `urutan` | INT | Default 0 | Urutan tampilan |
| `created_at` | TIMESTAMP | Nullable | Waktu dibuat |
| `updated_at` | TIMESTAMP | Nullable | Waktu diubah |

---

### 2.3. Tabel `hotspots` (Titik Interaktif dalam Scene)
Menyimpan titik klik di dalam foto 360, baik berupa pintu masuk scene lain atau pin pop-up informasi.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik hotspot |
| `scene_id` | BIGINT | FK -> `scenes.id` | Scene tempat hotspot berada |
| `tipe` | ENUM | `'scene'`, `'modal'`, `'pin'` | Jenis aksi saat hotspot berinteraksi |
| `pitch` | FLOAT | Not Null | Koordinat vertikal titik |
| `yaw` | FLOAT | Not Null | Koordinat horizontal titik |
| `label` | VARCHAR(150) | Not Null | Teks label / tooltip hotspot |
| `target_scene_id` | BIGINT | Nullable, FK -> `scenes.id` | Scene tujuan (jika `tipe = 'scene'`) |
| `target_pitch` | FLOAT | Nullable | Sudut pitch saat mendarat di scene target |
| `target_yaw` | FLOAT | Nullable | Sudut yaw saat mendarat di scene target |
| `target_hfov` | INT | Nullable | Sudut zoom saat mendarat |
| `csr_program_id` | BIGINT | Nullable, FK -> `csr_programs.id` | Program terkait (jika modal/pin program) |
| `custom_content` | JSON | Nullable | Payload teks/gambar kustom jika tanpa program |
| `icon_style` | VARCHAR(50) | Default `'default'` | Gaya visual icon (`door`, `info`, `pin`) |
| `created_at` | TIMESTAMP | Nullable | Waktu dibuat |
| `updated_at` | TIMESTAMP | Nullable | Waktu diubah |

---

### 2.4. Tabel `kategori_program` (Pilar CSR)
Menyimpan pilar keberlanjutan CSR.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas pilar |
| `nama_kategori` | VARCHAR(100) | Not Null | Nama (misal: Pertamina Hijau, Berdikari) |
| `icon` | VARCHAR(100) | Nullable | Nama icon SVG / Font |
| `warna_aksen` | VARCHAR(20) | Nullable | Kode warna tema (hex/rgb) |

---

### 2.5. Tabel `csr_programs` (Master Program CSR)
Menyimpan konten program detail CSR (menggantikan `program-1.html` s/d `program-10.html`).

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik program |
| `wilayah_id` | BIGINT | FK -> `wilayah.id` | Lokasi wilayah program berada |
| `kategori_id` | BIGINT | FK -> `kategori_program.id` | Pilar CSR |
| `judul_program` | VARCHAR(255) | Not Null | Nama program CSR |
| `slug` | VARCHAR(255) | Not Null, Unique | URL slug detail |
| `ringkasan` | TEXT | Not Null | Deskripsi singkat (tampil di modal 360) |
| `deskripsi_lengkap`| LONGTEXT | Not Null | Konten lengkap (HTML/RichText) |
| `gambar_cover` | VARCHAR(255) | Not Null | Foto utama / banner hero detail |
| `galeri_foto` | JSON | Nullable | Array daftar foto dokumentasi |
| `sdgs_goals` | JSON | Nullable | Array angka SDGs (contoh: `[6, 13, 15]`) |
| `status` | ENUM | `'aktif'`, `'selesai'`, `'rencana'` | Status program |
| `created_at` | TIMESTAMP | Nullable | Waktu dibuat |
| `updated_at` | TIMESTAMP | Nullable | Waktu diubah |

---

### 2.6. Tabel `program_articles` (Artikel & Berita Program)
Menyimpan artikel terkait yang muncul di sidebar halaman detail program.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik artikel |
| `csr_program_id` | BIGINT | Nullable, FK -> `csr_programs.id` | Hubungan ke program tertentu |
| `judul` | VARCHAR(255) | Not Null | Judul artikel |
| `slug` | VARCHAR(255) | Not Null, Unique | URL slug berita |
| `kategori_tag` | VARCHAR(100) | Not Null | Tag (misal: "Dekarbonisasi", "PLTS Atap") |
| `konten` | LONGTEXT | Not Null | Isi artikel |
| `thumbnail` | VARCHAR(255) | Nullable | Gambar cuplikan berita |
| `published_at` | DATETIME | Not Null | Waktu rilis berita |
| `created_at` | TIMESTAMP | Nullable | Waktu dibuat |
| `updated_at` | TIMESTAMP | Nullable | Waktu diubah |

---

### 2.7. Tabel `impact_metrics` (Statistik Dampak Digital SiMinah & Simon+)
Menyimpan indikator capaian digital pada halaman beranda.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas unik |
| `label_kategori` | VARCHAR(100) | Not Null | Misal: "DONATUR TERDAFTAR (SIMINAH)" |
| `nilai_angka` | DECIMAL(12, 2) | Not Null | Nilai numerik (misal: 1450, 28.5) |
| `format_angka` | ENUM | `'integer'`, `'decimal'` | Format pemformatan angka |
| `satuan` | VARCHAR(50) | Not Null | Misal: "Donatur", "Ton", "Barel" |
| `satuan_sub` | VARCHAR(50) | Nullable | Keterangan tambahan (misal: "(Jelantah)") |
| `deskripsi` | TEXT | Not Null | Penjelasan dampak |
| `platform` | VARCHAR(50) | Default `'SiMinah'` | SiMinah / Simon+ / TJSL |
| `urutan` | INT | Default 0 | Urutan kolom |

---

### 2.8. Tabel `registrations_inquiries` (Pendaftaran Lembaga & Kontak)
Menyimpan data kiriman dari formulir pendaftaran mitra / form kontak publik.

| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | Identitas formulir |
| `tipe` | ENUM | `'registrasi'`, `'kontak'` | Jenis pengiriman |
| `nama_lengkap` | VARCHAR(150) | Not Null | Nama pemohon |
| `nama_lembaga` | VARCHAR(200) | Nullable | Nama institusi/penyalur |
| `email` | VARCHAR(150) | Not Null | Email kontak |
| `nomor_telepon` | VARCHAR(30) | Not Null | Nomor HP / WhatsApp |
| `pesan` | TEXT | Not Null | Deskripsi pengajuan / pesan |
| `status` | ENUM | `'masuk'`, `'diproses'`, `'selesai'` | Status tindak lanjut admin |
| `created_at` | TIMESTAMP | Nullable | Waktu kirim |

---

### 2.9. Tabel `users` (Admin Authentication)
| Kolom | Tipe Data | Atribut | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, Auto Increment | ID Pengguna |
| `name` | VARCHAR(100) | Not Null | Nama administrator |
| `email` | VARCHAR(100) | Not Null, Unique | Email login |
| `password` | VARCHAR(255) | Not Null | Hash password (Bcrypt) |
| `role` | ENUM | `'superadmin'`, `'officer'` | Hak akses CMS |
| `wilayah_id` | BIGINT | Nullable, FK -> `wilayah.id` | Pembatasan akses wilayah (untuk officer) |

---

## 3. Desain Komponen React (Frontend)

Frontend dibangun dengan **Vite + React (JavaScript, SPA)**, **React Router**, **Axios**, **Tailwind CSS**, **Pannellum** (viewer 360), dan **lucide-react** (icon).

> **STRATEGI PENGEMBANGAN: FRONTEND-FIRST DENGAN DATA MOCK.**
> Frontend dikerjakan lebih dulu, sebelum Laravel siap. Semua data diambil lewat folder `services/`. Selama `VITE_USE_MOCK=true`, service membaca data dari folder `mocks/`. Setelah backend Laravel siap, ubah `VITE_USE_MOCK=false` dan service otomatis memakai API asli. **Komponen dan halaman tidak boleh mengambil data langsung dari `mocks/` maupun memanggil Axios sendiri; semuanya harus lewat `services/`.**

### 3.1. Aturan Utama (Wajib Diikuti)

1. Bentuk data di `mocks/` harus **sama persis** dengan skema database (bagian 2) dan format respons API (bagian 4), yaitu `{ success, message, data }`.
2. Nama field memakai `snake_case` seperti di database (contoh: `nama_wilayah`, `kode_scene`, `target_scene_id`).
3. Setiap komponen reusable harus menerima data lewat **props**, tidak boleh bergantung pada halaman tertentu.
4. Pengambilan data hanya terjadi di **pages** (atau hook), lalu dikirim ke komponen lewat props.
5. Semua pemanggilan data (mock maupun API) bersifat **async** (mengembalikan Promise) agar peralihan ke API asli tidak mengubah kode komponen.
6. Styling memakai kelas Tailwind. Hindari CSS inline kecuali untuk nilai dinamis (misalnya `warna_aksen`).
7. Tampilan harus **responsif** (mobile, tablet, desktop) dan setiap halaman punya state *loading* dan *error*.

### 3.2. Struktur Folder Lengkap

```text
WebPemetaan360/
├── public/                     # Aset statis yang disajikan apa adanya
├── src/
│   ├── main.jsx                # Titik masuk aplikasi (render <App />)
│   ├── App.jsx                 # Definisi routing seluruh halaman
│   ├── index.css               # Import Tailwind (@import "tailwindcss")
│   ├── assets/                 # Logo, ikon, gambar statis
│   ├── components/             # Reusable UI Base
│   ├── features/
│   │   ├── tour/               # Modul Virtual Tour 360
│   │   ├── program/            # Modul Program & Konten
│   │   └── admin/              # Modul Web Admin CMS
│   ├── pages/
│   │   ├── user/               # Halaman web publik
│   │   └── admin/              # Halaman web admin (CMS)
│   ├── services/               # Lapisan akses data (mock atau API)
│   ├── mocks/                  # Data tiruan sebelum Laravel siap
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Fungsi bantu dan konstanta
├── .env                        # Konfigurasi environment
├── index.html
├── vite.config.js
└── package.json
```

---

### 3.3. Isi Setiap Folder

#### `public/`
Aset statis yang tidak diproses Vite, seperti `favicon` dan gambar placeholder. Foto panorama 360 sebaiknya diletakkan di `public/panorama/` selama masa mock. Setelah backend siap, foto diambil dari URL hasil upload Laravel.

#### `src/assets/`
Aset yang di-import langsung dari kode: logo Pertamina, ikon SDGs (1 sampai 17), gambar hero default, dan ilustrasi.

#### `src/components/` (Reusable UI Base)
Komponen dasar yang dipakai di banyak halaman. **Tidak boleh memanggil service/API.**

| File | Fungsi | Props utama |
|---|---|---|
| `Navbar.jsx` | Menu atas dengan logo dan navigasi | `links`, `variant` (`user` / `admin`) |
| `Footer.jsx` | Footer resmi dan tautan sosial media | - |
| `Modal.jsx` | Pop-up dialog generik (ringkasan program, form hotspot, konfirmasi) | `isOpen`, `onClose`, `title`, `children` |
| `Card.jsx` | Kartu program CSR dan artikel | `image`, `title`, `description`, `badge`, `onClick` |
| `Hero.jsx` | Banner hero dengan judul dan breadcrumb | `title`, `image`, `breadcrumbs` |
| `Stats.jsx` | Counter dampak SiMinah / Simon+ dengan animasi *count-up* saat masuk viewport | `metrics` (array `impact_metrics`) |
| `Table.jsx` | Tabel data generik untuk dashboard admin (kolom dinamis, aksi ubah/hapus, loading state) | `columns`, `data`, `onEdit`, `onDelete` |

#### `src/features/tour/` (Modul Virtual Tour 360)

| File | Fungsi |
|---|---|
| `Tour360.jsx` | Wrapper Pannellum. Memuat scene, mengatur sudut awal (`initial_pitch`, `initial_yaw`, `initial_hfov`), transisi fade/zoom antar scene (`hfovZoom: 25`), dan tombol mengambang *"Kembali ke Titik Awal"* saat berada di luar scene hub (`is_hub_scene`). |
| `TourTabs.jsx` | Tombol pill di bagian bawah untuk berpindah wilayah/scene, diurutkan berdasarkan `urutan`, memakai `thumbnail_cover`. |
| `Hotspot.jsx` | Merender titik interaktif berdasarkan `tipe`: `scene` (pindah scene), `modal` (buka ringkasan program), `pin` (penanda informasi). Menampilkan tooltip `label` saat di-hover dan gaya ikon sesuai `icon_style` (`door`, `info`, `pin`). |

#### `src/features/program/` (Modul Program & Konten)

| File | Fungsi |
|---|---|
| `ProgramList.jsx` | Grid daftar program CSR memakai `Card`, dengan filter per wilayah dan kategori. |
| `Sidebar.jsx` | Sidebar di halaman detail: daftar artikel terkait dan meta tanggal (`published_at`, `kategori_tag`). |

#### `src/features/admin/` (Modul Web Admin CMS)

| File | Fungsi |
|---|---|
| `HotspotEditor.jsx` | Visual editor: menampilkan foto 360, admin **klik titik** untuk merekam `pitch` dan `yaw` otomatis, lalu form memilih tipe aksi (pindah scene ke mana, atau hubungkan ke program CSR mana). Hotspot yang sudah ada tampil dan bisa diubah/dihapus. |
| `Form.jsx` | Form input dinamis berbasis konfigurasi field untuk Wilayah, Scene, Program, Artikel, dan Impact Metric. Mendukung validasi dan tampilan error. |
| `Upload.jsx` | Upload gambar panorama/cover/galeri dengan preview sebelum disimpan. |

#### `src/pages/user/` (Halaman Publik)

| File | Route | Isi |
|---|---|---|
| `HomePage.jsx` | `/` | `Tour360` + `TourTabs`, section `Stats`, grid `ProgramList`, dan form pendaftaran/kontak. |
| `ProgramDetailPage.jsx` | `/program/:slug` | Pengganti `program-*.html`. Berisi `Hero` dinamis, deskripsi lengkap (rich text), galeri foto, badge SDGs, dan `Sidebar` artikel terkait. |

#### `src/pages/admin/` (Halaman CMS)
Semua route admin berada di bawah `/admin` dan **dilindungi login** (protected route).

| File | Route | Isi |
|---|---|---|
| `LoginPage.jsx` | `/admin/login` | Form login admin. |
| `DashboardOverview.jsx` | `/admin` | Ringkasan jumlah wilayah, scene, program, dan pesan masuk. |
| `WilayahManage.jsx` | `/admin/wilayah` | Tabel dan form CRUD wilayah. |
| `SceneManage.jsx` | `/admin/scenes` | CRUD scene 360 (dengan `Upload`) dan pintu menuju `HotspotEditor`. |
| `HotspotManage.jsx` | `/admin/hotspots` | Daftar hotspot per scene dan `HotspotEditor`. |
| `ProgramManage.jsx` | `/admin/programs` | CRUD program CSR, galeri foto, dan Rich-Text Editor. |
| `ImpactMetricManage.jsx` | `/admin/impact-metrics` | Ubah angka statistik dampak. |
| `InquiryManage.jsx` | `/admin/inquiries` | Daftar pendaftaran/kontak masuk dan ubah status (`masuk`, `diproses`, `selesai`). |

#### `src/services/` (Lapisan Akses Data)
Satu-satunya tempat yang boleh mengambil data. Setiap fungsi memeriksa `import.meta.env.VITE_USE_MOCK`: jika `true` membaca dari `mocks/`, jika `false` memanggil API Laravel lewat `api.js`. Semua fungsi mengembalikan format `{ success, message, data }`.

| File | Fungsi |
|---|---|
| `api.js` | Instance Axios (`baseURL` dari `VITE_API_URL`), interceptor penyisip token Sanctum, dan penanganan error 401. |
| `tourService.js` | `getTourConfig()`, `getWilayah()`, `getSceneByKode(kode)`. |
| `programService.js` | `getPrograms(filter)`, `getProgramBySlug(slug)`, `getImpactMetrics()`, `getKategori()`, `submitInquiry(data)`. |
| `authService.js` *(tambahan)* | `login()`, `logout()`, `getCurrentUser()`. |
| `adminService.js` *(tambahan)* | Fungsi CRUD admin untuk wilayah, scenes, hotspots, programs, articles, impact-metrics, dan inquiries. Data mock disimulasikan di memori/`localStorage`. |

#### `src/mocks/` (Data Tiruan)
Data JavaScript yang meniru isi tabel database. Nama field dan tipe harus identik dengan skema bagian 2.

| File | Meniru tabel |
|---|---|
| `wilayah.js` | `wilayah` |
| `scenes.js` | `scenes` |
| `hotspots.js` | `hotspots` |
| `kategori.js` | `kategori_program` |
| `programs.js` | `csr_programs` |
| `articles.js` | `program_articles` |
| `impactMetrics.js` | `impact_metrics` |
| `inquiries.js` | `registrations_inquiries` |
| `users.js` | `users` (akun admin contoh untuk login mock) |

Sumber datanya adalah data prototype (`DESTINATIONS`, `PROGRAMS`, `TABS`, statistik). Folder ini **dihapus atau dibiarkan tidak terpakai** setelah backend Laravel terhubung.

#### `src/hooks/` (Custom Hooks)

| File | Fungsi |
|---|---|
| `useFetch.js` | Menjalankan fungsi service dan mengembalikan `{ data, loading, error }`. |
| `useCountUp.js` | Animasi angka naik untuk `Stats`. |
| `useInView.js` | Mendeteksi elemen masuk viewport (memicu count-up dan lazy load). |
| `useAuth.js` | Status login admin dan role (`superadmin` / `officer`). |

#### `src/utils/` (Fungsi Bantu)

| File | Fungsi |
|---|---|
| `formatNumber.js` | Format angka sesuai `format_angka` (`integer` / `decimal`) dan pemisah ribuan. |
| `formatDate.js` | Format tanggal Indonesia untuk `published_at`. |
| `constants.js` | Konstanta aplikasi (daftar tipe hotspot, status, warna). |
| `storage.js` | Helper simpan/baca/hapus token login. |

### 3.4. Alur Data

```text
Page  →  services/*.js  →  (VITE_USE_MOCK=true)  → mocks/*.js
                        →  (VITE_USE_MOCK=false) → api.js → Laravel REST API
   ↓
Komponen (components/ & features/) menerima data lewat props
```

### 3.5. File Konfigurasi di Root

| File | Isi |
|---|---|
| `.env` | `VITE_USE_MOCK=true` dan `VITE_API_URL=http://localhost:8000/api/v1` |
| `vite.config.js` | Plugin React dan Tailwind. |
| `package.json` | Dependensi: `react`, `react-router-dom`, `axios`, `pannellum`, `lucide-react`, `tailwindcss`. |

---


## 4. Spesifikasi REST API (Laravel Backend)

Seluruh respons API menggunakan format JSON standar:
```json
{
  "success": true,
  "message": "Data berhasil dimuat",
  "data": { ... }
}
```

### 4.1. Endpoint Publik (User Portal)
- `GET /api/v1/tour/config`: Mengambil struktur lengkap scene, hotspot, dan wilayah awal untuk inisialisasi `Tour360`.
- `GET /api/v1/wilayah`: Mendapatkan daftar wilayah dan foto 360 yang tersedia di dalamnya.
- `GET /api/v1/scenes/{kode_scene}`: Mengambil metadata scene spesifik beserta relasi hotspot-nya.
- `GET /api/v1/programs`: Mendapatkan daftar semua program CSR (bisa difilter per wilayah atau kategori).
- `GET /api/v1/programs/{slug}`: Mendapatkan detail lengkap program CSR beserta artikel terkait.
- `GET /api/v1/impact-metrics`: Mendapatkan indikator capaian digital (SiMinah & Simon+).
- `POST /api/v1/inquiries`: Mengirimkan formulir pendaftaran mitra / kontak publik.

### 4.2. Endpoint Web Admin (Protected via Laravel Sanctum)
- `POST /api/v1/auth/login`: Autentikasi admin.
- `POST /api/v1/auth/logout`: Keluar sesi admin.
- `GET|POST|PUT|DELETE /api/v1/admin/wilayah`: CRUD Wilayah.
- `GET|POST|PUT|DELETE /api/v1/admin/scenes`: CRUD Scene 360 (termasuk upload file panorama).
- `GET|POST|PUT|DELETE /api/v1/admin/hotspots`: CRUD Hotspot (terintegrasi dengan `HotspotEditor`).
- `GET|POST|PUT|DELETE /api/v1/admin/programs`: CRUD Program CSR & galeri foto.
- `GET|POST|PUT|DELETE /api/v1/admin/articles`: CRUD Artikel berita program.
- `GET|POST|PUT|DELETE /api/v1/admin/impact-metrics`: Update angka capaian dampak real-time.
- `GET|PATCH /api/v1/admin/inquiries`: Melihat daftar pendaftaran masuk dan memperbarui status pemrosesan.

---

## 5. Fitur Kunci & User Experience (UX)

### 5.1. Alur Pengunjung (Public User)
1. **Pemuatan Beranda**:
   - `Tour360` memuat scene hub awal (Kilang Dumai) dengan transisi fade mulus.
   - Hotspot tampil secara interaktif: jika mouse diarahkan, muncul tooltip atau kartu pratinjau mini.
2. **Pindah Antar Scene / Wilayah**:
   - Pengunjung dapat klik portal di dalam 360 atau klik tombol pada `TourTabs` di bagian bawah.
   - Kamera 360 melakukan zoom perlahan (`hfovZoom: 25`), layar melakukan fade transisi, lalu scene baru termuat di sudut pandang tujuan.
   - Muncul tombol mengambang *"Kembali ke Titik Awal"* saat pengunjung berada di luar scene hub.
3. **Membaca Program CSR**:
   - Klik pada hotspot program di dalam 360 membuka `Modal` ringkasan.
   - Terdapat tombol *"Lihat Selengkapnya"* di dalam modal yang mengarahkan ke halaman `ProgramDetailPage` dengan layout modern, hero banner dinamis, deskripsi mendalam, galeri foto, dan daftar artikel terkait di `Sidebar`.
4. **Statistik Interaktif**:
   - Saat pengunjung melakukan scroll ke section `Stats`, angka donatur SiMinah dan ton jelantah beranimasi naik secara dinamis (*count-up animation*).

### 5.2. Alur Pengelola Konten (Admin CMS)
1. **Visual Hotspot Editor**:
   - Admin membuka menu kelola scene dan memilih foto 360.
   - Komponen `HotspotEditor` menampilkan foto 360.
   - Admin cukup **klik titik yang diinginkan pada foto 360**.
   - Koordinat `pitch` dan `yaw` otomatis terisi ke dalam modal form; Admin tinggal memilih tipe aksi (Pindah Scene ke mana, atau Hubungkan ke Program CSR mana).
2. **Manajemen Konten Fleksibel**:
   - Admin dapat menambah foto 360 baru kapan saja dalam suatu wilayah.
   - Konten program CSR menggunakan Rich-Text Editor untuk format tulisan yang rapi.
   - Angka statistik dampak (ton jelantah & donatur) dapat di-update berkala untuk laporan real-time.

---

## 6. Rencana Migrasi dari Prototype ke Real Web

> **Urutan pengerjaan yang dipakai: Frontend dulu (dengan data mock), baru Backend Laravel.** Tahap 2 dan 3 di bawah dikerjakan lebih dulu, lalu Tahap 1 (Laravel) menyusul. Setelah API siap, ganti `VITE_USE_MOCK=false`.

1. **Tahap 1: Setup Backend Laravel**
   - Inisialisasi project Laravel 11/12 & MySQL database.
   - Jalankan migration sesuai 9 skema tabel di atas.
   - Buat seeder berdasarkan data eksisting di prototype (`DESTINATIONS`, `PROGRAMS`, `TABS`, data statistik).
   - Implementasi autentikasi admin menggunakan Laravel Sanctum.
2. **Tahap 2: Setup Frontend React**
   - Inisialisasi Vite + React SPA.
   - Implementasikan komponen reusable dasar (`Navbar`, `Footer`, `Modal`, `Card`, `Hero`, `Stats`).
   - Buat modul `Tour360` dan `Hotspot` berbasis wrapper Pannellum.js / WebGL.
3. **Tahap 3: Implementasi Web Admin (CMS)**
   - Buat layout dashboard admin dan integrasi `Table` reusable.
   - Bangun `HotspotEditor` interaktif untuk penempatan titik secara visual.
4. **Tahap 4: Pengujian & Optimasi Aset**
   - Optimasi kompresi foto 360 (format WebP berkualitas tinggi dengan progressive loading).
   - Pengujian responsiveness pada perangkat mobile, tablet, dan desktop.
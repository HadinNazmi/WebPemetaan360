<?php

namespace Database\Seeders;

use App\Models\MetrikDampakDigital;
use App\Models\SistemCsr;
use Illuminate\Database\Seeder;

class SistemCsrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Sistem SiMinah
        $siminah = SistemCsr::updateOrCreate(
            ['kode_sistem' => 'siminah'],
            [
                'nama_sistem' => 'SiMinah',
                'badge_label' => 'SIRKULARITAS MINYAK JELANTAH',
                'deskripsi' => 'Sistem Informasi Pengelolaan Minyak Jelantah Berbasis Komunitas dan Digitalisasi Bank Sampah.',
                'gambar_cover' => 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
                'deskripsi_lengkap' => "SiMinah (Sistem Informasi Minyak Jelantah) merupakan platform digital inovatif hasil kolaborasi CSR PT Pertamina Patra Niaga bersama Politeknik Caltex Riau.\n\nPlatform ini memfasilitasi sirkularitas ekonomi limbah minyak jelantah dari rumah tangga, pelaku UMKM kuliner, dan komunitas masyarakat pesisir di sekitar wilayah operasi Dumai. Melalui aplikasi SiMinah, masyarakat dapat mendaftarkan diri sebagai donatur, memantau jadwal penjemputan jeriken jelantah secara terjadwal, dan mengonversi sedekah jelantah menjadi tabungan lingkungan atau insentif bernilai ekonomis.\n\nMinyak jelantah yang terkumpul disalurkan secara bertanggung jawab ke rantai pasok industri pengolahan energi terbarukan (biofuel/biodiesel), sekaligus mencegah pencemaran saluran air tanah dan ekosistem perairan pesisir.",
                'url_portal' => 'https://siminah.id',
                'fitur_keunggulan' => [
                    'Pencatatan Donatur & Bank Jelantah Digital',
                    'Tracking Logistik Penjemputan Jeriken Real-Time',
                    'Konversi Saldo Sedekah & Tabungan Komunitas',
                    'Kalkulator Reduksi Emisi Karbon Lingkungan',
                ],
                'logo_url' => '/images/logocsr.jpeg',
                'api_base_url' => 'https://api.siminah.example.com',
                'api_token_key' => null,
                'urutan' => 1,
                'is_active' => true,
            ]
        );

        MetrikDampakDigital::updateOrCreate(
            [
                'sistem_csr_id' => $siminah->id,
                'nama_metrik' => 'Donatur Terdaftar',
            ],
            [
                'kategori_label' => 'DONATUR TERDAFTAR (SIMINAH)',
                'api_endpoint_path' => '/api/v1/donatur/count',
                'api_response_field' => 'data.total',
                'nilai_cached' => 1250,
                'satuan' => 'Donatur',
                'sub_satuan' => null,
                'suffix' => '+',
                'format_angka' => 'integer',
                'deskripsi' => 'Jumlah warga dan unit usaha yang aktif mendonasikan minyak jelantah melalui aplikasi SiMinah.',
                'urutan' => 1,
                'is_active' => true,
                'last_synced_at' => now(),
            ]
        );

        MetrikDampakDigital::updateOrCreate(
            [
                'sistem_csr_id' => $siminah->id,
                'nama_metrik' => 'Minyak Jelantah',
            ],
            [
                'kategori_label' => 'MINYAK JELANTAH (SIMINAH)',
                'api_endpoint_path' => '/api/v1/jelantah/total',
                'api_response_field' => 'data.volume_ton',
                'nilai_cached' => 48.50,
                'satuan' => 'Ton',
                'sub_satuan' => '(Jelantah)',
                'suffix' => '+',
                'format_angka' => 'decimal',
                'deskripsi' => 'Total tonase minyak jelantah yang berhasil dikumpulkan dan dialihkan dari pencemaran lingkungan.',
                'urutan' => 2,
                'is_active' => true,
                'last_synced_at' => now(),
            ]
        );

        // 2. Sistem Simon+
        $simon = SistemCsr::updateOrCreate(
            ['kode_sistem' => 'simon_plus'],
            [
                'nama_sistem' => 'Simon+',
                'badge_label' => 'MONITORING & EVALUASI TJSL',
                'deskripsi' => 'Sistem Monitoring dan Evaluasi Kinerja Ketercapaian Program CSR Terpadu.',
                'gambar_cover' => 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
                'deskripsi_lengkap' => "Simon+ (Sistem Monitoring dan Evaluasi CSR) adalah platform terintegrasi manajemen program Tanggung Jawab Sosial dan Lingkungan (TJSL) PT Pertamina Patra Niaga.\n\nSistem ini dirancang bersama Politeknik Caltex Riau untuk menyajikan transparansi data, memantau indikator capaian Social Return on Investment (SROI), serta mengukur efektivitas intervensi program pemberdayaan masyarakat di berbagai pilar (Pendidikan, Kesehatan, Lingkungan, dan Kemandirian Ekonomi).\n\nSimon+ memudahkan seluruh pemangku kepentingan dalam memvalidasi penerima manfaat, merekam progres fisik dan keuangan bantuan, serta menghasilkan laporan akuntabilitas keberlanjutan yang sesuai dengan standar ISO 26000 dan target SDGs.",
                'url_portal' => 'https://simonplus.pertamina.com',
                'fitur_keunggulan' => [
                    'Dashboard Executive Ketercapaian SDGs & ESG',
                    'Kalkulasi Skor Dampak & SROI Terotomasi',
                    'Verifikasi Multi-Layer Penerima Manfaat',
                    'Ekspor Laporan Kinerja TJSL Standar ISO 26000',
                ],
                'logo_url' => '/images/Logo Pertamina Patra Niaga Horizontal.png',
                'api_base_url' => 'https://api.simonplus.example.com',
                'api_token_key' => null,
                'urutan' => 2,
                'is_active' => true,
            ]
        );

        MetrikDampakDigital::updateOrCreate(
            [
                'sistem_csr_id' => $simon->id,
                'nama_metrik' => 'Penerima Manfaat',
            ],
            [
                'kategori_label' => 'PENERIMA MANFAAT (SIMON+)',
                'api_endpoint_path' => '/api/v1/penerima-manfaat/count',
                'api_response_field' => 'data.total',
                'nilai_cached' => 8450,
                'satuan' => 'Jiwa',
                'sub_satuan' => null,
                'suffix' => '+',
                'format_angka' => 'integer',
                'deskripsi' => 'Total masyarakat di wilayah ring-1 dan sekitarnya yang merasakan dampak positif program CSR.',
                'urutan' => 3,
                'is_active' => true,
                'last_synced_at' => now(),
            ]
        );

        MetrikDampakDigital::updateOrCreate(
            [
                'sistem_csr_id' => $simon->id,
                'nama_metrik' => 'Desa Binaan',
            ],
            [
                'kategori_label' => 'DESA BINAAN (SIMON+)',
                'api_endpoint_path' => '/api/v1/desa/count',
                'api_response_field' => 'data.total',
                'nilai_cached' => 14,
                'satuan' => 'Wilayah',
                'sub_satuan' => null,
                'suffix' => null,
                'format_angka' => 'integer',
                'deskripsi' => 'Jumlah desa/kelompok binaan aktif dalam pendampingan program keberlanjutan.',
                'urutan' => 4,
                'is_active' => true,
                'last_synced_at' => now(),
            ]
        );
    }
}

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
                'deskripsi' => 'Sistem Informasi Pengelolaan Minyak Jelantah Berbasis Komunitas dan Digitalisasi Bank Sampah.',
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
                'deskripsi' => 'Sistem Monitoring dan Evaluasi Kinerja Ketercapaian Program CSR Terpadu.',
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

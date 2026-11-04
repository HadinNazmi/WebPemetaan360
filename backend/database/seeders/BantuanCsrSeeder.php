<?php

namespace Database\Seeders;

use App\Models\BantuanCsr;
use Illuminate\Database\Seeder;

class BantuanCsrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bantuanList = [
            [
                'judul_bantuan' => 'Bantuan Sarana Air Bersih & Sanitasi Lingkungan',
                'penjelasan_bantuan' => 'Pembangunan instalasi filtrasi air bersih dan fasilitas sanitasi terpadu untuk warga masyarakat di sekitar area operasi.',
                'gambar_cover' => '/assets/images/bantuan/air-bersih.jpg',
                'urutan' => 1,
                'is_active' => true,
            ],
            [
                'judul_bantuan' => 'Beasiswa Pendidikan & Perlengkapan Belajar Siswa',
                'penjelasan_bantuan' => 'Penyaluran beasiswa pendidikan dan perlengkapan sekolah bagi siswa berprestasi dari keluarga prasejahtera tingkat SD hingga SLTA.',
                'gambar_cover' => '/assets/images/bantuan/pendidikan.jpg',
                'urutan' => 2,
                'is_active' => true,
            ],
            [
                'judul_bantuan' => 'Pemberian Paket Makanan Tambahan & Alat Posyandu',
                'penjelasan_bantuan' => 'Pemberian nutrisi bergizi bagi balita dan penguatan sarana timbang serta tensimeter bagi posyandu binaan dalam pencegahan stunting.',
                'gambar_cover' => '/assets/images/bantuan/kesehatan.jpg',
                'urutan' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($bantuanList as $item) {
            BantuanCsr::updateOrCreate(
                ['judul_bantuan' => $item['judul_bantuan']],
                $item
            );
        }
    }
}

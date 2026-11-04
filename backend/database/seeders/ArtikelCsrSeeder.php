<?php

namespace Database\Seeders;

use App\Models\ArtikelCsr;
use Illuminate\Database\Seeder;

class ArtikelCsrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artikelList = [
            [
                'judul_artikel' => 'CSR Luncurkan Web Pemetaan 360 untuk Perkuat Transparansi Program Pemberdayaan',
                'kategori_tag' => 'SIARAN PERS',
                'gambar_cover' => '/assets/images/artikel/pemetaan-360-launch.jpg',
                'url_media' => 'https://pertamina.com/id/news-room/csr-pemetaan-360',
                'sumber_media' => 'Pertamina News',
                'tanggal_publikasi' => '2026-11-01',
                'is_featured' => true,
                'urutan' => 1,
                'is_active' => true,
            ],
            [
                'judul_artikel' => 'Digitalisasi Bank Sampah Jelantah SiMinah Raih Pengakuan Inovasi Sosial Berkelanjutan',
                'kategori_tag' => 'LIPUTAN MEDIA',
                'gambar_cover' => '/assets/images/artikel/siminah-award.jpg',
                'url_media' => 'https://mediaindonesia.com/ekonomi/siminah-csr-award',
                'sumber_media' => 'Media Indonesia',
                'tanggal_publikasi' => '2026-10-25',
                'is_featured' => false,
                'urutan' => 2,
                'is_active' => true,
            ],
            [
                'judul_artikel' => 'Kelompok Tani Binaan Mundam Berdikari Ekspor Produk Olahan Lele ke Pasar Regional',
                'kategori_tag' => 'LIPUTAN MEDIA',
                'gambar_cover' => '/assets/images/artikel/mundam-sukses.jpg',
                'url_media' => 'https://riaupos.jawapos.com/dumai/mundam-berdikari-sukses',
                'sumber_media' => 'Riau Pos',
                'tanggal_publikasi' => '2026-10-18',
                'is_featured' => false,
                'urutan' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($artikelList as $art) {
            ArtikelCsr::updateOrCreate(
                ['url_media' => $art['url_media']],
                $art
            );
        }
    }
}

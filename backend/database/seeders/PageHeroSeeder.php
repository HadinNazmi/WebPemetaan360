<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageHero;

class PageHeroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $heroes = [
            [
                'page_key' => 'katalog_produk',
                'page_name' => 'Katalog Produk UMKM',
                'title' => 'Katalog Produk UMKM Binaan',
                'subtitle' => 'Program TJSL CSR Pertamina Patra Niaga Dumai',
                'background_image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'page_key' => 'direktori_umkm',
                'page_name' => 'Direktori Kelompok UMKM',
                'title' => 'Direktori Kelompok UMKM Binaan',
                'subtitle' => 'Mitra TJSL CSR Pertamina Patra Niaga Dumai',
                'background_image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'page_key' => 'tentang_kami',
                'page_name' => 'Tentang Kami',
                'title' => 'Profil & Visi Misi Keberlanjutan',
                'subtitle' => 'TJSL PT Pertamina Patra Niaga Regional Dumai',
                'background_image' => 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
            ],
        ];

        foreach ($heroes as $hero) {
            PageHero::updateOrCreate(
                ['page_key' => $hero['page_key']],
                $hero
            );
        }
    }
}

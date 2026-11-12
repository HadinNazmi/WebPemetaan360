<?php

namespace Database\Seeders;

use App\Models\KelompokUmkm;
use App\Models\ProdukUmkm;
use Illuminate\Database\Seeder;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Wanita Mundam Berseri
        $wmb = KelompokUmkm::updateOrCreate(
            ['slug' => 'wanita-mundam-berseri'],
            [
                'nama_kelompok' => 'Wanita Mundam Berseri',
                'nama_ketua' => 'Hj. Ernawati',
                'nomor_wa' => '081268499201',
                'tahun_berdiri' => '2018',
                'angkatan' => 'Angkatan 2018',
                'jumlah_anggota' => 18,
                'kecamatan' => 'Kec. Medang Kampai',
                'alamat_lengkap' => 'Kelurahan Mundam, Kec. Medang Kampai, Kota Dumai, Riau',
                'deskripsi' => 'Kelompok usaha pengolahan pangan lokal dan olahan nanas khas Dumai yang diberdayakan oleh program CSR Pertamina Patra Niaga Dumai.',
                'foto_cover' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'berseri-juice'],
            [
                'kelompok_umkm_id' => $wmb->id,
                'nama_produk' => 'Berseri juice',
                'kategori' => 'Olahan Nanas & Kuliner',
                'harga' => 15000,
                'satuan' => 'per Botol',
                'foto_produk' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Jus nanas murni segar dari kebun binaan kelompok tanpa pemanis buatan.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'puding-berseri'],
            [
                'kelompok_umkm_id' => $wmb->id,
                'nama_produk' => 'Puding Berseri',
                'kategori' => 'Makanan Olahan Sayur',
                'harga' => 10000,
                'satuan' => 'per Kotak',
                'foto_produk' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Puding lembut bergizi berbahan dasar sayuran segar organik binaan kelompok.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'pinukuik-mundam-berseri'],
            [
                'kelompok_umkm_id' => $wmb->id,
                'nama_produk' => 'Pinukuik Mundam Berseri',
                'kategori' => 'Kue Basah Khas Minang',
                'harga' => 15000,
                'satuan' => 'per Paket',
                'foto_produk' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Kue tradisional pinukuik khas pesisir yang harum dan renyah di luar, empuk di dalam.',
                'is_tersedia' => true,
                'is_featured' => false,
            ]
        );

        // 2. Wirani Rejosari
        $wirani = KelompokUmkm::updateOrCreate(
            ['slug' => 'wirani-rejosari'],
            [
                'nama_kelompok' => 'Wirani Rejosari',
                'nama_ketua' => 'Maryati',
                'nomor_wa' => '082283940192',
                'tahun_berdiri' => '2020',
                'angkatan' => 'Angkatan 2020',
                'jumlah_anggota' => 12,
                'kecamatan' => 'Sungai Sembilan',
                'alamat_lengkap' => 'Kelurahan Tanjung Penyembal, Sungai Sembilan, Kota Dumai, Riau',
                'deskripsi' => 'Kelompok tani dan industri rumah tangga penghasil olahan singkong, sorgum, dan aneka kue kering tradisional berkualitas tinggi binaan CSR.',
                'foto_cover' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'keripik-singkong-rejosari-renyah'],
            [
                'kelompok_umkm_id' => $wirani->id,
                'nama_produk' => 'Keripik Singkong Rejosari Renyah',
                'kategori' => 'Olahan Singkong & Cemilan',
                'harga' => 18000,
                'satuan' => 'per kemasan 150g',
                'foto_produk' => 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Keripik singkong gurih renyah diproses higienis dari singkong pilihan petani lokal.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'sorgum-rejosari'],
            [
                'kelompok_umkm_id' => $wirani->id,
                'nama_produk' => 'Sorgum Rejosari',
                'kategori' => 'Pertanian & Pangan Lokal',
                'harga' => 35000,
                'satuan' => 'per kemasan 1kg',
                'foto_produk' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Biji sorgum pilihan kaya serat, rendah gula, dan bebas gluten hasil panen mitra binaan.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'keripik-sorgum'],
            [
                'kelompok_umkm_id' => $wirani->id,
                'nama_produk' => 'Keripik Sorgum',
                'kategori' => 'Olahan Singkong & Cemilan',
                'harga' => 20000,
                'satuan' => 'per kemasan 150g',
                'foto_produk' => 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Camilan sehat bernutrisi tinggi olahan biji sorgum dengan bumbu gurih rempah alami.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'kue-kacang-rejosari'],
            [
                'kelompok_umkm_id' => $wirani->id,
                'nama_produk' => 'Kue Kacang Rejosari',
                'kategori' => 'Kue Kering & Tradisional',
                'harga' => 20000,
                'satuan' => 'per kemasan 200g',
                'foto_produk' => 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Kue kacang gurih lumer di mulut dibuat dengan resep turun temurun.',
                'is_tersedia' => true,
                'is_featured' => false,
            ]
        );

        // 3. Mundam Jaya
        $mj = KelompokUmkm::updateOrCreate(
            ['slug' => 'mundam-jaya'],
            [
                'nama_kelompok' => 'Mundam Jaya',
                'nama_ketua' => 'Sulaiman',
                'nomor_wa' => '082171797107',
                'tahun_berdiri' => '2023',
                'angkatan' => 'Angkatan 2010',
                'jumlah_anggota' => 15,
                'kecamatan' => 'Kec. Medang Kampai',
                'alamat_lengkap' => 'Jl. Lintas Dumai-Pakning, Kelurahan Mundam, Kec. Medang Kampai, Kota Dumai',
                'deskripsi' => 'Kelompok budidaya lebah madu mangrove dan olahan hasil tangkapan laut pesisir Dumai binaan TJSL PT Pertamina Patra Niaga RU Dumai.',
                'foto_cover' => 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'madu-hutan-lebah-mangrove'],
            [
                'kelompok_umkm_id' => $mj->id,
                'nama_produk' => 'Madu Hutan Lebah Mangrove',
                'kategori' => 'Madu Hutan & Herbal',
                'harga' => 85000,
                'satuan' => 'per Botol 250ml',
                'foto_produk' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Madu asli lebah nektar bunga mangrove pesisir Dumai berkhasiat tinggi menjaga imunitas.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );

        ProdukUmkm::updateOrCreate(
            ['slug' => 'ikan-asin-tenggiri-pesisir'],
            [
                'kelompok_umkm_id' => $mj->id,
                'nama_produk' => 'Ikan Asin Tenggiri Pesisir',
                'kategori' => 'Olah Laut & Seafood',
                'harga' => 55000,
                'satuan' => 'per pack 500g',
                'foto_produk' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
                'deskripsi_produk' => 'Ikan tenggiri segar olahan nelayan pesisir dengan penggaraman higienis dan pengeringan alami.',
                'is_tersedia' => true,
                'is_featured' => true,
            ]
        );
    }
}


<?php

namespace Database\Seeders;

use App\Models\ProgramCsr;
use Illuminate\Database\Seeder;

class ProgramCsrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'nama_program' => 'Program Kampung Mundam Berdikari',
                'slug' => 'program-kampung-mundam-berdikari',
                'pilar_kategori' => 'Pemberdayaan Masyarakat',
                'gambar_cover' => '/assets/images/programs/mundam-berdikari.jpg',
                'ringkasan' => 'Pengembangan kemandirian pangan, budidaya perikanan air tawar, dan diversifikasi produk olahan lele berbasis kelompok wanita tani.',
                'deskripsi_lengkap' => '<p>Program Kampung Mundam Berdikari hadir sebagai langkah nyata pemberdayaan warga melalui pembinaan terpadu budidaya ikan lele sistem bioflok, pembuatan pakan mandiri, hingga hilirisasi produk keripik dan abon lele.</p><p>Hingga saat ini, kelompok telah mencetak omzet mandiri dan mampu menyerap tenaga kerja lokal di wilayah sekitar operasional.</p>',
                'galeri_foto' => [
                    '/assets/images/programs/mundam-1.jpg',
                    '/assets/images/programs/mundam-2.jpg',
                    '/assets/images/programs/mundam-3.jpg',
                ],
                'lokasi' => 'Kelurahan Mundam',
                'link_eksternal' => null,
                'urutan' => 1,
                'is_active' => true,
            ],
            [
                'nama_program' => 'Konservasi Mangrove & Pesisir Lestari',
                'slug' => 'konservasi-mangrove-pesisir-lestari',
                'pilar_kategori' => 'Pelestarian Lingkungan',
                'gambar_cover' => '/assets/images/programs/mangrove-pesisir.jpg',
                'ringkasan' => 'Rehabilitasi ekosistem pesisir dengan penanaman bibit mangrove serta edukasi ekowisata berbasis komunitas setempat.',
                'deskripsi_lengkap' => '<p>Program Konservasi Mangrove bertujuan melindungi kawasan pesisir dari ancaman abrasi sekaligus memulihkan keanekaragaman hayati perairan. Melibatkan generasi muda dan kelompok pegiat lingkungan lokal.</p>',
                'galeri_foto' => [
                    '/assets/images/programs/mangrove-1.jpg',
                    '/assets/images/programs/mangrove-2.jpg',
                ],
                'lokasi' => 'Pesisir Dumai',
                'link_eksternal' => null,
                'urutan' => 2,
                'is_active' => true,
            ],
            [
                'nama_program' => 'Inovasi SiMinah - Sirkular Jelantah',
                'slug' => 'inovasi-siminah-sirkular-jelantah',
                'pilar_kategori' => 'Ekonomi Sirkular',
                'gambar_cover' => '/assets/images/programs/siminah-showcase.jpg',
                'ringkasan' => 'Digitalisasi bank jelantah untuk mencegah pencemaran saluran air dan mengubah limbah dapur menjadi lilin aromaterapi serta bahan baku biodiesel.',
                'deskripsi_lengkap' => '<p>Inisiatif SiMinah mengintegrasikan edukasi rumah tangga, bank pengumpulan berbasis RT/RW, dan platform pencatatan digital agar setiap tetes jelantah bernilai rupiah bagi masyarakat.</p>',
                'galeri_foto' => [
                    '/assets/images/programs/siminah-1.jpg',
                    '/assets/images/programs/siminah-2.jpg',
                ],
                'lokasi' => 'Kecamatan Medang Kampai',
                'link_eksternal' => null,
                'urutan' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($programs as $prog) {
            ProgramCsr::updateOrCreate(
                ['slug' => $prog['slug']],
                $prog
            );
        }
    }
}

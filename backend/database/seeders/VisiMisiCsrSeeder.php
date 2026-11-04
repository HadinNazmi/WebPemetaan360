<?php

namespace Database\Seeders;

use App\Models\VisiMisiCsr;
use Illuminate\Database\Seeder;

class VisiMisiCsrSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VisiMisiCsr::updateOrCreate(
            ['id' => 1],
            [
                'eyebrow' => 'VISI & MISI CSR',
                'judul_utama' => 'Mewujudkan Kemandirian dan Keberlanjutan Komunitas',
                'deskripsi_pengantar' => 'Komitmen terpadu kami dalam memberdayakan masyarakat, mendorong ekonomi sirkular, dan menjaga kelestarian lingkungan melalui integrasi data digital yang transparan dan akuntabel.',
                'visi' => 'Menjadi pionir pemberdayaan masyarakat dan pelestarian lingkungan hidup berkelanjutan yang menciptakan kemandirian sosial-ekonomi bagi generasi kini dan masa depan.',
                'misi' => "1. Mendorong kemandirian ekonomi masyarakat melalui pelatihan keterampilan, penguatan UMKM, dan rantai pasok lokal.\n2. Mengakselerasi transisi hijau dan pengelolaan lingkungan hidup berbasis circular economy.\n3. Mengimplementasikan tata kelola program CSR yang adaptif, transparan, dan terukur berbasis teknologi pemetaan digital 360.",
                'logo_url' => '/assets/images/csr-logo.png',
                'url_selengkapnya' => '#program',
                'is_active' => true,
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Models\HeroPanorama360;
use App\Models\Hotspot360;
use App\Models\ProgramCsr;
use App\Models\Scene360;
use App\Models\Wilayah360;
use Illuminate\Database\Seeder;

class Tour360Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Wilayah Utama: Mundam Jaya
        $wilayah = Wilayah360::firstOrCreate(
            ['slug' => 'mundam-jaya'],
            [
                'nama_wilayah' => 'Mundam Jaya',
                'deskripsi' => 'Kawasan binaan program CSR terpadu PT Pertamina Patra Niaga di Kelurahan Mundam Jaya, Dumai, Riau.',
                'gambar_cover' => 'https://www.pertamina.com/file/files/2025/05/publikasi-laporan-tahunan-hero-alt.webp',
                'lokasi_koordinat' => 'Dumai, Riau',
                'urutan' => 1,
                'is_active' => true,
            ]
        );

        // 2. Scene 1: Gerbang Utama
        $sceneGerbang = Scene360::firstOrCreate(
            [
                'wilayah_id' => $wilayah->id,
                'slug' => 'gerbang-utama',
            ],
            [
                'nama_scene' => 'Gerbang Utama Kawasan',
                'foto_panorama' => 'https://pannellum.org/images/alma.jpg',
                'default_pitch' => 0.0,
                'default_yaw' => 0.0,
                'default_hfov' => 100.0,
                'urutan' => 1,
                'is_active' => true,
            ]
        );

        // 3. Scene 2: Sentra Produksi & Kebun
        $sceneSentra = Scene360::firstOrCreate(
            [
                'wilayah_id' => $wilayah->id,
                'slug' => 'sentra-produksi',
            ],
            [
                'nama_scene' => 'Sentra Produksi & Kebun Binaan',
                'foto_panorama' => 'https://pannellum.org/images/cerro-toco-0.jpg',
                'default_pitch' => 0.0,
                'default_yaw' => 0.0,
                'default_hfov' => 100.0,
                'urutan' => 2,
                'is_active' => true,
            ]
        );

        // Set initial scene
        $wilayah->update(['initial_scene_id' => $sceneGerbang->id]);

        // Cari 1 program CSR untuk dihubungkan
        $sampleProgram = ProgramCsr::first();

        // 4. Hotspots di Scene 1:
        // Hotspot A (Mode 3: Popup Preview Dulu Baru Pindah) -> Menuju Scene 2
        Hotspot360::firstOrCreate(
            [
                'scene_id' => $sceneGerbang->id,
                'target_scene_id' => $sceneSentra->id,
            ],
            [
                'tipe' => 'popup_then_move',
                'pitch' => -3.5,
                'yaw' => 20.0,
                'judul_hotspot' => 'Sentra Produksi & Kebun Binaan',
                'deskripsi_hotspot' => 'Pusat kegiatan pemberdayaan masyarakat dan budidaya tanaman ramah lingkungan binaan Pertamina.',
                'teks_tombol' => 'Masuk ke Sentra Produksi ➔',
                'ikon_hotspot' => 'arrow',
            ]
        );

        // 5. Hotspots di Scene 2:
        // Hotspot B (Mode 1: Langsung Pindah) -> Kembali ke Scene 1
        Hotspot360::firstOrCreate(
            [
                'scene_id' => $sceneSentra->id,
                'target_scene_id' => $sceneGerbang->id,
            ],
            [
                'tipe' => 'direct',
                'pitch' => -5.0,
                'yaw' => 180.0,
                'judul_hotspot' => 'Kembali ke Gerbang Utama',
                'teks_tombol' => 'Kembali ke Gerbang',
                'ikon_hotspot' => 'arrow',
            ]
        );

        // Hotspot C (Mode 2: Pop-up Saja Program CSR)
        Hotspot360::firstOrCreate(
            [
                'scene_id' => $sceneSentra->id,
                'tipe' => 'popup_only',
                'judul_hotspot' => 'Profil Program Binaan',
            ],
            [
                'pitch' => 8.0,
                'yaw' => -35.0,
                'program_id' => $sampleProgram ? $sampleProgram->id : null,
                'judul_hotspot' => 'Profil Program Binaan',
                'deskripsi_hotspot' => 'Program pemberdayaan sirkularitas ekonomi untuk peningkatan kesejahteraan masyarakat.',
                'teks_tombol' => 'Buka Profil Program',
                'ikon_hotspot' => 'program',
            ]
        );

        // 6. Panorama Hero Beranda (Aerial View Kilang 360)
        HeroPanorama360::firstOrCreate(
            ['id' => 1],
            [
                'judul' => 'Aerial View Kilang Pertamina Dumai 360°',
                'foto_panorama' => 'https://pannellum.org/images/alma.jpg',
                'default_pitch' => -8.0,
                'default_yaw' => 25.0,
                'default_hfov' => 100.0,
                'auto_rotate_speed' => -1.0,
                'pins' => [
                    [
                        'id' => 'pin-mundam',
                        'wilayah_id' => $wilayah->id,
                        'pitch' => -12.0,
                        'yaw' => 35.0,
                        'label' => 'Kawasan Binaan Mundam Jaya',
                    ],
                ],
                'is_active' => true,
            ]
        );
    }
}


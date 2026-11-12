<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroPanorama360;
use App\Models\Wilayah360;
use Illuminate\Http\JsonResponse;

class Tour360PublicController extends Controller
{
    /**
     * Mengambil konfigurasi panorama 360 kilang udara utama untuk Hero Section beranda.
     */
    public function getHeroPanorama(): JsonResponse
    {
        $hero = HeroPanorama360::where('is_active', true)->first();

        if (! $hero) {
            // Fallback default jika belum diatur
            $hero = HeroPanorama360::firstOrCreate([], [
                'judul' => 'Aerial View Kilang Pertamina Dumai 360°',
                'foto_panorama' => 'https://pannellum.org/images/alma.jpg',
                'default_pitch' => -10.0,
                'default_yaw' => 0.0,
                'default_hfov' => 100.0,
                'auto_rotate_speed' => -1.2,
                'pins' => [],
                'is_active' => true,
            ]);
        }

        // Lengkapi data pins dengan relasi ke Wilayah360
        $enrichedPins = [];
        $pins = $hero->pins ?? [];
        if (is_array($pins)) {
            foreach ($pins as $pin) {
                $wilayahId = $pin['wilayah_id'] ?? null;
                $wilayah = $wilayahId ? Wilayah360::find($wilayahId) : null;
                $enrichedPins[] = [
                    'id' => $pin['id'] ?? (string) rand(1000, 9999),
                    'wilayah_id' => $wilayahId,
                    'pitch' => (float) ($pin['pitch'] ?? 0.0),
                    'yaw' => (float) ($pin['yaw'] ?? 0.0),
                    'label' => $pin['label'] ?? ($wilayah ? $wilayah->nama_wilayah : 'Kawasan Binaan'),
                    'wilayah' => $wilayah ? [
                        'id' => $wilayah->id,
                        'nama_wilayah' => $wilayah->nama_wilayah,
                        'slug' => $wilayah->slug,
                        'deskripsi' => $wilayah->deskripsi,
                        'gambar_cover' => $wilayah->gambar_cover,
                        'lokasi_koordinat' => $wilayah->lokasi_koordinat,
                    ] : null,
                ];
            }
        }

        $heroData = $hero->toArray();
        $heroData['pins'] = $enrichedPins;

        return response()->json([
            'success' => true,
            'data' => $heroData,
        ]);
    }

    /**
     * Mengambil daftar Wilayah Virtual Tour 360 yang aktif.
     */
    public function getWilayahList(): JsonResponse
    {
        $wilayah = Wilayah360::with(['initialScene:id,nama_scene,foto_panorama'])
            ->withCount(['scenes' => function ($q) {
                $q->where('is_active', true);
            }])
            ->where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wilayah,
        ]);
    }

    /**
     * Mengambil paket lengkap satu Wilayah Virtual Tour 360 berdasarkan slug.
     * Termasuk seluruh scene yang aktif, hotspots, target scene, dan data program CSR terhubung.
     */
    public function getTourDetail(string $slug): JsonResponse
    {
        $wilayah = Wilayah360::with([
            'initialScene',
            'scenes' => function ($q) {
                $q->where('is_active', true)->orderBy('urutan', 'asc');
            },
            'scenes.hotspots' => function ($q) {
                $q->with([
                    'targetScene:id,nama_scene,slug,foto_panorama,default_pitch,default_yaw',
                    'program:id,nama_program,slug,pilar_kategori,gambar_cover,ringkasan',
                ]);
            },
        ])
        ->where('slug', $slug)
        ->where('is_active', true)
        ->first();

        if (! $wilayah) {
            return response()->json([
                'success' => false,
                'message' => 'Wilayah Virtual Tour 360 tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $wilayah,
        ]);
    }
}


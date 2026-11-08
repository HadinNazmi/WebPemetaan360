<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wilayah360;
use Illuminate\Http\JsonResponse;

class Tour360PublicController extends Controller
{
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

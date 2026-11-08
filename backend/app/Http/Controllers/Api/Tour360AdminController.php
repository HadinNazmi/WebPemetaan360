<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotspot360;
use App\Models\Scene360;
use App\Models\Wilayah360;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class Tour360AdminController extends Controller
{
    // ==========================================
    // 1. KELOLA MASTER WILAYAH 360
    // ==========================================

    public function listWilayah(): JsonResponse
    {
        $wilayah = Wilayah360::with(['initialScene'])
            ->withCount('scenes')
            ->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wilayah,
        ]);
    }

    public function storeWilayah(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_wilayah' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:wilayah_360,slug',
            'deskripsi' => 'nullable|string',
            'gambar_cover' => 'nullable|string|max:255',
            'lokasi_koordinat' => 'nullable|string|max:150',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['nama_wilayah']).'-'.Str::random(4);
        }

        $wilayah = Wilayah360::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wilayah 360 berhasil ditambahkan.',
            'data' => $wilayah,
        ], 201);
    }

    public function showWilayah(int $id): JsonResponse
    {
        $wilayah = Wilayah360::with([
            'scenes' => function ($q) {
                $q->orderBy('urutan', 'asc');
            },
            'initialScene',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $wilayah,
        ]);
    }

    public function updateWilayah(Request $request, int $id): JsonResponse
    {
        $wilayah = Wilayah360::findOrFail($id);

        $validated = $request->validate([
            'nama_wilayah' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:wilayah_360,slug,'.$id,
            'deskripsi' => 'nullable|string',
            'gambar_cover' => 'nullable|string|max:255',
            'lokasi_koordinat' => 'nullable|string|max:150',
            'initial_scene_id' => 'nullable|integer|exists:scene_360,id',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $wilayah->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wilayah 360 berhasil diperbarui.',
            'data' => $wilayah,
        ]);
    }

    public function destroyWilayah(int $id): JsonResponse
    {
        $wilayah = Wilayah360::findOrFail($id);
        $wilayah->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wilayah 360 beserta seluruh scene dan hotspot berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 2. KELOLA SCENE (TITIK PANORAMA 360)
    // ==========================================

    public function listScenes(int $wilayahId): JsonResponse
    {
        $scenes = Scene360::where('wilayah_id', $wilayahId)
            ->withCount('hotspots')
            ->orderBy('urutan', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $scenes,
        ]);
    }

    public function storeScene(Request $request, int $wilayahId): JsonResponse
    {
        $wilayah = Wilayah360::findOrFail($wilayahId);

        $validated = $request->validate([
            'nama_scene' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'foto_panorama' => 'required|string|max:255',
            'default_pitch' => 'nullable|numeric',
            'default_yaw' => 'nullable|numeric',
            'default_hfov' => 'nullable|numeric',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'set_as_initial' => 'nullable|boolean',
        ]);

        $validated['wilayah_id'] = $wilayah->id;
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['nama_scene']).'-'.Str::random(4);
        }

        $scene = Scene360::create($validated);

        // Jika dipilih sebagai titik utama atau jika ini scene pertama yang dibuat
        if (! empty($validated['set_as_initial']) || empty($wilayah->initial_scene_id)) {
            $wilayah->update(['initial_scene_id' => $scene->id]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Scene 360 berhasil ditambahkan.',
            'data' => $scene,
        ], 201);
    }

    public function showScene(int $id): JsonResponse
    {
        $scene = Scene360::with([
            'wilayah',
            'hotspots.targetScene:id,nama_scene,foto_panorama',
            'hotspots.program:id,nama_program,slug,pilar_kategori,gambar_cover,ringkasan',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $scene,
        ]);
    }

    public function updateScene(Request $request, int $id): JsonResponse
    {
        $scene = Scene360::findOrFail($id);

        $validated = $request->validate([
            'nama_scene' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'foto_panorama' => 'sometimes|required|string|max:255',
            'default_pitch' => 'nullable|numeric',
            'default_yaw' => 'nullable|numeric',
            'default_hfov' => 'nullable|numeric',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $scene->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Scene 360 berhasil diperbarui.',
            'data' => $scene,
        ]);
    }

    public function setInitialScene(int $id): JsonResponse
    {
        $scene = Scene360::findOrFail($id);
        $wilayah = Wilayah360::findOrFail($scene->wilayah_id);
        $wilayah->update(['initial_scene_id' => $scene->id]);

        return response()->json([
            'success' => true,
            'message' => "Scene '{$scene->nama_scene}' dijadikan titik masuk utama.",
            'data' => $wilayah,
        ]);
    }

    public function destroyScene(int $id): JsonResponse
    {
        $scene = Scene360::findOrFail($id);
        $wilayahId = $scene->wilayah_id;

        // Jika scene ini adalah initial scene, lepas referensinya
        $wilayah = Wilayah360::find($wilayahId);
        if ($wilayah && $wilayah->initial_scene_id === $scene->id) {
            $fallback = Scene360::where('wilayah_id', $wilayahId)
                ->where('id', '!=', $scene->id)
                ->first();
            $wilayah->update(['initial_scene_id' => $fallback ? $fallback->id : null]);
        }

        $scene->delete();

        return response()->json([
            'success' => true,
            'message' => 'Scene 360 berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 3. KELOLA HOTSPOT (TITIK INTERAKTIF)
    // ==========================================

    public function listHotspots(int $sceneId): JsonResponse
    {
        $hotspots = Hotspot360::where('scene_id', $sceneId)
            ->with([
                'targetScene:id,nama_scene,foto_panorama',
                'program:id,nama_program,slug,pilar_kategori,gambar_cover,ringkasan',
            ])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $hotspots,
        ]);
    }

    public function storeHotspot(Request $request, int $sceneId): JsonResponse
    {
        $sourceScene = Scene360::findOrFail($sceneId);

        $validated = $request->validate([
            'tipe' => 'required|in:direct,popup_only,popup_then_move',
            'pitch' => 'required|numeric',
            'yaw' => 'required|numeric',
            'target_scene_id' => 'nullable|integer|exists:scene_360,id',
            'target_pitch' => 'nullable|numeric',
            'target_yaw' => 'nullable|numeric',
            'program_id' => 'nullable|integer|exists:program_csr,id',
            'judul_hotspot' => 'nullable|string|max:255',
            'deskripsi_hotspot' => 'nullable|string',
            'gambar_popup' => 'nullable|string|max:255',
            'teks_tombol' => 'nullable|string|max:100',
            'ikon_hotspot' => 'nullable|string|max:50',
            'auto_reverse' => 'nullable|boolean', // Buat titik balik otomatis
        ]);

        $validated['scene_id'] = $sourceScene->id;
        $autoReverse = ! empty($validated['auto_reverse']);
        unset($validated['auto_reverse']);

        $hotspot = Hotspot360::create($validated);

        // Jika auto_reverse dicentang dan ada target_scene_id
        if ($autoReverse && ! empty($validated['target_scene_id'])) {
            $targetSceneId = (int) $validated['target_scene_id'];
            if ($targetSceneId !== $sourceScene->id) {
                // Buat titik balik dari targetScene menuju sourceScene (posisi default berlawanan arah ~180 derajat)
                $reverseYaw = fmod(($validated['yaw'] + 180.0), 360.0);
                if ($reverseYaw > 180.0) {
                    $reverseYaw -= 360.0;
                }

                Hotspot360::create([
                    'scene_id' => $targetSceneId,
                    'tipe' => 'direct',
                    'pitch' => -10.0,
                    'yaw' => $reverseYaw,
                    'target_scene_id' => $sourceScene->id,
                    'judul_hotspot' => 'Kembali ke '.$sourceScene->nama_scene,
                    'teks_tombol' => 'Kembali',
                    'ikon_hotspot' => 'arrow',
                ]);
            }
        }

        $hotspot->load([
            'targetScene:id,nama_scene,foto_panorama',
            'program:id,nama_program,slug,pilar_kategori,gambar_cover,ringkasan',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hotspot interaktif berhasil ditambahkan.',
            'data' => $hotspot,
        ], 201);
    }

    public function updateHotspot(Request $request, int $id): JsonResponse
    {
        $hotspot = Hotspot360::findOrFail($id);

        $validated = $request->validate([
            'tipe' => 'sometimes|required|in:direct,popup_only,popup_then_move',
            'pitch' => 'sometimes|required|numeric',
            'yaw' => 'sometimes|required|numeric',
            'target_scene_id' => 'nullable|integer|exists:scene_360,id',
            'target_pitch' => 'nullable|numeric',
            'target_yaw' => 'nullable|numeric',
            'program_id' => 'nullable|integer|exists:program_csr,id',
            'judul_hotspot' => 'nullable|string|max:255',
            'deskripsi_hotspot' => 'nullable|string',
            'gambar_popup' => 'nullable|string|max:255',
            'teks_tombol' => 'nullable|string|max:100',
            'ikon_hotspot' => 'nullable|string|max:50',
        ]);

        $hotspot->update($validated);
        $hotspot->load([
            'targetScene:id,nama_scene,foto_panorama',
            'program:id,nama_program,slug,pilar_kategori,gambar_cover,ringkasan',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hotspot interaktif berhasil diperbarui.',
            'data' => $hotspot,
        ]);
    }

    public function destroyHotspot(int $id): JsonResponse
    {
        $hotspot = Hotspot360::findOrFail($id);
        $hotspot->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hotspot berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 4. UPLOAD MEDIA TOUR 360 (STANDAR HOSTINGER)
    // ==========================================

    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|image|mimes:jpeg,png,jpg,webp|max:25600', // Foto 360 bisa beresolusi tinggi s.d 25MB
            'type' => 'nullable|in:panoramas,cover,hotspots',
            'wilayah_slug' => 'nullable|string|alpha_dash|max:100',
        ]);

        $file = $request->file('file');
        $type = $request->input('type', 'panoramas');
        $wilayahSlug = $request->input('wilayah_slug', 'general');

        $folderRelative = 'tour360/'.$wilayahSlug.'/'.$type;
        $targetDir = public_path('uploads/'.$folderRelative);

        if (! File::isDirectory($targetDir)) {
            File::makeDirectory($targetDir, 0755, true, true);
        }

        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $safeName = time().'_'.Str::random(8).'.'.$extension;

        $file->move($targetDir, $safeName);

        $relativePath = '/uploads/'.$folderRelative.'/'.$safeName;
        $fullUrl = url($relativePath);

        return response()->json([
            'success' => true,
            'message' => 'Foto 360 berhasil diunggah.',
            'data' => [
                'path' => $relativePath,
                'url' => $fullUrl,
                'filename' => $safeName,
            ],
        ]);
    }
}

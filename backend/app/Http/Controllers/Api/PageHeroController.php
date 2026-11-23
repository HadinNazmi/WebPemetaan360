<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageHero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PageHeroController extends Controller
{
    /**
     * Mengambil seluruh data hero halaman (Publik).
     */
    public function index(): JsonResponse
    {
        $heroes = PageHero::all()->keyBy('page_key');

        return response()->json([
            'success' => true,
            'data' => $heroes,
        ]);
    }

    /**
     * Mengambil detail satu hero halaman berdasarkan key (Publik).
     */
    public function show(string $pageKey): JsonResponse
    {
        $hero = PageHero::where('page_key', $pageKey)->first();

        if (!$hero) {
            return response()->json([
                'success' => false,
                'message' => 'Hero halaman tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $hero,
        ]);
    }

    /**
     * Update hero halaman (Admin).
     * Mendukung upload file gambar atau URL gambar.
     */
    public function update(Request $request, string $pageKey): JsonResponse
    {
        $hero = PageHero::where('page_key', $pageKey)->first();

        if (!$hero) {
            return response()->json([
                'success' => false,
                'message' => 'Hero halaman tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'background_image' => 'nullable|string|max:500',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // Maks 5MB
        ]);

        $hero->title = $validated['title'];
        $hero->subtitle = $validated['subtitle'] ?? null;

        // Jika upload file gambar baru
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $uploadDir = public_path('uploads/heroes');

            if (!File::exists($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true);
            }

            // Hapus file lama jika ada di uploads/heroes
            if ($hero->background_image && Str::contains($hero->background_image, '/uploads/heroes/')) {
                $oldFilename = basename($hero->background_image);
                $oldPath = $uploadDir . '/' . $oldFilename;
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $extension = $file->getClientOriginalExtension();
            $filename = 'hero_' . $pageKey . '_' . time() . '.' . $extension;
            $file->move($uploadDir, $filename);

            $hero->background_image = '/uploads/heroes/' . $filename;
        } elseif (isset($validated['background_image']) && !empty($validated['background_image'])) {
            $hero->background_image = $validated['background_image'];
        }

        $hero->save();

        return response()->json([
            'success' => true,
            'message' => "Banner hero {$hero->page_name} berhasil diperbarui",
            'data' => $hero,
        ]);
    }
}

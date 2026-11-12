<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KelompokUmkm;
use App\Models\ProdukUmkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UmkmAdminController extends Controller
{
    // ==========================================
    // 1. Kelompok UMKM Admin CRUD
    // ==========================================

    public function getKelompokList(Request $request): JsonResponse
    {
        $kelompok = KelompokUmkm::withCount('produk')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $kelompok,
        ]);
    }

    public function storeKelompok(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kelompok' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:kelompok_umkm,slug',
            'nama_ketua' => 'required|string|max:150',
            'nomor_wa' => 'required|string|max:30',
            'tahun_berdiri' => 'nullable|string|max:10',
            'angkatan' => 'nullable|string|max:50',
            'jumlah_anggota' => 'nullable|integer|min:0',
            'kecamatan' => 'required|string|max:100',
            'alamat_lengkap' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'foto_cover' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['nama_kelompok']).'-'.Str::random(4);
        }

        $kelompok = KelompokUmkm::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kelompok UMKM berhasil ditambahkan.',
            'data' => $kelompok,
        ], 201);
    }

    public function updateKelompok(Request $request, int $id): JsonResponse
    {
        $kelompok = KelompokUmkm::findOrFail($id);

        $validated = $request->validate([
            'nama_kelompok' => 'sometimes|required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:kelompok_umkm,slug,'.$id,
            'nama_ketua' => 'sometimes|required|string|max:150',
            'nomor_wa' => 'sometimes|required|string|max:30',
            'tahun_berdiri' => 'nullable|string|max:10',
            'angkatan' => 'nullable|string|max:50',
            'jumlah_anggota' => 'nullable|integer|min:0',
            'kecamatan' => 'sometimes|required|string|max:100',
            'alamat_lengkap' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'foto_cover' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $kelompok->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kelompok UMKM berhasil diperbarui.',
            'data' => $kelompok,
        ]);
    }

    public function deleteKelompok(int $id): JsonResponse
    {
        $kelompok = KelompokUmkm::findOrFail($id);
        $kelompok->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kelompok UMKM dan produk terkait berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 2. Produk UMKM Admin CRUD
    // ==========================================

    public function getProdukList(Request $request): JsonResponse
    {
        $produk = ProdukUmkm::with('kelompok:id,nama_kelompok,nama_ketua,nomor_wa,kecamatan')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $produk,
        ]);
    }

    public function storeProduk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kelompok_umkm_id' => 'required|exists:kelompok_umkm,id',
            'nama_produk' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:produk_umkm,slug',
            'kategori' => 'required|string|max:100',
            'harga' => 'required|integer|min:0',
            'satuan' => 'nullable|string|max:50',
            'foto_produk' => 'nullable|string',
            'deskripsi_produk' => 'nullable|string',
            'is_tersedia' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['nama_produk']).'-'.Str::random(4);
        }

        $produk = ProdukUmkm::create($validated);
        $produk->load('kelompok:id,nama_kelompok,nama_ketua,nomor_wa,kecamatan');

        return response()->json([
            'success' => true,
            'message' => 'Produk UMKM berhasil ditambahkan.',
            'data' => $produk,
        ], 201);
    }

    public function updateProduk(Request $request, int $id): JsonResponse
    {
        $produk = ProdukUmkm::findOrFail($id);

        $validated = $request->validate([
            'kelompok_umkm_id' => 'sometimes|required|exists:kelompok_umkm,id',
            'nama_produk' => 'sometimes|required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:produk_umkm,slug,'.$id,
            'kategori' => 'sometimes|required|string|max:100',
            'harga' => 'sometimes|required|integer|min:0',
            'satuan' => 'nullable|string|max:50',
            'foto_produk' => 'nullable|string',
            'deskripsi_produk' => 'nullable|string',
            'is_tersedia' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
        ]);

        $produk->update($validated);
        $produk->load('kelompok:id,nama_kelompok,nama_ketua,nomor_wa,kecamatan');

        return response()->json([
            'success' => true,
            'message' => 'Produk UMKM berhasil diperbarui.',
            'data' => $produk,
        ]);
    }

    public function deleteProduk(int $id): JsonResponse
    {
        $produk = ProdukUmkm::findOrFail($id);
        $produk->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk UMKM berhasil dihapus.',
        ]);
    }
}


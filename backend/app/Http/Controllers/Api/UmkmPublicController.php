<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KelompokUmkm;
use App\Models\ProdukUmkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UmkmPublicController extends Controller
{
    /**
     * Dapatkan daftar katalog produk dengan filter lengkap (Search, Kategori, Harga, Kecamatan, Urutan).
     */
    public function getProduk(Request $request): JsonResponse
    {
        $query = ProdukUmkm::with('kelompok:id,nama_kelompok,slug,nama_ketua,nomor_wa,kecamatan')
            ->where('is_tersedia', true);

        // Filter Pencarian Nama / Deskripsi
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_produk', 'like', "%{$search}%")
                  ->orWhere('deskripsi_produk', 'like', "%{$search}%");
            });
        }

        // Filter Kategori
        if ($request->filled('kategori') && $request->input('kategori') !== 'Semua Kategori') {
            $kategori = $request->input('kategori');
            if (is_array($kategori)) {
                $query->whereIn('kategori', $kategori);
            } else {
                $query->where('kategori', $kategori);
            }
        }

        // Filter Rentang Harga
        if ($request->filled('min_price')) {
            $query->where('harga', '>=', (int) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('harga', '<=', (int) $request->input('max_price'));
        }

        // Filter Wilayah Kecamatan (via relasi kelompok)
        if ($request->filled('kecamatan') && $request->input('kecamatan') !== 'Semua Kecamatan') {
            $kecamatan = $request->input('kecamatan');
            $query->whereHas('kelompok', function ($q) use ($kecamatan) {
                $q->where('kecamatan', $kecamatan);
            });
        }

        // Filter Berdasarkan Kelompok Tertentu
        if ($request->filled('kelompok_slug')) {
            $slug = $request->input('kelompok_slug');
            $query->whereHas('kelompok', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        // Pengurutan
        $sort = $request->input('sort', 'rekomendasi');
        switch ($sort) {
            case 'harga_termurah':
                $query->orderBy('harga', 'asc');
                break;
            case 'harga_termahal':
                $query->orderBy('harga', 'desc');
                break;
            case 'terbaru':
                $query->orderBy('created_at', 'desc');
                break;
            case 'rekomendasi':
            default:
                $query->orderBy('is_featured', 'desc')->orderBy('id', 'desc');
                break;
        }

        $produk = $query->get();

        return response()->json([
            'success' => true,
            'total' => $produk->count(),
            'data' => $produk,
        ]);
    }

    /**
     * Dapatkan daftar direktori kelompok UMKM.
     */
    public function getKelompok(Request $request): JsonResponse
    {
        $query = KelompokUmkm::withCount(['produk' => function ($q) {
            $q->where('is_tersedia', true);
        }])->where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_kelompok', 'like', "%{$search}%")
                  ->orWhere('nama_ketua', 'like', "%{$search}%")
                  ->orWhere('kecamatan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kecamatan') && $request->input('kecamatan') !== 'Semua Kecamatan') {
            $query->where('kecamatan', $request->input('kecamatan'));
        }

        $kelompok = $query->orderBy('nama_kelompok', 'asc')->get();

        return response()->json([
            'success' => true,
            'total' => $kelompok->count(),
            'data' => $kelompok,
        ]);
    }

    /**
     * Dapatkan profil detail kelompok UMKM beserta katalog produk miliknya.
     */
    public function getKelompokDetail(string $slug): JsonResponse
    {
        $kelompok = KelompokUmkm::with(['produk' => function ($q) {
            $q->where('is_tersedia', true)->orderBy('is_featured', 'desc')->orderBy('id', 'desc');
        }])
        ->where('slug', $slug)
        ->where('is_active', true)
        ->first();

        if (! $kelompok) {
            return response()->json([
                'success' => false,
                'message' => 'Kelompok UMKM tidak ditemukan atau sedang tidak aktif.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $kelompok,
        ]);
    }

    /**
     * Metadata untuk sidebar filter (Daftar kategori dengan total produk & daftar kecamatan unik).
     */
    public function getKategoriMeta(): JsonResponse
    {
        // Hitung produk per kategori
        $kategori = ProdukUmkm::where('is_tersedia', true)
            ->select('kategori', DB::raw('count(*) as total'))
            ->groupBy('kategori')
            ->orderBy('total', 'desc')
            ->get();

        // Total semua produk
        $totalSemua = ProdukUmkm::where('is_tersedia', true)->count();

        // Daftar kecamatan unik dari kelompok UMKM aktif
        $kecamatan = KelompokUmkm::where('is_active', true)
            ->distinct()
            ->pluck('kecamatan')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'total_semua' => $totalSemua,
                'kategori' => $kategori,
                'kecamatan' => $kecamatan,
            ],
        ]);
    }
}


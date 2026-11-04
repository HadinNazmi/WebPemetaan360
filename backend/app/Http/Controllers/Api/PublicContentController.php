<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtikelCsr;
use App\Models\BantuanCsr;
use App\Models\MetrikDampakDigital;
use App\Models\ProgramCsr;
use App\Models\SistemCsr;
use App\Models\VisiMisiCsr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicContentController extends Controller
{
    /**
     * Mengambil data Visi & Misi CSR.
     */
    public function getVisiMisi(): JsonResponse
    {
        $visiMisi = VisiMisiCsr::where('is_active', true)->first();

        return response()->json([
            'success' => true,
            'data' => $visiMisi,
        ]);
    }

    /**
     * Mengambil data Sistem CSR & Metrik Dampak Digital.
     */
    public function getMetrikDampak(): JsonResponse
    {
        $sistemWithMetrik = SistemCsr::with(['metrik' => function ($q) {
            $q->where('is_active', true)->orderBy('urutan', 'asc');
        }])
        ->where('is_active', true)
        ->orderBy('urutan', 'asc')
        ->get();

        $allMetrics = MetrikDampakDigital::with('sistem')
            ->where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'sistem' => $sistemWithMetrik,
                'metrik_list' => $allMetrics,
            ],
        ]);
    }

    /**
     * Mengambil daftar kartu Program CSR.
     */
    public function getProgram(): JsonResponse
    {
        $programs = ProgramCsr::where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    /**
     * Mengambil detail satu Program CSR berdasarkan slug.
     */
    public function getProgramDetail(string $slug): JsonResponse
    {
        $program = ProgramCsr::where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (! $program) {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $program,
        ]);
    }

    /**
     * Mengambil daftar kartu Penyaluran Bantuan CSR.
     */
    public function getBantuan(): JsonResponse
    {
        $bantuan = BantuanCsr::where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bantuan,
        ]);
    }

    /**
     * Mengambil daftar Artikel CSR & Publikasi Media.
     */
    public function getArtikel(Request $request): JsonResponse
    {
        $query = ArtikelCsr::where('is_active', true)
            ->orderBy('tanggal_publikasi', 'desc')
            ->orderBy('urutan', 'asc');

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $artikel = $query->get();

        return response()->json([
            'success' => true,
            'data' => $artikel,
        ]);
    }

    /**
     * Endpoint agregasi seluruh data beranda dalam 1 request (mengoptimalkan loading frontend).
     */
    public function getHomeBundle(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'visi_misi' => VisiMisiCsr::where('is_active', true)->first(),
                'metrik_dampak' => MetrikDampakDigital::with('sistem')
                    ->where('is_active', true)
                    ->orderBy('urutan', 'asc')
                    ->get(),
                'sistem_csr' => SistemCsr::where('is_active', true)->orderBy('urutan', 'asc')->get(),
                'programs' => ProgramCsr::where('is_active', true)->orderBy('urutan', 'asc')->get(),
                'bantuan' => BantuanCsr::where('is_active', true)->orderBy('urutan', 'asc')->get(),
                'artikel' => ArtikelCsr::where('is_active', true)->orderBy('tanggal_publikasi', 'desc')->get(),
            ],
        ]);
    }
}

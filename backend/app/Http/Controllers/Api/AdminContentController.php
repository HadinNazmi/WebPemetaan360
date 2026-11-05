<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtikelCsr;
use App\Models\BantuanCsr;
use App\Models\MetrikDampakDigital;
use App\Models\ProgramCsr;
use App\Models\SistemCsr;
use App\Models\User;
use App\Models\VisiMisiCsr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminContentController extends Controller
{
    // ==========================================
    // 1. DASHBOARD OVERVIEW & STATS
    // ==========================================
    public function getDashboardStats(): JsonResponse
    {
        $stats = [
            'total_program' => ProgramCsr::count(),
            'program_active' => ProgramCsr::where('is_active', true)->count(),
            'total_bantuan' => BantuanCsr::count(),
            'bantuan_active' => BantuanCsr::where('is_active', true)->count(),
            'total_artikel' => ArtikelCsr::count(),
            'artikel_featured' => ArtikelCsr::where('is_featured', true)->first(),
            'total_metrik' => MetrikDampakDigital::count(),
            'total_admin' => User::count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    // ==========================================
    // 2. HERO & VISI MISI
    // ==========================================
    public function getVisiMisi(): JsonResponse
    {
        $data = VisiMisiCsr::first();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function updateVisiMisi(Request $request): JsonResponse
    {
        $data = VisiMisiCsr::first();
        if (! $data) {
            $data = new VisiMisiCsr();
        }

        $validated = $request->validate([
            'eyebrow' => 'nullable|string|max:100',
            'judul_utama' => 'required|string|max:255',
            'deskripsi_pengantar' => 'nullable|string',
            'visi' => 'required|string',
            'misi' => 'nullable|string',
            'logo_url' => 'nullable|string|max:255',
            'url_selengkapnya' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $data->fill($validated);
        $data->save();

        return response()->json([
            'success' => true,
            'message' => 'Visi & Misi berhasil diperbarui.',
            'data' => $data,
        ]);
    }

    // ==========================================
    // 3. METRIK DAMPAK DIGITAL (SIMINAH & SIMON+)
    // ==========================================
    public function getMetrikDampak(): JsonResponse
    {
        $sistem = SistemCsr::with('metrik')->orderBy('urutan')->get();
        $metrikList = MetrikDampakDigital::with('sistem')->orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'sistem' => $sistem,
                'metrik_list' => $metrikList,
            ],
        ]);
    }

    public function storeMetrikDampak(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sistem_csr_id' => 'required|exists:sistem_csr,id',
            'nama_metrik' => 'required|string|max:150',
            'kategori_label' => 'required|string|max:100',
            'nilai_cached' => 'required|numeric',
            'satuan' => 'required|string|max:50',
            'sub_satuan' => 'nullable|string|max:50',
            'suffix' => 'nullable|string|max:10',
            'format_angka' => 'required|in:integer,decimal',
            'deskripsi' => 'nullable|string',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $metrik = MetrikDampakDigital::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Metrik dampak berhasil ditambahkan.',
            'data' => $metrik,
        ], 201);
    }

    public function updateMetrikDampak(Request $request, $id): JsonResponse
    {
        $metrik = MetrikDampakDigital::findOrFail($id);

        $validated = $request->validate([
            'sistem_csr_id' => 'sometimes|exists:sistem_csr,id',
            'nama_metrik' => 'sometimes|string|max:150',
            'kategori_label' => 'sometimes|string|max:100',
            'nilai_cached' => 'sometimes|numeric',
            'satuan' => 'sometimes|string|max:50',
            'sub_satuan' => 'nullable|string|max:50',
            'suffix' => 'nullable|string|max:10',
            'format_angka' => 'sometimes|in:integer,decimal',
            'deskripsi' => 'nullable|string',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $metrik->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Metrik dampak berhasil diperbarui.',
            'data' => $metrik,
        ]);
    }

    public function deleteMetrikDampak($id): JsonResponse
    {
        $metrik = MetrikDampakDigital::findOrFail($id);
        $metrik->delete();

        return response()->json([
            'success' => true,
            'message' => 'Metrik dampak berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 4. PROGRAM UNGGULAN CSR
    // ==========================================
    public function getPrograms(): JsonResponse
    {
        $programs = ProgramCsr::orderBy('urutan')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    public function storeProgram(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_program' => 'required|string|max:255',
            'pilar_kategori' => 'required|string|max:100',
            'gambar_cover' => 'required|string|max:500',
            'ringkasan' => 'required|string',
            'deskripsi_lengkap' => 'required|string',
            'galeri_foto' => 'nullable|array',
            'lokasi' => 'nullable|string|max:150',
            'link_eksternal' => 'nullable|string|max:255',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['nama_program']).'-'.rand(100, 999);
        $program = ProgramCsr::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program CSR berhasil ditambahkan.',
            'data' => $program,
        ], 201);
    }

    public function updateProgram(Request $request, $id): JsonResponse
    {
        $program = ProgramCsr::findOrFail($id);

        $validated = $request->validate([
            'nama_program' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:program_csr,slug,'.$id,
            'pilar_kategori' => 'sometimes|string|max:100',
            'gambar_cover' => 'sometimes|string|max:500',
            'ringkasan' => 'sometimes|string',
            'deskripsi_lengkap' => 'sometimes|string',
            'galeri_foto' => 'nullable|array',
            'lokasi' => 'nullable|string|max:150',
            'link_eksternal' => 'nullable|string|max:255',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $program->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program CSR berhasil diperbarui.',
            'data' => $program,
        ]);
    }

    public function deleteProgram($id): JsonResponse
    {
        $program = ProgramCsr::findOrFail($id);
        $program->delete();

        return response()->json([
            'success' => true,
            'message' => 'Program CSR berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 5. PENYALURAN BANTUAN CSR
    // ==========================================
    public function getBantuan(): JsonResponse
    {
        $bantuan = BantuanCsr::orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data' => $bantuan,
        ]);
    }

    public function storeBantuan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul_bantuan' => 'required|string|max:200',
            'penjelasan_bantuan' => 'required|string',
            'gambar_cover' => 'nullable|string|max:500',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $item = BantuanCsr::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan CSR berhasil ditambahkan.',
            'data' => $item,
        ], 201);
    }

    public function updateBantuan(Request $request, $id): JsonResponse
    {
        $item = BantuanCsr::findOrFail($id);

        $validated = $request->validate([
            'judul_bantuan' => 'sometimes|string|max:200',
            'penjelasan_bantuan' => 'sometimes|string',
            'gambar_cover' => 'nullable|string|max:500',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan CSR berhasil diperbarui.',
            'data' => $item,
        ]);
    }

    public function deleteBantuan($id): JsonResponse
    {
        $item = BantuanCsr::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan CSR berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 6. ARTIKEL & PUBLIKASI MEDIA
    // ==========================================
    public function getArtikel(): JsonResponse
    {
        $artikel = ArtikelCsr::orderBy('tanggal_publikasi', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $artikel,
        ]);
    }

    public function storeArtikel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul_artikel' => 'required|string|max:255',
            'kategori_tag' => 'required|string|max:100',
            'gambar_cover' => 'required|string|max:500',
            'url_media' => 'required|string|max:500',
            'sumber_media' => 'nullable|string|max:100',
            'tanggal_publikasi' => 'required|date',
            'is_featured' => 'boolean',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        if (! empty($validated['is_featured'])) {
            ArtikelCsr::where('is_featured', true)->update(['is_featured' => false]);
        }

        $item = ArtikelCsr::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel publikasi berhasil ditambahkan.',
            'data' => $item,
        ], 201);
    }

    public function updateArtikel(Request $request, $id): JsonResponse
    {
        $item = ArtikelCsr::findOrFail($id);

        $validated = $request->validate([
            'judul_artikel' => 'sometimes|string|max:255',
            'kategori_tag' => 'sometimes|string|max:100',
            'gambar_cover' => 'sometimes|string|max:500',
            'url_media' => 'sometimes|string|max:500',
            'sumber_media' => 'nullable|string|max:100',
            'tanggal_publikasi' => 'sometimes|date',
            'is_featured' => 'boolean',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ]);

        if (! empty($validated['is_featured'])) {
            ArtikelCsr::where('id', '!=', $id)->where('is_featured', true)->update(['is_featured' => false]);
        }

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel publikasi berhasil diperbarui.',
            'data' => $item,
        ]);
    }

    public function deleteArtikel($id): JsonResponse
    {
        $item = ArtikelCsr::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel publikasi berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 7. PENGGUNA ADMIN
    // ==========================================
    public function getUsers(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'created_at', 'updated_at')->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna admin berhasil ditambahkan.',
            'data' => $user,
        ], 201);
    }

    public function deleteUser($id): JsonResponse
    {
        if (User::count() <= 1) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus admin terakhir.',
            ], 400);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna admin berhasil dihapus.',
        ]);
    }
}


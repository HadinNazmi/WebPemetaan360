<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BantuanCsr;
use App\Models\ProgramCsr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TjslAdminController extends Controller
{
    /**
     * Dapatkan ringkasan statistik khusus Dashboard Admin TJSL.
     */
    public function getDashboardStats(): JsonResponse
    {
        $totalProgram = ProgramCsr::count();
        $totalBantuan = BantuanCsr::count();
        
        $stats = [
            'total_program_tjsl' => $totalProgram,
            'program_tjsl_aktif' => ProgramCsr::where('is_active', true)->count(),
            'total_penyaluran_bantuan' => $totalBantuan,
            'bantuan_tervalidasi' => BantuanCsr::where('is_active', true)->count(),
            'indeks_sroi' => 3.84, // Social Return on Investment standard
            'pilar_terbanyak' => 'Pertamina Berdikari & Hijau',
            'wilayah_ring1' => 'Integrated Terminal Dumai & Sungai Pakning',
            'capaian_realisasi' => '94.6%',
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Daftar 4 Pilar Utama TJSL Pertamina.
     */
    public function getPilarList(): JsonResponse
    {
        $pilars = [
            [
                'id' => 1,
                'kode' => 'cerdas',
                'nama' => 'Pertamina Cerdas',
                'bidang' => 'Pendidikan & Literasi Vokasi',
                'warna' => '#00529C',
                'target_penerima' => '1,420 Pelajar & Mahasiswa',
                'realisasi_persen' => 96,
            ],
            [
                'id' => 2,
                'kode' => 'sehat',
                'nama' => 'Pertamina Sehat',
                'bidang' => 'Kesehatan, Posyandu & Stunting',
                'warna' => '#ED1B24',
                'target_penerima' => '3,150 Warga & Balita',
                'realisasi_persen' => 92,
            ],
            [
                'id' => 3,
                'kode' => 'hijau',
                'nama' => 'Pertamina Hijau',
                'bidang' => 'Konservasi Lahan Gambut & Mangrove',
                'warna' => '#10B981',
                'target_penerima' => '12 Kelompok Tani Hutan',
                'realisasi_persen' => 95,
            ],
            [
                'id' => 4,
                'kode' => 'berdikari',
                'nama' => 'Pertamina Berdikari',
                'bidang' => 'Pemberdayaan UMKM & Inovasi Mandiri',
                'warna' => '#F59E0B',
                'target_penerima' => '48 Mitra Binaan',
                'realisasi_persen' => 98,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $pilars,
        ]);
    }

    /**
     * Daftar program khusus TJSL.
     */
    public function getPrograms(): JsonResponse
    {
        $programs = ProgramCsr::orderBy('urutan', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    /**
     * Tambah program TJSL baru.
     */
    public function storeProgram(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_program' => 'required|string|max:255',
            'pilar_kategori' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:255',
            'gambar_cover' => 'nullable|string|max:255',
            'ringkasan' => 'nullable|string',
            'deskripsi_lengkap' => 'nullable|string',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $slug = Str::slug($validated['nama_program']);
        $originalSlug = $slug;
        $counter = 1;
        while (ProgramCsr::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $program = ProgramCsr::create([
            'nama_program' => $validated['nama_program'],
            'slug' => $slug,
            'pilar_kategori' => $validated['pilar_kategori'] ?? 'TJSL Pertamina',
            'lokasi' => $validated['lokasi'] ?? null,
            'gambar_cover' => $validated['gambar_cover'] ?? null,
            'ringkasan' => $validated['ringkasan'] ?? null,
            'deskripsi_lengkap' => $validated['deskripsi_lengkap'] ?? null,
            'urutan' => $validated['urutan'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Program TJSL berhasil ditambahkan.',
            'data' => $program,
        ], 201);
    }

    /**
     * Ubah program TJSL.
     */
    public function updateProgram(Request $request, int $id): JsonResponse
    {
        $program = ProgramCsr::findOrFail($id);

        $validated = $request->validate([
            'nama_program' => 'sometimes|required|string|max:255',
            'pilar_kategori' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:255',
            'gambar_cover' => 'nullable|string|max:255',
            'ringkasan' => 'nullable|string',
            'deskripsi_lengkap' => 'nullable|string',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $program->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program TJSL berhasil diperbarui.',
            'data' => $program,
        ]);
    }

    /**
     * Hapus program TJSL.
     */
    public function deleteProgram(int $id): JsonResponse
    {
        $program = ProgramCsr::findOrFail($id);
        $program->delete();

        return response()->json([
            'success' => true,
            'message' => 'Program TJSL berhasil dihapus.',
        ]);
    }

    /**
     * Daftar Penyaluran Bantuan TJSL.
     */
    public function getBantuan(): JsonResponse
    {
        $bantuan = BantuanCsr::orderBy('urutan', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $bantuan,
        ]);
    }

    /**
     * Tambah Bantuan TJSL.
     */
    public function storeBantuan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul_bantuan' => 'required|string|max:255',
            'penjelasan_bantuan' => 'nullable|string',
            'gambar_cover' => 'nullable|string|max:255',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $bantuan = BantuanCsr::create([
            'judul_bantuan' => $validated['judul_bantuan'],
            'penjelasan_bantuan' => $validated['penjelasan_bantuan'] ?? null,
            'gambar_cover' => $validated['gambar_cover'] ?? null,
            'urutan' => $validated['urutan'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan TJSL berhasil ditambahkan.',
            'data' => $bantuan,
        ], 201);
    }

    /**
     * Ubah Bantuan TJSL.
     */
    public function updateBantuan(Request $request, int $id): JsonResponse
    {
        $bantuan = BantuanCsr::findOrFail($id);

        $validated = $request->validate([
            'judul_bantuan' => 'sometimes|required|string|max:255',
            'penjelasan_bantuan' => 'nullable|string',
            'gambar_cover' => 'nullable|string|max:255',
            'urutan' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $bantuan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan TJSL berhasil diperbarui.',
            'data' => $bantuan,
        ]);
    }

    /**
     * Hapus Bantuan TJSL.
     */
    public function deleteBantuan(int $id): JsonResponse
    {
        $bantuan = BantuanCsr::findOrFail($id);
        $bantuan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data bantuan TJSL berhasil dihapus.',
        ]);
    }

    /**
     * Ringkasan laporan berkala TJSL (SROI & ISO 26000).
     */
    public function getLaporan(): JsonResponse
    {
        $laporan = [
            [
                'id' => 1,
                'periode' => 'Triwulan III - 2026',
                'judul' => 'Laporan Akuntabilitas Dampak Sosial & SROI Ring 1',
                'skor_sroi' => '1 : 3.84',
                'status' => 'Selesai Diaudit',
                'standar' => 'ISO 26000 SR',
                'tanggal_terbit' => '2026-10-15',
            ],
            [
                'id' => 2,
                'periode' => 'Triwulan II - 2026',
                'judul' => 'Monitoring Capaian 4 Pilar TJSL Patra Niaga Dumai',
                'skor_sroi' => '1 : 3.62',
                'status' => 'Terverifikasi',
                'standar' => 'Proper Emas KLHK',
                'tanggal_terbit' => '2026-07-20',
            ],
            [
                'id' => 3,
                'periode' => 'Triwulan I - 2026',
                'judul' => 'Laporan Penyaluran Bantuan Korban Bencana & Sanitasi',
                'skor_sroi' => '1 : 3.41',
                'status' => 'Terverifikasi',
                'standar' => 'Permen BUMN PER-05',
                'tanggal_terbit' => '2026-04-10',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $laporan,
        ]);
    }

    // New method: showProposal
    public function showProposal($nomor)
    {
        $proposal = \App\Models\Proposal::where('nomor_surat', $nomor)->first();
        if (!$proposal) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor tidak ditemukan',
            ], 404);
        }
        $tahapan = [];
        if ($proposal->tgl_pengajuan) {
            $tahapan[] = ['name' => 'Pengajuan & Pemetaan', 'date' => $proposal->tgl_pengajuan, 'completed' => true];
        }
        if ($proposal->tgl_verifikasi) {
            $tahapan[] = ['name' => 'Verifikasi & Uji Kelayakan', 'date' => $proposal->tgl_verifikasi, 'completed' => $proposal->status !== 'ditolak'];
        }
        if ($proposal->tgl_penyaluran) {
            $tahapan[] = ['name' => 'Penyaluran Bantuan', 'date' => $proposal->tgl_penyaluran, 'completed' => $proposal->status === 'diterima'];
        }
        if ($proposal->tgl_monitoring) {
            $tahapan[] = ['name' => 'Monitoring & Keberlanjutan', 'date' => $proposal->tgl_monitoring, 'completed' => $proposal->status === 'diterima'];
        }
        return response()->json([
            'success' => true,
            'data' => [
                'status' => $proposal->status,
                'alasan' => $proposal->alasan_tolak ?? '',
                'tahapan' => $tahapan,
            ],
        ]);
    }

    }

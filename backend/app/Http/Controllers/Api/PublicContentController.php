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
     * Mengambil daftar Sistem CSR (SiMinah & Simon+).
     */
    public function getSistemList(): JsonResponse
    {
        $sistem = SistemCsr::where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sistem,
        ]);
    }

    /**
     * Mengambil detail satu Sistem CSR berdasarkan kode_sistem / slug.
     */
    public function getSistemDetail(string $slug): JsonResponse
    {
        $kode = $slug === 'simonplus' ? 'simon_plus' : $slug;

        $sistem = SistemCsr::with(['metrik' => function ($q) {
            $q->where('is_active', true)->orderBy('urutan', 'asc');
        }])
        ->where(function ($q) use ($slug, $kode) {
            $q->where('kode_sistem', $slug)
              ->orWhere('kode_sistem', $kode);
        })
        ->where('is_active', true)
        ->first();

        if (! $sistem) {
            return response()->json([
                'success' => false,
                'message' => 'Sistem CSR tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $sistem,
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

    /**
     * Lacak perkembangan status pengajuan proposal TJSL untuk masyarakat umum.
     */
    public function trackProposal(string $nomor): JsonResponse
    {
        $cleanNomor = trim($nomor);
        $proposal = \App\Models\Proposal::where('nomor_surat', $cleanNomor)
            ->orWhereRaw('LOWER(nomor_surat) = ?', [strtolower($cleanNomor)])
            ->first();

        if (!$proposal) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor surat pengajuan tidak ditemukan. Pastikan nomor surat yang Anda masukkan benar sesuai tanda bukti pengajuan.',
            ], 404);
        }

        // Susun 4 tahapan alur resmi penyaluran bantuan TJSL
        $tahapan = [
            [
                'step' => 1,
                'judul' => 'Pengajuan & Pemetaan',
                'deskripsi' => 'Penerimaan usulan proposal masyarakat dan kelengkapan administrasi.',
                'tanggal' => $proposal->tgl_pengajuan ? date('d M Y', strtotime($proposal->tgl_pengajuan)) : null,
                'status' => 'completed', // Tahap 1 pasti sudah selesai jika sudah tercatat
                'catatan' => $proposal->status === 'ditolak' && !$proposal->tgl_verifikasi 
                    ? 'Pengajuan tidak dapat diproses lebih lanjut.' 
                    : 'Berkas pengajuan telah resmi terdaftar di sistem TJSL.',
            ],
            [
                'step' => 2,
                'judul' => 'Verifikasi & Uji Kelayakan',
                'deskripsi' => 'Peninjauan dan evaluasi kelayakan teknis, lapangan, dan sasaran penerima manfaat oleh tim CSR.',
                'tanggal' => $proposal->tgl_verifikasi ? date('d M Y', strtotime($proposal->tgl_verifikasi)) : null,
                'status' => $proposal->tgl_verifikasi 
                    ? ($proposal->status === 'ditolak' ? 'rejected' : 'completed')
                    : ($proposal->status === 'diproses' ? 'in_progress' : 'pending'),
                'catatan' => $proposal->status === 'ditolak' 
                    ? ($proposal->alasan_tolak ?: 'Proposal tidak memenuhi kriteria kelayakan program.')
                    : ($proposal->tgl_verifikasi ? 'Verifikasi dan uji kelayakan telah selesai dilakukan.' : 'Sedang dalam proses telaah dan evaluasi tim CSR.'),
            ],
            [
                'step' => 3,
                'judul' => 'Penyaluran Bantuan',
                'deskripsi' => 'Penetapan persetujuan program dan penyerahan bantuan sarana, modal stimulan, atau fasilitas.',
                'tanggal' => $proposal->tgl_penyaluran ? date('d M Y', strtotime($proposal->tgl_penyaluran)) : null,
                'status' => $proposal->tgl_penyaluran 
                    ? 'completed' 
                    : ($proposal->status === 'diterima' && !$proposal->tgl_penyaluran ? 'in_progress' : 'pending'),
                'catatan' => $proposal->tgl_penyaluran 
                    ? 'Bantuan telah disalurkan kepada penerima manfaat.' 
                    : ($proposal->status === 'diterima' ? 'Menunggu jadwal seremoni/alokasi penyerahan bantuan.' : null),
            ],
            [
                'step' => 4,
                'judul' => 'Monitoring & Keberlanjutan',
                'deskripsi' => 'Pendampingan berkala, pelaporan progres program, evaluasi pemanfaatan dan skor dampak sosial.',
                'tanggal' => $proposal->tgl_monitoring ? date('d M Y', strtotime($proposal->tgl_monitoring)) : null,
                'status' => $proposal->tgl_monitoring 
                    ? 'completed' 
                    : ($proposal->tgl_penyaluran ? 'in_progress' : 'pending'),
                'catatan' => $proposal->tgl_monitoring 
                    ? 'Program aktif berjalan dan dalam pengawasan berkala tim CSR.' 
                    : ($proposal->tgl_penyaluran ? 'Persiapan tahap monitoring dampak program.' : null),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $proposal->id,
                'nomor_surat' => $proposal->nomor_surat,
                'nama_pengaju' => $proposal->nama_pengaju,
                'judul_proposal' => $proposal->judul_proposal,
                'status' => $proposal->status, // 'diproses' | 'diterima' | 'ditolak'
                'alasan_tolak' => $proposal->alasan_tolak,
                'keterangan_tahapan' => $proposal->keterangan_tahapan,
                'tgl_pengajuan' => $proposal->tgl_pengajuan ? date('d M Y', strtotime($proposal->tgl_pengajuan)) : null,
                'updated_at' => $proposal->updated_at ? date('d M Y H:i', strtotime($proposal->updated_at)) : null,
                'tahapan' => $tahapan,
            ],
        ]);
    }
}

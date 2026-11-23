<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $table = 'proposals'; // adjust if table name differs
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $fillable = [
        'nomor_surat',
        'status', // e.g., 'diterima', 'diproses', 'ditolak'
        'alasan_tolak',
        // any other fields you need for timeline, dates etc.
        'tgl_pengajuan',
        'tgl_verifikasi',
        'tgl_penyaluran',
        'tgl_monitoring',
    ];
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetrikDampakDigital extends Model
{
    use HasFactory;

    protected $table = 'metrik_dampak_digital';

    protected $fillable = [
        'sistem_csr_id',
        'nama_metrik',
        'kategori_label',
        'api_endpoint_path',
        'api_response_field',
        'nilai_cached',
        'satuan',
        'sub_satuan',
        'suffix',
        'format_angka',
        'deskripsi',
        'urutan',
        'is_active',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'nilai_cached' => 'decimal:2',
            'urutan' => 'integer',
            'is_active' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    /**
     * Relasi ke sistem CSR induk.
     */
    public function sistem(): BelongsTo
    {
        return $this->belongsTo(SistemCsr::class, 'sistem_csr_id');
    }
}

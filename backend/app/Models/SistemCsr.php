<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SistemCsr extends Model
{
    use HasFactory;

    protected $table = 'sistem_csr';

    protected $fillable = [
        'kode_sistem',
        'nama_sistem',
        'deskripsi',
        'api_base_url',
        'api_token_key',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relasi ke metrik-metrik yang dimiliki sistem ini.
     */
    public function metrik(): HasMany
    {
        return $this->hasMany(MetrikDampakDigital::class, 'sistem_csr_id')->orderBy('urutan');
    }
}

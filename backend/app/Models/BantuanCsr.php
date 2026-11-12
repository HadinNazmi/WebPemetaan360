<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BantuanCsr extends Model
{
    use HasFactory;

    protected $table = 'bantuan_csr';

    protected $fillable = [
        'judul_bantuan',
        'penjelasan_bantuan',
        'gambar_cover',
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
}

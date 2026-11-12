<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtikelCsr extends Model
{
    use HasFactory;

    protected $table = 'artikel_csr';

    protected $fillable = [
        'judul_artikel',
        'kategori_tag',
        'gambar_cover',
        'url_media',
        'sumber_media',
        'tanggal_publikasi',
        'is_featured',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_publikasi' => 'date',
            'is_featured' => 'boolean',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}

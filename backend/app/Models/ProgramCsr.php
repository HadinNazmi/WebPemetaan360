<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramCsr extends Model
{
    use HasFactory;

    protected $table = 'program_csr';

    protected $fillable = [
        'nama_program',
        'slug',
        'pilar_kategori',
        'gambar_cover',
        'ringkasan',
        'deskripsi_lengkap',
        'galeri_foto',
        'lokasi',
        'link_eksternal',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'galeri_foto' => 'array',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}

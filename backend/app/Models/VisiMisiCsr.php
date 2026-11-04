<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisiMisiCsr extends Model
{
    use HasFactory;

    protected $table = 'visi_misi_csr';

    protected $fillable = [
        'eyebrow',
        'judul_utama',
        'deskripsi_pengantar',
        'visi',
        'misi',
        'logo_url',
        'url_selengkapnya',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}

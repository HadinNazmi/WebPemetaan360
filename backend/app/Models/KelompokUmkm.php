<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class KelompokUmkm extends Model
{
    use HasFactory;

    protected $table = 'kelompok_umkm';

    protected $fillable = [
        'nama_kelompok',
        'slug',
        'nama_ketua',
        'nomor_wa',
        'tahun_berdiri',
        'angkatan',
        'jumlah_anggota',
        'kecamatan',
        'alamat_lengkap',
        'deskripsi',
        'foto_cover',
        'is_active',
    ];

    protected $casts = [
        'jumlah_anggota' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (empty($item->slug)) {
                $item->slug = Str::slug($item->nama_kelompok).'-'.Str::random(4);
            }
        });
    }

    /**
     * Relasi ke semua produk milik kelompok usaha ini.
     */
    public function produk(): HasMany
    {
        return $this->hasMany(ProdukUmkm::class, 'kelompok_umkm_id');
    }
}


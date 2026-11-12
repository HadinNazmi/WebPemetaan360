<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ProdukUmkm extends Model
{
    use HasFactory;

    protected $table = 'produk_umkm';

    protected $fillable = [
        'kelompok_umkm_id',
        'nama_produk',
        'slug',
        'kategori',
        'harga',
        'satuan',
        'foto_produk',
        'deskripsi_produk',
        'is_tersedia',
        'is_featured',
    ];

    protected $casts = [
        'harga' => 'integer',
        'is_tersedia' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (empty($item->slug)) {
                $item->slug = Str::slug($item->nama_produk).'-'.Str::random(4);
            }
        });
    }

    /**
     * Relasi ke kelompok UMKM pemilik usaha.
     */
    public function kelompok(): BelongsTo
    {
        return $this->belongsTo(KelompokUmkm::class, 'kelompok_umkm_id');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wilayah360 extends Model
{
    use HasFactory;

    protected $table = 'wilayah_360';

    protected $fillable = [
        'nama_wilayah',
        'slug',
        'deskripsi',
        'gambar_cover',
        'lokasi_koordinat',
        'initial_scene_id',
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
     * Relasi ke semua Scene dalam wilayah ini.
     */
    public function scenes(): HasMany
    {
        return $this->hasMany(Scene360::class, 'wilayah_id')->orderBy('urutan', 'asc');
    }

    /**
     * Relasi ke Scene awal / pintu masuk utama.
     */
    public function initialScene(): BelongsTo
    {
        return $this->belongsTo(Scene360::class, 'initial_scene_id');
    }
}

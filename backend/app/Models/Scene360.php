<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scene360 extends Model
{
    use HasFactory;

    protected $table = 'scene_360';

    protected $fillable = [
        'wilayah_id',
        'nama_scene',
        'slug',
        'foto_panorama',
        'default_pitch',
        'default_yaw',
        'default_hfov',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'default_pitch' => 'float',
            'default_yaw' => 'float',
            'default_hfov' => 'float',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relasi ke Wilayah induk.
     */
    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(Wilayah360::class, 'wilayah_id');
    }

    /**
     * Relasi ke semua Hotspot di dalam Scene ini.
     */
    public function hotspots(): HasMany
    {
        return $this->hasMany(Hotspot360::class, 'scene_id');
    }
}

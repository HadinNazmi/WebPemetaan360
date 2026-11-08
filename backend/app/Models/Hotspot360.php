<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotspot360 extends Model
{
    use HasFactory;

    protected $table = 'hotspot_360';

    protected $fillable = [
        'scene_id',
        'tipe',
        'pitch',
        'yaw',
        'target_scene_id',
        'target_pitch',
        'target_yaw',
        'program_id',
        'judul_hotspot',
        'deskripsi_hotspot',
        'gambar_popup',
        'teks_tombol',
        'ikon_hotspot',
    ];

    protected function casts(): array
    {
        return [
            'pitch' => 'float',
            'yaw' => 'float',
            'target_pitch' => 'float',
            'target_yaw' => 'float',
        ];
    }

    /**
     * Relasi ke Scene tempat hotspot ini berada.
     */
    public function scene(): BelongsTo
    {
        return $this->belongsTo(Scene360::class, 'scene_id');
    }

    /**
     * Relasi ke Scene tujuan (jika tipe 'direct' atau 'popup_then_move').
     */
    public function targetScene(): BelongsTo
    {
        return $this->belongsTo(Scene360::class, 'target_scene_id');
    }

    /**
     * Relasi ke Program CSR (jika hotspot ini merujuk ke suatu program).
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramCsr::class, 'program_id');
    }
}


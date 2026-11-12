<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroPanorama360 extends Model
{
    use HasFactory;

    protected $table = 'hero_panorama_360';

    protected $fillable = [
        'judul',
        'foto_panorama',
        'default_pitch',
        'default_yaw',
        'default_hfov',
        'auto_rotate_speed',
        'pins',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'default_pitch' => 'float',
            'default_yaw' => 'float',
            'default_hfov' => 'float',
            'auto_rotate_speed' => 'float',
            'pins' => 'array',
            'is_active' => 'boolean',
        ];
    }
}


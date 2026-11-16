<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageHero extends Model
{
    protected $table = 'page_heroes';

    protected $fillable = [
        'page_key',
        'page_name',
        'title',
        'subtitle',
        'background_image',
    ];
}

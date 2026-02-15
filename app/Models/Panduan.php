<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panduan extends Model
{
    protected $table = 'panduans';

    protected $fillable = [
        'video_panduan',
        'dokumen_panduan',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    protected $fillable = [
        'medias_id',
        'judul',
        'deskripsi',
        'cover_image',
        'category',
        'instansi',
        'lokasi',
        'tabel',
    ];

    public function medias()
    {
        return $this->belongsTo(Media::class);
    }
}

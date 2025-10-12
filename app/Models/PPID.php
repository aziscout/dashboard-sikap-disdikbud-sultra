<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ppid extends Model
{
    protected $fillable = [
        'medias_id',
        'judul',
        'deskripsi',
        'dokumen',
        'file',
        'cover_image',
        'category',
        'instansi',
        'lokasi',
        'tabel',
    ];
}

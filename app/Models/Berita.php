<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    protected $fillable = [
        'medias_id',
        'judul',
<<<<<<< HEAD
=======
        'penyelenggara',
>>>>>>> 29a3713a57395c78c49ed3f0bb6a96d213a906a4
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

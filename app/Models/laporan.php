<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class laporan extends Model
{
    use HasFactory , Notifiable;

    protected $table = 'laporans';


    protected $fillable = [
        'judul',
        'deskripsi',
        'lokasi',
        'coverImage',
        'penyelenggara',
        'instansi',
        'tabel',
        'medias_id',
        'bidangs_id'
    ];

    public function medias()
    {
        return $this->belongsTo(Media::class, 'medias_id',);
    }
}

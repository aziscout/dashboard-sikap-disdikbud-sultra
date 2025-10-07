<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class LaporanKegiatan extends Model
{

    use HasFactory , Notifiable;

    protected $table = 'laporan_kegiatan';


    protected $fillable = [
        'judul',
        'deskripsi',
        'lokasi',
        'penyelenggara',
        'file',
        'bidangs_id',
        'medias_id'
    ];

    public function medias()
    {
        return $this->belongsTo(Media::class);
    }
}

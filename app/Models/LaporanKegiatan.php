<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Dokumen;

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
        'medias_id',
        'dokumens_id'
    ];

    public function medias()
    {
        return $this->belongsTo(Media::class);
    }

    public function dokumen()
    {
        return $this->belongsTo(Dokumen::class, 'dokumens_id');
    }
}

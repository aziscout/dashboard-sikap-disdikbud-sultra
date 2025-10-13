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
        'peserta',
        'penyelenggara',
        'instansi',
        'tabel',
        'dokumens_id',
        'bidangs_id'
    ];

    public function dokumens()
    {
        return $this->belongsTo(Dokumen::class, 'dokumens_id');
    }
}

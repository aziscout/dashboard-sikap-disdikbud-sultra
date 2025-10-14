<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Agenda extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'agenda';

    protected $fillable = [
        'judul',
        'deskripsi',
        'lokasi',
        'coverImage',
        'penyelenggara',
        'instansi',
<<<<<<< HEAD
=======
        'category',
>>>>>>> 29a3713a57395c78c49ed3f0bb6a96d213a906a4
        'lokasi',
        'tabel',
        'medias_id',
    ];

    public function medias(){
        return $this->belongsTo(Media::class, 'medias_id');
    }
}

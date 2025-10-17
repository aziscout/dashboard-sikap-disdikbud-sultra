<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Media;

class Pengumuman extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'pengumuman';

    protected $fillable = [
        'judul',
        'deskripsi',
        'coverImage',
        'penyelenggara',
        'lokasi',
        'category',
        'tabel',
        'instansi',
        'medias_id'
    ];

    public function medias()
    {
        return $this->belongsTo(Media::class, 'medias_id');
    }

}

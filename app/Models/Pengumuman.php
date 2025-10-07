<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Pengumuman extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'pengumuman';

    protected $fillable = [
    'judul',
    'deskripsi',
    'lokasi',
    'category',
    'penyelenggara',
    'instansi',
    'tabel',
    'documents_id',
    'bidangs_id'
];

    public function document()
    {
        return $this->belongsTo(Document::class, 'documents_id');
    }
}

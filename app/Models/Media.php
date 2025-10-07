<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'medias';
    protected $fillable = [
        'file',
    ];
    protected $casts = [
        'file' => 'array',
    ];

    public function beritas()
    {
        return $this->hasMany(Berita::class);
    }
    public function laporan_kegiatan()
    {
        return $this->hasMany(LaporanKegiatan::class);
    }
}

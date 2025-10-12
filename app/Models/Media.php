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
    public function layanans()
    {
        return $this->hasMany(Layanan::class);
    }
    public function inovasis()
    {
        return $this->hasMany(Inovasi::class);
    }
    public function laporans()
    {
        return $this->hasMany(Laporan::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $fillable = [
        'notifikasi',
        'pesan',
    ];

    public function pegawai()
    {
        return $this->hasMany(Pegawai::class, "notifikasis_id");
    }
}

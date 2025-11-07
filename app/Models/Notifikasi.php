<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $fillable = [
        'pesan',
        'status',
    ];

    public function pegawai()
    {
        return $this->hasMany(Pegawai::class, "notifikasis_id");
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $fillable = [
        'pesan',
        'status',
        'pegawais_id',
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, "pegawais_id");
    }
}

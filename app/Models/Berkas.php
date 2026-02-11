<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Berkas extends Model
{
    protected $fillable = [
        'sk_cpns',
        'sk_pns',
        'sk_gaji_berkala',
        'sk_pangkat_terakhir',
        'sk_jabatan',
        'users_id',
        'pegawais_id',
    ];

    public function pegawai() {
        return $this->belongsTo(Pegawai::class, 'pegawais_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'users_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Pegawai extends Authenticatable
{
    use HasApiTokens, HasFactory;
    protected $fillable = [
        'nip',
        'nama',
        'email',
        'password',
        'agama',
        'jenis_kelamin',
        'nomor',
        'alamat',
        'tanggal_lahir',
        'tempat_lahir',
        'unit_kerja',
    ];

    protected static function booted()
    {
        static::creating(function($pegawai) {
            $pegawai->password = Hash::make($pegawai->password);
        });
    }

    protected $hidden = ['password'];

    public function berkas()
    {
        return $this->hasMany(Berkas::class, "pegawais_id");
    }

public function arsip()
    {
        return $this->hasMany(Arsip::class, "pegawais_id");
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class,"pegawais_id");
    }

    public function dataDiri()
    {
        return $this->hasOne(DataDiri::class, 'pegawais_id');
    }
}

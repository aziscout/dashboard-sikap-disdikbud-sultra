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
        'nama',
        'email',
        'password',
        'nip',
        'agama',
        'jenis_kelamin',
        'nomor',
        'alamat',
        'tempat_lahir',
        'notifikasis_id',
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
        return $this->hasMany(Berkas::class, "berkas_id");
    }

    public function notifikasis()
    {
        return $this->belongsTo(Notifikasi::class,"notifikasis_id");
    }
}

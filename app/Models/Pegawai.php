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
    ];

    protected static function booted()
    {
        static::creating(function($pegawai) {
            $pegawai->password = Hash::make($pegawai->password);
        });
    }

    protected $hidden = ['password'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataDiri extends Model
{
    use HasFactory;

    protected $table = 'data_diri';

    protected $fillable = [
        'pegawais_id',
        'tanggal_sk',
        'nomor_sk',
        'tmt_golongan',
        'nomor_pertek_bkn',
        'tanggal_pertek_bkn',
        'masa_gk_bulanan',
        'masa_gk_tahunan',
        'golongan_ruang',
        'jenis_kp',
        'pangkat',
        'gaji_pokok',
        'kgb_terakhir',
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'pegawais_id');
    }
}

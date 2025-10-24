<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataDiri extends Model
{
    use HasFactory;

    protected $table = 'data_diri';

    protected $fillable = [
        'pegawai_id',
        'nip',
        'tanggal_sk',
        'nomor_sk',
        'tempat_lahir',
        'tanggal_lahir',
        'tmt_golongan',
        'agama',
        'jenis_kelamin',
        'alamat',
        'nomor_kepring_bkn',
        'masa_gk_bulanan',
        'masa_gk_tahunan',
        'golongan_ruang',
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'pegawai_id');
    }
}

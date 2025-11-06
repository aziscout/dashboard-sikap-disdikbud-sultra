<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ppid extends Model
{
    protected $fillable = [
        'judul',
        'dokumens_id',
        'tahun',
        'informasi',
    ];

    public function dokumens()
    {
        return $this->belongsTo(Dokumen::class, 'dokumens_id');
    }
}

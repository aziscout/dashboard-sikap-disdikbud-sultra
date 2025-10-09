<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'documents';
    protected $fillable = [
        'file',
    ];
    protected $casts = [
        'file' => 'array',
    ];

    public function pengumumans()
    {
        return $this->hasMany(Pengumuman::class, 'documents_id');
    }
}

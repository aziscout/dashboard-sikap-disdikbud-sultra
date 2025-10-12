<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory;

    protected $table = 'dokumens'; 

    protected $fillable = [
        'dokumen', 
    ];

 
    protected $casts = [
        'dokumen' => 'string', 
    ];

 
    public function layanans(): HasMany
    {
        return $this->hasMany(Layanan::class, 'dokumens_id'); 
    }
}
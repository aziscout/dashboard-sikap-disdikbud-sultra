<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class ProdukHukum extends Model
{
    use HasFactory, Notifiable;
    
    protected $table = 'produk_hukum';
    
    protected $fillable = [
        'dokumens_id',
        'judul',
        'deskripsi',
    ];

    public function dokumens()
    {
        return $this->belongsTo(Dokumen::class, "dokumens_id");
    }
}

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
<<<<<<< HEAD
=======
        'category',
>>>>>>> 29a3713a57395c78c49ed3f0bb6a96d213a906a4
    ];

    public function dokumens()
    {
        return $this->belongsTo(Dokumen::class, "dokumens_id");
    }
}

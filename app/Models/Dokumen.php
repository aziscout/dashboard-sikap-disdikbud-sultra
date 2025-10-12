<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    protected $table = "dokumens";
    protected $fillable = [
        'dokumen',
    ];

    public function produk_hukums()
    {
        return $this->hasMany(ProdukHukum::class, "dokumens_id");
    }
}

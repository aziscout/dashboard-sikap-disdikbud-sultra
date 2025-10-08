<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory;

    /**
     * Nama tabel di database adalah 'dokumens'.
     */
    protected $table = 'dokumens'; 

    /**
     * Atribut yang dapat diisi secara massal.
     * Kolom dokumen yang menyimpan path file adalah 'dokumen'.
     */
    protected $fillable = [
        'dokumen', // DIKOREKSI: Menggunakan 'dokumen' sesuai konfirmasi Anda
    ];

    /**
     * Penentuan tipe data.
     */
    protected $casts = [
        'dokumen' => 'string', // DIKOREKSI: Menggunakan 'dokumen'
    ];

    // ... (Relasi pengumumans tidak diubah, diasumsikan sudah benar)

    /**
     * Mendefinisikan relasi "hasMany" ke model Layanan.
     * Menggunakan foreign key 'dokumens_id' (sesuai tabel layanans).
     */
    public function layanans(): HasMany
    {
        // Foreign key di tabel layanans
        return $this->hasMany(Layanan::class, 'dokumens_id'); 
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Dokumen;

class Layanan extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     *
     * @var string
     */
    protected $table = 'layanans';

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'judul',
        'deskripsi',
        'bidang',
        'nama_pengirim',
        'email_pengirim',
        'media_id',
        'document_id',
        'kode_tracking',
        'status',
    ];

    /**
     * Mendefinisikan relasi "belongsTo" ke model Media.
     * Setiap layanan dapat memiliki satu media (gambar/video).
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Mendefinisikan relasi "belongsTo" ke model Dokumen.
     * Setiap layanan dapat memiliki satu dokumen.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Dokumen::class, 'document_id');
    }
}
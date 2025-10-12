<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Media;

class Dashboard extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'dashboard';

    protected $fillable = [
    'hero',
    'logo',
    'medias_id'
];

    public function medias()
    {
        return $this->belongsTo(Media::class, 'medias_id');
    }

}

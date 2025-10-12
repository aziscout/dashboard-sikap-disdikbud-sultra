<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'laporans_id',
        'nama',
        'email',
        'nomor',
        'role',
    ];
}

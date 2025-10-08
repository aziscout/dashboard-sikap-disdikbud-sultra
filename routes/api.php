<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LayananController;

Route::post('/layanan', [LayananController::class, 'store']);
Route::get('/layanan/status/{kode_tracking}', [LayananController::class, 'status']);
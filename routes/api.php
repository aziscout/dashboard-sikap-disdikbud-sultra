<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\BeritaApiController;
use App\Http\Controllers\Api\InovasiApiController;
use App\Http\Controllers\Api\LaporanKegiatanApiController;
use App\Http\Controllers\Api\PengumumanApiController;
use App\Http\Controllers\Api\ProdukHukumApiController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\InovasiController;
use App\Http\Controllers\LaporanKegiatanController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\ProdukHukumController;

// pengumuman
    Route::get('/pengumuman',[PengumumanApiController::class,'index']);
// agenda
   Route::get('/agenda',[AgendaApiController::class,'index']);
// laporan kegiatan 
   Route::get('/laporan-kegiatan',[LaporanKegiatanApiController::class,'index']);
// produk hukum
   Route::get('/produk-hukum', [ProdukHukumApiController::class, 'index']);
// berita
   Route::get('/berita', [BeritaApiController::class, 'index']);
// invoasi
   Route::get('/inovasi', [InovasiApiController::class, 'index']);
// layanan
   Route::post('/layanan', [LayananController::class, 'store']);
   Route::get('/layanan/status/{kode_tracking}', [LayananController::class, 'status']);

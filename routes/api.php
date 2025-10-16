<?php

use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\AllGalleryApiController;
use App\Http\Controllers\Api\BeritaApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\InovasiApiController;
use App\Http\Controllers\Api\LaporanApiController;
use App\Http\Controllers\Api\PengumumanApiController;
use App\Http\Controllers\Api\ProdukHukumApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LayananController;

   Route::get('/dashboard',[DashboardApiController::class,'index']);
// pengumuman
   Route::get('/pengumuman',[PengumumanApiController::class,'index']);
// agenda 
   Route::get('/agenda',[AgendaApiController::class,'index']);
// laporan kegiatan    
   Route::get('/laporan',[LaporanApiController::class,'index']);
   // agenda detail
   Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);

   // produk hukum
   Route::get('/produk-hukum', [ProdukHukumApiController::class, 'index']);
   // berita
   Route::get('/berita', [BeritaApiController::class, 'index']);
   // berita detail
   Route::get('/berita/{id}', [BeritaApiController::class, 'show']);

   // invoasi
   Route::get('/inovasi', [InovasiApiController::class, 'index']);
   // invoasi detail
   Route::get('/inovasi/{id}', [InovasiApiController::class, 'show']);
   // gallery
   Route::get('/gallery', [AllGalleryApiController::class, 'index']);
   // layanan
   Route::post('/layanan', [LayananController::class, 'store']);
   Route::get('/layanan/status/{kode_tracking}', [LayananController::class, 'status']);

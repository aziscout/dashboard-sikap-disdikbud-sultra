<?php

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\AllGaleriApiController;
use App\Http\Controllers\Api\BeritaApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\InovasiApiController;
use App\Http\Controllers\Api\LaporanApiController;
use App\Http\Controllers\Api\PengumumanApiController;
use App\Http\Controllers\Api\ProdukHukumApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LayananApiController;

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
   Route::get('/galeri', [AllGaleriApiController::class, 'index']);
   // layanan
   Route::post('/layanan', [LayananApiController::class, 'store']);
   Route::get('/layanan/status/{kode_tracking}', [LayananApiController::class, 'status']);
   
   // admin pangkat
   Route::get('/admin', [AdminApiController::class, 'index']);
   Route::get('/datadiri', [AdminApiController::class, 'index']);

   //datadiri
   use App\Http\Controllers\DataDiriController;
   
   Route::get('/data-diri', [DataDiriController::class, 'index']);
   Route::get('/data-diri/{id}', [DataDiriController::class, 'show']);
   Route::post('/data-diri', [DataDiriController::class, 'store']);
   Route::put('/data-diri/{id}', [DataDiriController::class, 'update']);
   Route::delete('/data-diri/{id}', [DataDiriController::class, 'destroy']);

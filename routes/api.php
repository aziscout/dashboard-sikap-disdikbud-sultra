<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\AllGaleriApiController;
use App\Http\Controllers\Api\BeritaApiController;
use App\Http\Controllers\Api\BerkasApiController;
use App\Http\Controllers\Api\BidangApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\InovasiApiController;
use App\Http\Controllers\Api\LaporanApiController;
use App\Http\Controllers\Api\PegawaiApiController;
use App\Http\Controllers\Api\PengumumanApiController;
use App\Http\Controllers\Api\ProdukHukumApiController;
use App\Http\Controllers\Api\LayananApiController;
use App\Http\Controllers\Api\DataDiriApiController;

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
   // Route::get('/datadiri', [AdminApiController::class, 'index']);

   //datadiri
   Route::post('/admin/login', [AdminApiController::class, 'login']);
   // bidang
   Route::get('/bidang', [BidangApiController::class, 'index']);
   Route::post('/bidang/login', [BidangApiController::class, 'login']);
   
   // pegawai
   Route::post('/register', [PegawaiApiController::class, 'register']);
   Route::post('/login', [PegawaiApiController::class, 'login']);
   Route::middleware('auth:pegawai')->get('/pegawai', [PegawaiApiController::class, 'index']);
   Route::middleware('auth:pegawai')->post('/logout', [PegawaiApiController::class, 'logout']);

   // berkas
   Route::middleware('auth:sanctum')->group(function () {
      Route::get('/data-diri', [DataDiriApiController::class, 'index']);
      Route::get('/data-diri/{id}', [DataDiriApiController::class, 'show']);
      Route::post('/data-diri', [DataDiriApiController::class, 'store']);
      Route::put('/data-diri/{id}', [DataDiriApiController::class, 'update']);
      Route::delete('/data-diri/{id}', [DataDiriApiController::class, 'destroy']);

      Route::get('/berkas',[BerkasApiController::class,'index']);
      Route::post('/berkas',[BerkasApiController::class,'store']);
      Route::delete('/berkas/{id}',[BerkasApiController::class,'destroy']);
      Route::put('/berkas/{id}',[BerkasApiController::class,'update']);
   });

   // pegawai data diri and berkas
   Route::middleware('auth:pegawai')->group(function () {
      Route::get('/pegawai/data-diri', [DataDiriApiController::class, 'index']);
      Route::get('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'show']);
      Route::post('/pegawai/data-diri', [DataDiriApiController::class, 'store']);
      Route::put('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'update']);
      Route::delete('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'destroy']);

      Route::get('/pegawai/berkas',[BerkasApiController::class,'index']);
      Route::post('/pegawai/berkas',[BerkasApiController::class,'store']);
      Route::delete('/pegawai/berkas/{id}',[BerkasApiController::class,'destroy']);
      Route::put('/pegawai/berkas/{id}',[BerkasApiController::class,'update']);
   });
   
   // Route::get('/berkas',[BerkasApiController::class,'index']);
   // Route::post('/berkas',[BerkasApiController::class,'store']);
   // Route::delete('/berkas/{id}',[BerkasApiController::class,'destroy']);
   // Route::post('/berkas/{id}',[BerkasApiController::class,'update']);

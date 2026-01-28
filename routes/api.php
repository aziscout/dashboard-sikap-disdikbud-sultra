<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\ArsipApiController;
use App\Http\Controllers\Api\Berkas\FileSkController;
use App\Http\Controllers\Api\Berkas\SkCpnsController;
use App\Http\Controllers\Api\Berkas\SkGajiBerkalaController;
use App\Http\Controllers\Api\Berkas\SkJabatanController;
use App\Http\Controllers\Api\Berkas\SkPangkatTerakhirController;
use App\Http\Controllers\Api\Berkas\SkPnsController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\PegawaiApiController;
use App\Http\Controllers\Api\DataDiriApiController;

   // admin pangkat
   Route::get('/admin', [AdminApiController::class, 'index']);
   // Route::get('/datadiri', [AdminApiController::class, 'index']);

   //datadiri
   Route::post('/admin/login', [AdminApiController::class, 'login']);
   
   // pegawai
   Route::post('/register', [PegawaiApiController::class, 'register']);
   Route::post('/login', [PegawaiApiController::class, 'login']);
   Route::middleware('auth:sanctum')->group(function () {
      Route::get('/pegawai/profile', [PegawaiApiController::class, 'getProfile']);
      Route::put('/pegawai/profile', [PegawaiApiController::class, 'updateProfile']);
      Route::post('/logout', [PegawaiApiController::class, 'logout']);
   });

   // pegawai data diri and berkas
   Route::middleware('auth:sanctum')->group(function () {
      Route::get('/pegawai/data-diri', [DataDiriApiController::class, 'index']);
      Route::get('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'show']);
      Route::post('/pegawai/data-diri', [DataDiriApiController::class, 'store']);
      Route::put('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'update']);
      Route::delete('/pegawai/data-diri/{id}', [DataDiriApiController::class, 'destroy']);

      Route::get('/pegawai/arsip-pangkat',[ArsipApiController::class,'index']);
      Route::get('/pegawai/arsip-pangkat/show',[ArsipApiController::class,'show  ']);
      
      // cpns
      Route::post('/berkas/kenaikan-pangkat/sk-cpns', [SkCpnsController::class, 'store']);
      Route::post('/berkas/kenaikan-pangkat/sk-cpns/update', [SkCpnsController::class, 'update']);
      Route::get('/berkas/kenaikan-pangkat/sk-cpns', [SkCpnsController::class, 'show']);

      // pns
      Route::post('/berkas/kenaikan-pangkat/sk-pns', [SkPnsController::class, 'store']);
      Route::post('/berkas/kenaikan-pangkat/sk-pns/update', [SkPnsController::class, 'update']);
      Route::get('/berkas/kenaikan-pangkat/sk-pns', [SkPnsController::class, 'show']);

      // gaji berkala
      Route::post('/berkas/kenaikan-pangkat/sk-gaji-berkala', [SkGajiBerkalaController::class, 'store']);
      Route::post('/berkas/kenaikan-pangkat/sk-gaji-berkala/update', [SkGajiBerkalaController::class, 'update']);
      Route::get('/berkas/kenaikan-pangkat/sk-gaji-berkala', [SkGajiBerkalaController::class, 'show']);

      // pangkat terakhir
      Route::post('berkas/kenaikan-pangkat/sk-pangkat-terakhir', [SkPangkatTerakhirController::class, 'store']);
      Route::post('berkas/kenaikan-pangkat/sk-pangkat-terakhir/update', [SkPangkatTerakhirController::class, 'update']);
      Route::get('berkas/kenaikan-pangkat/sk-pangkat-terakhir', [SkPangkatTerakhirController::class, 'show']);

      // jabatan
      Route::post('/berkas/kenaikan-pangkat/sk-jabatan', [SkJabatanController::class, 'store']);
      Route::post('/berkas/kenaikan-pangkat/sk-jabatan/update', [SkJabatanController::class, 'update']);
      Route::get('/berkas/kenaikan-pangkat/sk-jabatan', [SkJabatanController::class, 'show']);

      Route::get('berkas/kenaikan-pangkat/file-sk', [FileSkController::class, 'show']);
   });
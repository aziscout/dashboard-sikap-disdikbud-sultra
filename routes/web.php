<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\ProdukHukumController;
use App\Http\Controllers\LaporanKegiatanController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\InovasiController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // pengumuman

    Route::middleware(['permission:Pengumuman'])->group(function(){
        Route::get('/pengumuman',[PengumumanController::class,'index'])->name('pengumuman.index');
        Route::get('/pengumuman/create',[PengumumanController::class,'create'])->name('pengumuman.create');
        Route::post('/pengumuman',[PengumumanController::class,'store'])->name('pengumuman.store');
        Route::get('/pengumuman/{pengumuman}/edit',[PengumumanController::class,'edit'])->name('pengumuman.edit');
        Route::put('/pengumuman/{pengumuman}',[PengumumanController::class,'update'])->name('pengumuman.update');
        Route::delete('/pengumuman/{pengumuman}',[PengumumanController::class,'destroy'])->name('pengumuman.destroy');
    });
    
    // agenda
    Route::middleware(['permission:Agenda'])->group(function(){
        Route::get('/agenda',[AgendaController::class,'index'])->name('agenda.index');
        Route::get('/agenda/create',[AgendaController::class,'create'])->name('agenda.create');
        Route::post('/agenda',[AgendaController::class,'store'])->name('agenda.store');
        Route::get('/agenda/{agenda}/edit',[AgendaController::class,'edit'])->name('agenda.edit');
        Route::put('/agenda/{agenda}',[AgendaController::class,'update'])->name('agenda.update');
        Route::delete('/agenda/{agenda}',[AgendaController::class,'destroy'])->name('agenda.destroy');
    });
    // laporan kegiatan
    Route::middleware(['permission:Laporan Kegiatan'])->group(function(){
        Route::get('/laporan-kegiatan',[LaporanKegiatanController::class,'index'])->name('laporan-kegiatan.index');
        Route::get('/laporan-kegiatan/create',[LaporanKegiatanController::class,'create'])->name('laporan-kegiatan.create');
        Route::post('/laporan-kegiatan',[LaporanKegiatanController::class,'store'])->name('laporan-kegiatan.store');
        Route::get('/laporan-kegiatan/{laporanKegiatan}/edit',[LaporanKegiatanController::class,'edit'])->name('laporan-kegiatan.edit');
        Route::put('/laporan-kegiatan/{laporanKegiatan}',[LaporanKegiatanController::class,'update'])->name('laporan-kegiatan.update');
        Route::delete('/laporan-kegiatan/{laporanKegiatan}',[LaporanKegiatanController::class,'destroy'])->name('laporan-kegiatan.destroy');
    });

    // produk hukum
    Route::middleware(['permission:Produk Hukum'])->group(function(){
        Route::get('/produk-hukum', [ProdukHukumController::class, 'index'])->name('produk-hukum.index');
        Route::get('/produk-hukum/create', [ProdukHukumController::class, 'create'])->name('produk-hukum.create');
        Route::post('/produk-hukum', [ProdukHukumController::class, 'store'])->name('produk-hukum.store');
        Route::delete('/produk-hukum/{produkHukum}', [ProdukHukumController::class, 'destroy'])->name('produk-hukum.destroy');
        
    });
    // layanan
    Route::middleware(['permission:Layanan'])->group(function(){
    Route::get('/layanan', [LayananController::class, 'index'])->name('layanan.index'); // list laporan
    Route::get('/layanan/{layanan}', [LayananController::class, 'show'])->name('layanan.show'); // detail laporan
    Route::get('/layanan/{layanan}/edit', [LayananController::class, 'edit'])->name('layanan.edit'); // form edit
    Route::put('/layanan/{layanan}', [LayananController::class, 'update'])->name('layanan.update'); // update status
    Route::delete('/layanan/{layanan}', [LayananController::class, 'destroy'])->name('layanan.destroy'); // hapus
    });

    //inovasi
    Route::get('/inovasi', [InovasiController::class, 'index'])->name('inovasi.index');
    Route::get('/inovasi/create', [InovasiController::class, 'create'])->name('inovasi.create');
    Route::post('/inovasi', [InovasiController::class, 'store'])->name('inovasi.store');
    Route::get('/inovasi/{inovasi}/edit', [InovasiController::class, 'edit'])->name('inovasi.edit');
    Route::put('/inovasi/{inovasi}', [InovasiController::class, 'update'])->name('inovasi.update');
    Route::delete('/inovasi/{inovasi}', [InovasiController::class, 'destroy'])->name('inovasi.destroy');



    
});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

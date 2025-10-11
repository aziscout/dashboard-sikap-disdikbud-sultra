<?php

use App\Http\Controllers\BeritaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Bidang\DashboardController as BidangDashboardController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\ProdukHukumController;
use App\Models\Berita;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\InovasiController;
use App\Http\Controllers\LaporanKegiatanController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\PengumumanController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect('admin/dashboard');
        }
        if ($user->role === 'bidang') {
            return redirect('bidang/dashboard');
        }
        return redirect('login');
    } else {
        return redirect('login');
    }
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    // Route::get('/dashboard/create', [DashboardController::class, 'create'])->name('dashboard.create');
    // Route::post('/dashboard', [DashboardController::class, 'store'])->name('dashboard.store');
    // Route::get('/dashboard/edit', [DashboardController::class, 'edit'])->name('dashboard.edit');
    // Route::post('/dashboard/update', [DashboardController::class, 'update'])->name('dashboard.update');

    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('/admin/dashboard/create', [AdminDashboardController::class, 'create'])->name('admin.dashboard.create');
        Route::post('/admin/dashboard', [AdminDashboardController::class, 'store'])->name('admin.dashboard.store');
        Route::get('/admin/dashboard/edit', [AdminDashboardController::class, 'edit'])->name('admin.dashboard.edit');
        Route::post('/admin/dashboard/update', [AdminDashboardController::class, 'update'])->name('admin.dashboard.update');
    });

    // DASHBOARD BIDANG
    Route::middleware(['role:bidang'])->group(function () {
        Route::get('/bidang/dashboard', [BidangDashboardController::class, 'index'])
            ->name('bidang.dashboard');
    });

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
        Route::get('/produk-hukum/{produkHukum}/edit', [ProdukHukumController::class, 'edit'])->name('produk-hukum.edit');
        Route::post('/produk-hukum/{produkHukum}', [ProdukHukumController::class, 'update'])->name('produk-hukum.update');
        Route::delete('/produk-hukum/{produkHukum}', [ProdukHukumController::class, 'destroy'])->name('produk-hukum.destroy');
    
    });
    // Berita
    Route::middleware(['permission:Berita'])->group(function(){
        Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
        Route::get('/berita/create', [BeritaController::class, 'create'])->name('berita.create');
        Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
        Route::get('/berita/{berita}/edit', [BeritaController::class, 'edit'])->name('berita.edit');
        Route::put('/berita/{berita}', [BeritaController::class, 'update'])->name('berita.update');
        Route::delete('/berita/{berita}', [BeritaController::class, 'destroy'])->name('berita.destroy');
    });
    // invoasi
    Route::middleware(['permission:Inovasi'])->group(function(){
        Route::get('/inovasi', [InovasiController::class, 'index'])->name('inovasi.index');
        Route::get('/inovasi/create', [InovasiController::class, 'create'])->name('inovasi.create');
        Route::post('/inovasi', [InovasiController::class, 'store'])->name('inovasi.store');
        Route::get('/inovasi/{inovasi}/edit', [InovasiController::class, 'edit'])->name('inovasi.edit');
        Route::put('/inovasi/{inovasi}', [InovasiController::class, 'update'])->name('inovasi.update');
        Route::delete('/inovasi/{inovasi}', [InovasiController::class, 'destroy'])->name('inovasi.destroy');

    });
    // layanan
    Route::middleware(['permission:Layanan'])->group(function(){
        Route::get('/layanan', [LayananController::class, 'index'])->name('layanan.index'); // list laporan
        Route::get('/layanan/{layanan}', [LayananController::class, 'show'])->name('layanan.show'); // detail laporan
        Route::get('/layanan/{layanan}/edit', [LayananController::class, 'edit'])->name('layanan.edit'); // form edit
        Route::put('/layanan/{layanan}', [LayananController::class, 'update'])->name('layanan.update'); // update status
        Route::delete('/layanan/{layanan}', [LayananController::class, 'destroy'])->name('layanan.destroy'); // hapus
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

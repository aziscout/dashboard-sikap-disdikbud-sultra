<?php

use App\Http\Controllers\ArsipKgbController;
use App\Http\Controllers\Pangkat\DashboardController as PangkatDashboardController;
use App\Http\Controllers\ArsipPangkatController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\UsulanKgbController;
use App\Http\Controllers\UsulanPangkatController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role === 'admin_sikap') {
            return redirect('pangkat/dashboard');
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

    Route::middleware(['role:admin_sikap'])->group(function () {
        Route::get('pangkat/dashboard', [PangkatDashboardController::class, 'index'])->name('pangkat.dashboard');
    });

    Route::middleware(['permission:Pegawai'])->group(function() {
        Route::resource('/pangkat/pegawai', PegawaiController::class);
    });

    Route::middleware(['permission:Kenaikan Pangkat'])->group(function() {
        Route::get('/pangkat/usulan-pangkat', [ UsulanPangkatController::class, 'index'])->name('pangkat.usulan-pangkat');
        Route::get('/pangkat/usulan-pangkat/detail/{id}', [UsulanPangkatController::class, 'status'])
        ->name('pangkat.usulan-pangkat.status');
        Route::post('/pangkat/usulan-pangkat/updateStatus/{id}', [UsulanPangkatController::class, 'updateStatus'])->name('pangkat.usulan-pangkat.updateStatus');
        Route::get('/pangkat/arsip-pangkat', [ArsipPangkatController::class, 'index'])->name('pangkat.arsip-pangkat');
        Route::get('/pangkat/arsip-pangkat/show/{id}', [ArsipPangkatController::class, 'show'])->name('pangkat.arsip-pangkat.show');
    });

    Route::middleware(['permission:Kenaikan Gaji Berkala'])->group(function() {
        Route::get('/pangkat/usulan-kgb', [ UsulanKgbController::class, 'index'])->name('pangkat.usulan-kgb');
        Route::get('/pangkat/usulan-kgb/detail/{id}', [ UsulanKgbController::class, 'status'])->name('pangkat.usulan-kgb.status');
        Route::get('/pangkat/arsip-kgb', [ArsipKgbController::class, 'index'])->name('pangkat.arsip-kgb');
        Route::get('/pangkat/arsip-kgb/show/{id}', [ArsipKgbController::class, 'show'])->name('pangkat.arsip-kgb.show');

    });
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

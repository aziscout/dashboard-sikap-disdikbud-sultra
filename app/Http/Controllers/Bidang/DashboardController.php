<?php

namespace App\Http\Controllers\Bidang;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use App\Models\Layanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('bidang/dashboard/index', [
            'title' => 'Dashboard Bidang',
            'user' => $user,
            'data' => [
                'totalLayanan' => Layanan::count(),
                'totalLayananAktif' => Layanan::where('status', 'aktif')->count(),
                'totalLaporanKegiatan' => LaporanKegiatan::count(),
            ],    
        ]);
    }
}

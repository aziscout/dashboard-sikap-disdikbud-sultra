<?php

namespace App\Http\Controllers\Bidang;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Models\Layanan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $layananQuery = Layanan::query();
        $laporanQuery = Laporan::query();

        if ($user && $user->role === 'bidang') {
            $bidangFilter = $user->name ?? explode('@', $user->email)[0];
            $layananQuery->where('bidang', $bidangFilter);
            $laporanQuery->where('bidangs_id', $user->id);
        }

        return Inertia::render('bidang/dashboard/index', [
            'title' => 'Dashboard Bidang',
            'user' => $user,
            'data' => [
                'totalLayanan' => $layananQuery->count(),
                'totalLayananAktif' => (clone $layananQuery)->where('status', 'Diproses')->count(),
                'totalLaporanKegiatan' => $laporanQuery->count(),
            ],
        ]);
    }
}

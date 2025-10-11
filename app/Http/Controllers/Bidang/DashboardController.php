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

        $layananQuery = Layanan::query();
        $laporanQuery = LaporanKegiatan::query();

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

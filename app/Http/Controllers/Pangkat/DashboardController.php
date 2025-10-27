<?php

namespace App\Http\Controllers\Pangkat;

use App\Http\Controllers\Controller;
use App\Models\DataDiri;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPegawai = Pegawai::count();

        // Ambil tahun sekarang
        $tahunSekarang = Carbon::now()->year;

        // Pegawai yang TMT golongan-nya jatuh pada tahun ini
        $pegawaiNaikPangkat = DataDiri::with('pegawai')
            ->whereYear('tmt_golongan', $tahunSekarang)
            ->get();

        $totalNaikPangkat = $pegawaiNaikPangkat->count();

        return Inertia::render('pangkat/dashboard/index', [
            'totalPegawai' => $totalPegawai,
            'totalNaikPangkat' => $totalNaikPangkat,
            'pegawaiNaikPangkat' => $pegawaiNaikPangkat->map(function ($item) {
                return [
                    'nama' => $item->pegawai->nama ?? '-',
                    'golongan_ruang' => $item->golongan_ruang ?? '-',
                    'jenis_kelamin' => $item->pegawai->jenis_kelamin ?? '-',
                    'alamat' => $item->pegawai->alamat ?? '-',
                    'tmt_golongan' => Carbon::parse($item->tmt_golongan)->format('d/m/Y'),
                ];
            }),
        ]);
    }
}

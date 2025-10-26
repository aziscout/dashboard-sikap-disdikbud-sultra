<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsulanPangkatController extends Controller
{
    public function index()
    {
        // Tanggal sekarang
        $today = Carbon::today();

        // Batas 3 bulan ke depan
        $threeMonthsLater = $today->copy()->addMonths(3);

        // Ambil pegawai yang TMT golongan-nya dalam <= 3 bulan lagi
        $pegawai = Pegawai::with(['berkas', 'dataDiri'])
            ->whereHas('dataDiri', function ($query) use ($today, $threeMonthsLater) {
                $query->whereBetween('tmt_golongan', [$today, $threeMonthsLater]);
            })
            ->get();

        return Inertia::render('pangkat/usulanPangkat/index', [
            'pegawai' => $pegawai,
        ]);
    }

    public function show($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.usulanPangkat')->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/usulanPangkat/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }  
}

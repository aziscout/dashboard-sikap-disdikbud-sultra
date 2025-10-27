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
        $today = Carbon::today();

        // Ambil semua pegawai dengan relasi data diri dan berkas
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->get();

        // Filter pegawai yang:
        // 1. Sudah mendekati TMT (3 bulan sebelum)
        // 2. Sudah melengkapi seluruh berkas
        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;

            if (!$tmt) {
                return false; // jika belum punya TMT, skip
            }

            $tmtDate = Carbon::parse($tmt);
            $threeMonthsBefore = $tmtDate->copy()->subMonths(3);

            // kondisi 1: waktu sekarang sudah melewati 3 bulan sebelum TMT
            $isEligibleByDate = $today->greaterThanOrEqualTo($threeMonthsBefore);

            // kondisi 2: cek berkas lengkap
            $berkas = $item->berkas->first(); // ambil baris pertama (karena biasanya 1 pegawai = 1 kumpulan berkas)
            $isBerkasComplete = $berkas &&
                $berkas->sk_cpns &&
                $berkas->sk_pns &&
                $berkas->sk_gaji_berkala &&
                $berkas->sk_jabatan &&
                $berkas->sk_pangkat_terakhir;

            // return true jika dua-duanya terpenuhi
            return $isEligibleByDate && $isBerkasComplete;
        })->values();

        return Inertia::render('pangkat/usulanPangkat/index', [
            'pegawai' => $filteredPegawai,
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

<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
use App\Models\Pegawai; // Ubah ke Model Pegawai
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArsipKgbController extends Controller
{
    public function index()
    {
        Carbon::setLocale('id');

        $batasArsip = Carbon::today()->subYears(2)->toDateString();

        $arsip = Pegawai::with(['dataDiri'])
            ->whereHas('dataDiri', function ($query) use ($batasArsip) {
                $query
                    ->whereNotNull('kgb_terakhir')
                    ->where('kgb_terakhir', '!=', '-')
                    ->whereDate('kgb_terakhir', '<=', $batasArsip);
            })
            ->latest()
            ->paginate(10)
            ->through(function ($pegawai) {

                $kgb = optional($pegawai->dataDiri)->kgb_terakhir;

                return [
                    'id' => $pegawai->id,
                    'nama' => $pegawai->nama ?? '-',
                    'nomor' => $pegawai->nomor ?? '-',
                    'nip' => $pegawai->nip ?? '-',
                    'email' => $pegawai->email ?? '-',
                    'unit_kerja' => $pegawai->unit_kerja ?? '-',
                    'gaji_pokok' => optional($pegawai->dataDiri)->gaji_pokok ?? '-',

                    // ✅ AMAN
                    'kgb_terakhir' => (
                        $kgb &&
                        $kgb !== '-' &&
                        Carbon::hasFormat($kgb, 'Y-m-d')
                    )
                        ? Carbon::createFromFormat('Y-m-d', $kgb)->translatedFormat('d F Y')
                        : '-',
                ];
            });

        return Inertia::render('pangkat/arsip-kgb/index', [
            'arsip' => $arsip,
        ]);
    }


    public function show($id)
    {
        $batasArsip = Carbon::today()->subYears(2)->toDateString();

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])
            ->whereHas('dataDiri', function ($query) use ($batasArsip) {
                $query
                    ->whereNotNull('kgb_terakhir')
                    ->where('kgb_terakhir', '!=', '-')
                    ->whereDate('kgb_terakhir', '<=', $batasArsip);
            })
            ->find($id);

        if (!$pegawai) {
            return redirect()
                ->route('pangkat.arsip-kgb')
                ->with('message', 'Data arsip tidak ditemukan.');
        }

        return Inertia::render('pangkat/arsip-kgb/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas->first(),
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

}
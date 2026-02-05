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
        $today = Carbon::today();

        $arsip = Pegawai::with(['dataDiri'])
            ->whereHas('dataDiri', function ($query) use ($today) {
                $query->where('kgb_terakhir', '<=', $today->copy()->subYears(2));
            })
            ->latest()
            ->paginate(10)
            ->through(function ($pegawai) {
                return [
                    'id' => $pegawai->id,
                    'nama' => $pegawai->nama ?? '-',
                    'nomor' => $pegawai->nomor ?? '-',
                    'nip' => $pegawai->nip ?? '-',
                    'email' => $pegawai->email ?? '-',
                    'unit_kerja' => $pegawai->unit_kerja ?? '-',
                    'gaji_pokok' => optional($pegawai->dataDiri)->gaji_pokok ?? '-',
                    'kgb_terakhir' => optional($pegawai->dataDiri)->kgb_terakhir
                        ? Carbon::parse($pegawai->dataDiri->kgb_terakhir)->translatedFormat('d F Y')
                        : '-',
                ];
            });

        return Inertia::render('pangkat/arsip-kgb/index', [
            'arsip' => $arsip,
        ]);
    }

    public function show($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])
            ->whereHas('dataDiri', function ($query) {
                $query->where('kgb_terakhir', '<=', Carbon::now()->subYears(2));
            })
            ->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.arsip-kgb')->with('message', 'Data arsip tidak ditemukan.');
        }

        $berkas = $pegawai->berkas->first();

        return Inertia::render('pangkat/arsip-kgb/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai?->dataDiri,
            'berkas' => $berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }
}
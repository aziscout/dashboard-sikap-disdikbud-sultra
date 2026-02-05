<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArsipPangkatController extends Controller
{
    public function index()
    {
        Carbon::setLocale('id');

        $arsip = Berkas::with(['pegawai.dataDiri'])
            ->where('status', true)
            ->latest()
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->pegawai->nama ?? '-',
                    'nomor' => $item->pegawai->nomor ?? '-',
                    'nip' => $item->pegawai->nip ?? '-',
                    'email' => $item->pegawai->email ?? '-',
                    'unit_kerja' => $item->pegawai->unit_kerja ?? '-',
                    'tmt_golongan' => optional($item->pegawai->dataDiri)->tmt_golongan
                        ? Carbon::parse($item->pegawai->dataDiri->tmt_golongan)->translatedFormat('d F Y')
                        : '-',
                ];
            });

        return Inertia::render('pangkat/arsip-pangkat/index', [
            'arsip' => $arsip,
        ]);
    }

    public function show($id)
    {
        $berkas = Berkas::with(['pegawai.dataDiri'])
            ->whereHas('pegawai.dataDiri', function ($query) {
                $query->where('tmt_golongan', '>=', Carbon::now()->subMonths(2));
            })
            ->find($id);

    if (!$berkas) {
            return redirect()->route('pangkat.arsip-pangkat')->with('message', 'Data arsip tidak ditemukan.');
        }

        $pegawai = $berkas->pegawai;

        return Inertia::render('pangkat/arsip-pangkat/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai?->dataDiri,
            'berkas' => $berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }
}

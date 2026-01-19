<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berkas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArsipApiController extends Controller
{
    public function index()
    {
        $arsip = Berkas::with(['pegawai.dataDiri'])
            ->where('status', 'sk telah terbit')
            ->latest()
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->pegawai->nama ?? '-',
                    'nomor' => $item->pegawai->nomor ?? '-',
                    'email' => $item->pegawai->email ?? '-',
                    'jenis_kelamin' => $item->pegawai->jenis_kelamin ?? '-',
                    'alamat' => $item->pegawai->alamat ?? '-',
                    'tmt_golongan' => optional($item->pegawai->dataDiri)->tmt_golongan
                        ? Carbon::parse($item->pegawai->dataDiri->tmt_golongan)->format('d/m/Y')
                        : '-',
                    'tanggal_naik_pangkat' => Carbon::parse($item->updated_at)->format('d/m/Y'),
                ];
            });

        return Inertia::render('pangkat/arsip-pangkat/index', [
            'arsip' => $arsip,
        ]);
    }

    public function show(Request $request)
    {
        $pegawai = $request->user();

        $berkas = Berkas::with(['pegawai.dataDiri'])
            ->where('status', 'sk telah terbit')
            ->find($pegawai);

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

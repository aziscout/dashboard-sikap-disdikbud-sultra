<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index()
    {
        // Menggunakan paginate() alih-alih get()
        $riwayat = Berkas::with(['pegawai.dataDiri'])
            ->where('status', 'sk telah terbit')
            ->latest()
            ->paginate(10) // Tambahkan pagination, misalnya 10 item per halaman
            ->through(function ($item) { // Menggunakan through() untuk memetakan data berhalaman
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

        return Inertia::render('pangkat/riwayat/index', [
            'riwayat' => $riwayat, // 'riwayat' sekarang adalah objek pagination
        ]);
    }

    public function show($id)
    {
        $berkas = Berkas::with(['pegawai.dataDiri'])
            ->where('status', 'sk telah terbit')
            ->find($id);

        if (!$berkas) {
            return redirect()->route('pangkat.riwayat')->with('message', 'Data riwayat tidak ditemukan.');
        }

        $pegawai = $berkas->pegawai;

        return Inertia::render('pangkat/riwayat/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai?->dataDiri,
            'berkas' => $berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

}

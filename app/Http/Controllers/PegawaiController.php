<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    public function index()
    {
        $pegawai = Pegawai::select('id', 'nama', 'email', 'jenis_kelamin', 'alamat', 'created_at')->get();

        return Inertia::render('pangkat/pegawai/index', [
            'pegawai' => $pegawai,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    public function show($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/pegawai/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }   

    public function status($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/pegawai/status', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas,
        ]);
    }


}

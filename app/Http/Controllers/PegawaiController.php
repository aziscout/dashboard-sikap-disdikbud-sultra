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

    public function create()
    {
        return Inertia::render('pangkat/pegawai/create', []);
    }

}

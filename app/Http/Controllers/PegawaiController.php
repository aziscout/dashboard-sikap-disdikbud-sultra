<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    public function index()
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])
            ->select('id', 'nama', 'email', 'jenis_kelamin', 'alamat', 'created_at')
            ->get();

        $pegawai->transform(function ($item) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;
            $status = 'Belum Siap';
            $siap = false;

            if ($tmt) {
                $tmtDate = Carbon::parse($tmt);
                $threeMonthsBefore = $tmtDate->copy()->subMonths(3);

                if (Carbon::now()->greaterThanOrEqualTo($threeMonthsBefore)) {
                    $status = 'Siap';
                    $siap = true;
                }
            }

            $hasBerkas = $item->berkas && $item->berkas->count() > 0;

            $isActive = $siap && $hasBerkas;

            $item->status = $status;
            $item->tmt_golongan = $tmt ? Carbon::parse($tmt)->format('d/m/Y') : '-';
            $item->is_active = $isActive;

            return $item;
        });

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

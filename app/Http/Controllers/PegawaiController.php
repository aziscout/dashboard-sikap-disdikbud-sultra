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
        Carbon::setLocale('id');

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])
            ->select('id', 'nama', 'nomor', 'nip', 'email', 'unit_kerja', 'created_at')
            // ->get();
            ->paginate(20);

        $pegawai->transform(function ($item) {
            $dataDiri = $item->dataDiri;

            $tmt = $dataDiri->tmt_golongan ?? null;
            $kgbTerakhir = $dataDiri->kgb_terakhir ?? null;

            $status = 'Belum Siap';
            $isActive = false;

            if ($tmt) {
                $tmtDate = Carbon::parse($tmt);
                $nextPromotionDate = $tmtDate->copy()->addYears(4);
                $twoMonthsBefore = $nextPromotionDate->copy()->subMonths(2);

                if (Carbon::now()->greaterThanOrEqualTo($twoMonthsBefore)) {
                    $status = 'Siap';
                }
            }

            $hasBerkas = $item->berkas && $item->berkas->count() > 0;
            $isActive = $status === 'Siap' && $hasBerkas;

            $item->status = $status;
            $item->is_active = $isActive;

            $item->tmt_golongan = $tmt
                ? Carbon::parse($tmt)->translatedFormat('d-m-Y')
                : '-';

            $item->kgb_terakhir = $kgbTerakhir
                ? Carbon::parse($kgbTerakhir)->translatedFormat('d-m-Y')
                : '-';

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
        Carbon::setLocale('id');

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        // Format dates in pegawai
        $pegawai->tanggal_lahir = $pegawai->tanggal_lahir
            ? Carbon::parse($pegawai->tanggal_lahir)->translatedFormat('d F Y')
            : '-';

        // Format dates in data_diri
        if ($pegawai->dataDiri) {
            $pegawai->dataDiri->tmt_golongan = $pegawai->dataDiri->tmt_golongan
                ? Carbon::parse($pegawai->dataDiri->tmt_golongan)->translatedFormat('d F Y')
                : '-';

            $pegawai->dataDiri->tanggal_sk = $pegawai->dataDiri->tanggal_sk
                ? Carbon::parse($pegawai->dataDiri->tanggal_sk)->translatedFormat('d F Y')
                : '-';

            $pegawai->dataDiri->tanggal_pertek_bkn = $pegawai->dataDiri->tanggal_pertek_bkn
                ? Carbon::parse($pegawai->dataDiri->tanggal_pertek_bkn)->translatedFormat('d F Y')
                : '-';

            $pegawai->dataDiri->kgb_terakhir = $pegawai->dataDiri->kgb_terakhir
                ? Carbon::parse($pegawai->dataDiri->kgb_terakhir)->translatedFormat('d F Y')
                : '-';
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

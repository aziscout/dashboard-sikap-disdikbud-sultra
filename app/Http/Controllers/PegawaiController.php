<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    private function isValidDate($date)
    {
        return !empty($date)
            && $date !== '-'
            && Carbon::hasFormat($date, 'Y-m-d');
    }

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

            // ================= TMT =================
            if ($this->isValidDate($tmt)) {
                $tmtDate = Carbon::createFromFormat('Y-m-d', $tmt);
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

            // ================= FORMAT OUTPUT =================
            $item->tmt_golongan = $this->isValidDate($tmt)
                ? Carbon::createFromFormat('Y-m-d', $tmt)->translatedFormat('d-m-Y')
                : '-';

            $item->kgb_terakhir = $this->isValidDate($kgbTerakhir)
                ? Carbon::createFromFormat('Y-m-d', $kgbTerakhir)->translatedFormat('d-m-Y')
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

    private function formatTanggal($date)
    {
        return $this->isValidDate($date)
            ? Carbon::createFromFormat('Y-m-d', $date)->translatedFormat('d F Y')
            : '-';
    }


    public function show($id)
    {
        Carbon::setLocale('id');

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        // Format dates in pegawai
        $pegawai->tanggal_lahir = $this->formatTanggal($pegawai->tanggal_lahir);

        if ($pegawai->dataDiri) {
            $pegawai->dataDiri->tmt_golongan = $this->formatTanggal($pegawai->dataDiri->tmt_golongan);
            $pegawai->dataDiri->tanggal_sk = $this->formatTanggal($pegawai->dataDiri->tanggal_sk);
            $pegawai->dataDiri->tanggal_pertek_bkn = $this->formatTanggal($pegawai->dataDiri->tanggal_pertek_bkn);
            $pegawai->dataDiri->kgb_terakhir = $this->formatTanggal($pegawai->dataDiri->kgb_terakhir);
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

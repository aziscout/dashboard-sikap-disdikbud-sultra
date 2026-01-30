<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class UsulanKgbController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->get();

        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $kgb = $item->dataDiri->kgb_terakhir ?? null;

            if (!$kgb) {
                return false;
            }

            $kgbKenaikan = Carbon::parse($kgb)->addYears(2);

            $duaBulanSebelum = $kgbKenaikan->copy()->subMonths(2);

            $isEligibleByDate = $today->greaterThanOrEqualTo($duaBulanSebelum);

            $berkas = $item->berkas->first();

            $belumNaikBerkala = !$berkas || $berkas->status !== 'sk telah terbit';

            return $isEligibleByDate && $belumNaikBerkala;
        })->values();

        
        $perPage = 20;
        $currentPage = $request->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;

        $items = $filteredPegawai->slice($offset, $perPage)->values();

        $paginatedPegawai = new LengthAwarePaginator(
            $items,
            $filteredPegawai->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url()]
        );

        return Inertia::render('pangkat/usulan-kgb/index', [
            'pegawai' => $paginatedPegawai,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    public function status($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.usulan-kgb')
                ->with('message', 'Data pegawai tidak ditemukan.');
        }

        $berkas = $pegawai->berkas()->latest()->first();

        return Inertia::render('pangkat/usulan-kgb/status', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $berkas,
        ]);
    }
}

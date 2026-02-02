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
        Carbon::setLocale('id');

        $today = Carbon::today();

        $pegawai = Pegawai::with(['dataDiri'])->get();

        $pegawai = Pegawai::with(['dataDiri'])->get();

        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $kgbTerakhirStr = $item->dataDiri->kgb_terakhir ?? null;
            
            if (!$kgbTerakhirStr) return false;

            $kgbTerakhir = Carbon::parse($kgbTerakhirStr);
            $jatuhTempoKgb = $kgbTerakhir->copy()->addYears(2); // Tepat 2 tahun kemudian
            $duaBulanSebelum = $jatuhTempoKgb->copy()->subMonths(2); // Mulai muncul 2 bulan sebelum

            return $today->between($duaBulanSebelum, $jatuhTempoKgb);
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
        ]);
    }

    public function status($id)
    {
        $pegawai = Pegawai::with(['dataDiri'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.usulan-kgb')
                ->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/usulan-kgb/status', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
        ]);
    }
}

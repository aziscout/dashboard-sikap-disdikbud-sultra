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

        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {

            // Pastikan relasi ada
            if (!$item->dataDiri) {
                return false;
            }

            $kgbTerakhirStr = $item->dataDiri->kgb_terakhir;

            // ⛔ CEGAH '-' / NULL / FORMAT SALAH
            if (
                empty($kgbTerakhirStr) ||
                $kgbTerakhirStr === '-' ||
                !Carbon::hasFormat($kgbTerakhirStr, 'Y-m-d')
            ) {
                return false;
            }

            // ✅ AMAN DIPARSE
            $kgbTerakhir = Carbon::createFromFormat('Y-m-d', $kgbTerakhirStr);

            $jatuhTempoKgb = $kgbTerakhir->copy()->addYears(2);
            $duaBulanSebelum = $jatuhTempoKgb->copy()->subMonths(2);

            return $today->between($duaBulanSebelum, $jatuhTempoKgb);
        })->values();

        // ================= PAGINATION =================
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

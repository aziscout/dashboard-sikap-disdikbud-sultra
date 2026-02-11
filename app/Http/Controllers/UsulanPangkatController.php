<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
use App\Models\DataDiri;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UsulanPangkatController extends Controller
{
    public function index(Request $request)
    {
        Carbon::setLocale('id');

        $today = Carbon::today();

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->get();

        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {

            $tmtStr = $item->dataDiri->tmt_golongan ?? null;
            if (!$tmtStr) return false;

            $tmt = Carbon::parse($tmtStr);

            $tglNaikPangkat = $tmt->copy()->addYears(4);
            $duaBulanSebelum = $tglNaikPangkat->copy()->subMonths(2);

            if ($today->gt($tglNaikPangkat)) {
                return false;
            }

            if ($today->lt($duaBulanSebelum)) {
                return false;
            }

            $berkasTerakhir = $item->berkas
                ->sortByDesc('created_at')
                ->first();

            if (!$berkasTerakhir) {
                return true;
            }

            $batasBerkas = Carbon::parse($berkasTerakhir->created_at)->addMonths(2);

            if ($today->gt($batasBerkas)) {
                return false;
            }

            return true;
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

        return Inertia::render('pangkat/usulan-pangkat/index', [
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
            return redirect()->route('pangkat.usulan-pangkat')
                ->with('message', 'Data pegawai tidak ditemukan.');
        }

        $berkas = $pegawai->berkas()->latest()->first();

        return Inertia::render('pangkat/usulan-pangkat/status', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $berkas,
        ]);
    }
}
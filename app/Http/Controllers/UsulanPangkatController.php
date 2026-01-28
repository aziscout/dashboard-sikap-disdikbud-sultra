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
        $today = Carbon::today();

        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->get();

        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;

            if (!$tmt) {
                return false;
            }

            $tmtKenaikan = Carbon::parse($tmt)->addYears(4);

            $duaBulanSebelum = $tmtKenaikan->copy()->subMonths(2);

            $isEligibleByDate = $today->greaterThanOrEqualTo($duaBulanSebelum);

            $berkas = $item->berkas->first();

            $belumNaikPangkat = !$berkas || $berkas->status !== 'sk telah terbit';

            return $isEligibleByDate && $belumNaikPangkat;
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

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:berkas terkirim,telah dikirim ke bkd,telah dikirim ke bkn,sk telah terbit',
            'file_sk' => 'nullable|mimes:pdf|max:5120',
        ]);

        $berkas = Berkas::where('pegawais_id', $id)->first();

        if (!$berkas) {
            return redirect()->back()->with('message', 'Data berkas tidak ditemukan.')->with('error', true);
        }

        $statusOrder = [
            'berkas terkirim',
            'telah dikirim ke bkd',
            'telah dikirim ke bkn',
            'sk telah terbit',
        ];

        $currentIndex = array_search($berkas->status, $statusOrder);
        $newIndex = array_search($request->status, $statusOrder);

        // Cegah loncat status
        if ($newIndex !== $currentIndex + 1 && $newIndex !== $currentIndex) {
            return redirect()->back()
                ->with('message', 'Status hanya bisa diubah secara berurutan.')
                ->with('error', true);
        }

        // === CASE 1: Status biasa (tanpa upload file SK) ===
        if ($request->status !== 'sk telah terbit') {
            $berkas->status = $request->status;
            $berkas->save();

            return redirect()->back()
                ->with('message', 'Status berhasil diperbarui.')
                ->with('error', false);
        }

        // === CASE 2: Status "SK telah terbit" ===
        if ($request->status === 'sk telah terbit') {
            // File SK wajib untuk status ini
            if (!$request->hasFile('file_sk')) {
                return redirect()->back()
                    ->with('message', 'File SK wajib diunggah untuk status SK telah terbit.')
                    ->with('error', true);
            }

            $existingFiles = $berkas->file_sk ?? [];

            $file = $request->file('file_sk');

            $path = $file->store('berkas/file_sk', 'public');

            $existingFiles[] = [
                'file' => $path,
                'created_at' => Carbon::now()->format('d/m/Y'),
            ];

            $berkas->status = 'sk telah terbit';
            $berkas->file_sk = $existingFiles;
            $berkas->save();


            $dataDiri = DataDiri::where('pegawais_id', $id)->first();
            if ($dataDiri) {
                $urutanGolongan = [
                    'I/a', 'I/b', 'I/c', 'I/d',
                    'II/a', 'II/b', 'II/c', 'II/d',
                    'III/a', 'III/b', 'III/c', 'III/d',
                    'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e',
                ];

                $current = strtoupper(trim($dataDiri->golongan_ruang));
                $currentIndex = array_search($current, array_map('strtoupper', $urutanGolongan));

                if ($currentIndex !== false && isset($urutanGolongan[$currentIndex + 1])) {
                    $nextGolongan = $urutanGolongan[$currentIndex + 1];
                    $dataDiri->golongan_ruang = $nextGolongan;
                }

                $today = now();
                $dataDiri->tanggal_sk = $today->toDateString();

                $dataDiri->tmt_golongan = $today->toDateString();

                $dataDiri->save();
            }

            return redirect()->route('pangkat.usulan-pangkat.status', $id)
                ->with('message', 'File SK berhasil diunggah dan data pangkat diperbarui.')
                ->with('error', false);
        }
    }
}

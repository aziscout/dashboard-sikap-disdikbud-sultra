<?php

namespace App\Http\Controllers\Pangkat;

use App\Http\Controllers\Controller;
use App\Models\DataDiri;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPegawai = Pegawai::count();
        $tahunSekarang = Carbon::now()->year;

        // Ambil pegawai dengan TMT golongan tahun ini,
        // dan tidak memiliki berkas dengan status 'sk telah terbit'
        $pegawaiNaikPangkat = DataDiri::with(['pegawai.berkas'])
            ->whereYear('tmt_golongan', $tahunSekarang)
            ->whereHas('pegawai', function ($query) {
                $query->whereDoesntHave('berkas', function ($subQuery) {
                    $subQuery->where('status', 'sk telah terbit');
                });
            })
            ->inRandomOrder()
            ->take(10)
            ->get();

        $totalNaikPangkat = DataDiri::whereYear('tmt_golongan', $tahunSekarang)
            ->whereHas('pegawai', function ($query) {
                $query->whereDoesntHave('berkas', function ($subQuery) {
                    $subQuery->where('status', 'sk telah terbit');
                });
            })
            ->count();

        $totalSudahNaikPangkat = DataDiri::whereHas('pegawai.berkas', function ($query) use ($tahunSekarang) {
            $query->where('status', 'sk telah terbit')
                ->whereYear('updated_at', $tahunSekarang);
            })->count();


        return Inertia::render('pangkat/dashboard/index', [
            'totalPegawai' => $totalPegawai,
            'totalNaikPangkat' => $totalNaikPangkat,
            'totalSudahNaikPangkat' => $totalSudahNaikPangkat,
            'pegawaiNaikPangkat' => $pegawaiNaikPangkat->map(function ($item) {
                $currentGolongan = $item->golongan_ruang ?? '-';
                $nextGolongan = $this->getNextGolongan($currentGolongan);

                return [
                    'nama' => $item->pegawai->nama ?? '-',
                    'golongan_ruang' => "{$currentGolongan} → {$nextGolongan}",
                    'jenis_kelamin' => $item->pegawai->jenis_kelamin ?? '-',
                    'alamat' => $item->pegawai->alamat ?? '-',
                    'tmt_golongan' => $item->tmt_golongan
                        ? Carbon::parse($item->tmt_golongan)->format('d/m/Y')
                        : '-',
                ];
            }),
        ]);
    }

    /**
     * Menentukan golongan berikutnya berdasarkan urutan resmi.
     */
    private function getNextGolongan($current)
    {
        $urutanGolongan = [
            'I/A', 'I/B', 'I/C', 'I/D',
            'II/A', 'II/B', 'II/C', 'II/D',
            'III/A', 'III/B', 'III/C', 'III/D',
            'IV/A', 'IV/B', 'IV/C', 'IV/D', 'IV/E',
        ];

        $current = strtoupper(trim($current)); // normalisasi input
        $currentIndex = array_search($current, array_map('strtoupper', $urutanGolongan));

        // Jika ditemukan dan masih ada tingkat berikutnya
        if ($currentIndex !== false && isset($urutanGolongan[$currentIndex + 1])) {
            return $urutanGolongan[$currentIndex + 1];
        }

        // Jika sudah tertinggi atau tidak ditemukan
        return $current;
    }
}

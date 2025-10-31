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

        return Inertia::render('pangkat/dashboard/index', [
            'totalPegawai' => $totalPegawai,
            'totalNaikPangkat' => $totalNaikPangkat,
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
            'I/a', 'I/b', 'I/c', 'I/d',
            'II/a', 'II/b', 'II/c', 'II/d',
            'III/a', 'III/b', 'III/c', 'III/d',
            'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e',
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

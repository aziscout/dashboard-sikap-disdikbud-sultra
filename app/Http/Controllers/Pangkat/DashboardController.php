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
        $today = Carbon::now();

        // Ambil semua data pegawai dengan relasi
        $dataDiris = DataDiri::with(['pegawai.berkas'])->get();

        // --- 1️⃣ Hitung pegawai siap naik pangkat (>= 3 bulan sebelum 4 tahun dari TMT) ---
        $pegawaiSiapNaik = $dataDiris->filter(function ($item) use ($today) {
            if (!$item->tmt_golongan) return false;

            $tmt = Carbon::parse($item->tmt_golongan);
            $nextPromotion = $tmt->copy()->addYears(4);
            $threeMonthsBefore = $nextPromotion->copy()->subMonths(3);

            // Pegawai dianggap siap jika sudah masuk 3 bulan sebelum masa 4 tahun
            return $today->greaterThanOrEqualTo($threeMonthsBefore);
        });

        // --- 2️⃣ Hitung pegawai yang sudah SK terbit tahun berjalan ---
        $pegawaiSudahNaik = $dataDiris->filter(function ($item) use ($tahunSekarang) {
            return $item->pegawai &&
                $item->pegawai->berkas &&
                $item->pegawai->berkas->where('status', 'sk telah terbit')
                    ->whereBetween('updated_at', [
                        Carbon::create($tahunSekarang, 1, 1),
                        Carbon::create($tahunSekarang, 12, 31)
                    ])->count() > 0;
        });

        // --- 3️⃣ Siapkan data tabel: hanya ambil maksimal 10 pegawai siap naik pangkat ---
        $pegawaiNaikPangkat = $pegawaiSiapNaik->take(10)->map(function ($item) {
            $currentGolongan = $item->golongan_ruang ?? '-';
            $nextGolongan = $this->getNextGolongan($currentGolongan);

            $tmt = $item->tmt_golongan ? Carbon::parse($item->tmt_golongan) : null;
            $nextPromotion = $tmt ? $tmt->copy()->addYears(4) : null;
            $threeMonthsBefore = $nextPromotion ? $nextPromotion->copy()->subMonths(3) : null;

            return [
                'nama' => $item->pegawai->nama ?? '-',
                'golongan_ruang' => "{$currentGolongan} → {$nextGolongan}",
                'jenis_kelamin' => $item->pegawai->jenis_kelamin ?? '-',
                'alamat' => $item->pegawai->alamat ?? '-',
                'tmt_golongan' => $tmt ? $tmt->format('d/m/Y') : '-',
                'nomor' => $item->pegawai->nomor ?? '-',
                'tanggal_siap' => $threeMonthsBefore ? $threeMonthsBefore->format('d/m/Y') : '-',
            ];
        })->values(); // values() agar index-nya rapi

        // --- 4️⃣ Kirim data ke Inertia ---
        return Inertia::render('pangkat/dashboard/index', [
            'totalPegawai' => $totalPegawai,
            'totalNaikPangkat' => $pegawaiSiapNaik->count(),
            'totalSudahNaikPangkat' => $pegawaiSudahNaik->count(),
            'pegawaiNaikPangkat' => $pegawaiNaikPangkat,
        ]);
    }

    private function getNextGolongan($current)
    {
        $urutanGolongan = [
            'I/A', 'I/B', 'I/C', 'I/D',
            'II/A', 'II/B', 'II/C', 'II/D',
            'III/A', 'III/B', 'III/C', 'III/D',
            'IV/A', 'IV/B', 'IV/C', 'IV/D', 'IV/E',
        ];

        $current = strtoupper(trim($current));
        $currentIndex = array_search($current, array_map('strtoupper', $urutanGolongan));

        if ($currentIndex !== false && isset($urutanGolongan[$currentIndex + 1])) {
            return $urutanGolongan[$currentIndex + 1];
        }

        return $current;
    }
}

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
    private function isValidDate($date)
    {
        return !empty($date)
            && $date !== '-'
            && Carbon::hasFormat($date, 'Y-m-d');
    }

    public function index()
    {
        Carbon::setLocale('id');
        
        $totalPegawai = Pegawai::count();
        // $tahunSekarang = Carbon::now()->year;
        $today = Carbon::now();

        // Ambil semua data pegawai dengan relasi
        $dataDiris = DataDiri::with(['pegawai.berkas'])->get();

        $dataDiris = $dataDiris->filter(function ($item) use ($today) {
            if (
                !$this->isValidDate($item->tmt_golongan) ||
                !$this->isValidDate($item->kgb_terakhir)
            ) {
                return true; // tetap tampilkan jika salah satu tanggal tidak valid
            }

            $tmt = Carbon::createFromFormat('Y-m-d', $item->tmt_golongan);
            $fourYearsOneDay = $tmt->copy()->addYears(4)->addDay();
            $condition1 = $today->isSameDay($fourYearsOneDay);

            $kgb = Carbon::createFromFormat('Y-m-d', $item->kgb_terakhir);
            $twoYearsOneDay = $kgb->copy()->addYears(2)->addDay();
            $condition2 = $today->isSameDay($twoYearsOneDay);

            return !($condition1 && $condition2);
        });


        $pegawaiSiapNaik = $dataDiris->filter(function ($item) use ($today) {
            if (!$this->isValidDate($item->tmt_golongan)) {
                return false;
            }

            $tmt = Carbon::createFromFormat('Y-m-d', $item->tmt_golongan);
            $target = $tmt->copy()->addYears(4);
            $duaBulanSebelum = $target->copy()->subMonths(2);

            return $today->between($duaBulanSebelum, $target);
        });


        // --- 2️⃣ Hitung pegawai siap naik gaji berkala (>= 2 bulan sebelum 2 tahun dari KGB terakhir) ---
        $pegawaiSiapNaikKgb = $dataDiris->filter(function ($item) use ($today) {
            if (!$this->isValidDate($item->kgb_terakhir)) {
                return false;
            }

            $kgb = Carbon::createFromFormat('Y-m-d', $item->kgb_terakhir);
            $target = $kgb->copy()->addYears(2);
            $duaBulanSebelum = $target->copy()->subMonths(2);

            return $today->between($duaBulanSebelum, $target);
        });


        // // --- 3️⃣ Hitung pegawai yang sudah SK terbit tahun berjalan ---
        // $pegawaiSudahNaik = $dataDiris->filter(function ($item) use ($tahunSekarang) {
        //     return $item->pegawai &&
        //         $item->pegawai->berkas &&
        //         $item->pegawai->berkas->where('status', 'sk telah terbit')
        //             ->whereBetween('updated_at', [
        //                 Carbon::create($tahunSekarang, 1, 1),
        //                 Carbon::create($tahunSekarang, 12, 31)
        //             ])->count() > 0;
        // });

        // --- 3️⃣ Siapkan data tabel pangkat: 10 random pegawai siap naik pangkat ---
        $pegawaiNaikPangkat = $pegawaiSiapNaik->shuffle()->take(10)->map(function ($item) {
            $tmt = $item->tmt_golongan ? Carbon::parse($item->tmt_golongan) : null;

            return [
                'nama' => $item->pegawai->nama ?? '-',
                'nip' => $item->pegawai->nip ?? '-',
                'unit_kerja' => $item->pegawai->unit_kerja ?? '-',
                'tmt_golongan' => $tmt ? $tmt->translatedFormat('d-m-Y') : '-',
            ];
        })->values();

        // --- 4️⃣ Siapkan data tabel KGB: 10 random pegawai siap naik gaji berkala ---
        $pegawaiNaikKgb = $pegawaiSiapNaikKgb->shuffle()->take(10)->map(function ($item) {
            $kgb = $item->kgb_terakhir ? Carbon::parse($item->kgb_terakhir) : null;

            return [
                'nama' => $item->pegawai->nama ?? '-',
                'nip' => $item->pegawai->nip ?? '-',
                'unit_kerja' => $item->pegawai->unit_kerja ?? '-',
                'kgb_terakhir' => $kgb ? $kgb->translatedFormat('d-m-Y') : '-',
            ];
        })->values();

        // --- 4️⃣ Kirim data ke Inertia ---
        return Inertia::render('pangkat/dashboard/index', [
            'totalPegawai' => $totalPegawai,
            'totalNaikPangkat' => $pegawaiSiapNaik->count(),
            'totalSiapNaikKgb' => $pegawaiSiapNaikKgb->count(),
            'pegawaiNaikPangkat' => $pegawaiNaikPangkat,
            'pegawaiNaikKgb' => $pegawaiNaikKgb,
        ]);
    }

    private function getNextGolongan($current)
    {
        $urutanGolongan = [
            'I/a', 'I/b', 'I/c', 'I/d',
            'II/a', 'II/b', 'II/c', 'II/d',
            'III/a', 'III/b', 'III/c', 'III/d',
            'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e',
        ];

        $current = strtoupper(trim($current));
        $currentIndex = array_search($current, array_map('strtoupper', $urutanGolongan));

        if ($currentIndex !== false && isset($urutanGolongan[$currentIndex + 1])) {
            return $urutanGolongan[$currentIndex + 1];
        }

        return $current;
    }
}

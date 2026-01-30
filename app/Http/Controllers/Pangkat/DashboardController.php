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
        Carbon::setLocale('id');
        
        $totalPegawai = Pegawai::count();
        // $tahunSekarang = Carbon::now()->year;
        $today = Carbon::now();

        // Ambil semua data pegawai dengan relasi
        $dataDiris = DataDiri::with(['pegawai.berkas'])->get();

        // --- 1️⃣ Hitung pegawai siap naik pangkat (>= 3 bulan sebelum 4 tahun dari TMT) ---
        $pegawaiSiapNaik = $dataDiris->filter(function ($item) use ($today) {
            if (!$item->tmt_golongan) return false;

            $tmt = Carbon::parse($item->tmt_golongan);
            $nextPromotion = $tmt->copy()->addYears(4);
            $twoMonthsBefore = $nextPromotion->copy()->subMonths(2);

            // Pegawai dianggap siap jika sudah masuk 2 bulan sebelum masa 4 tahun
            return $today->greaterThanOrEqualTo($twoMonthsBefore);
        });

        // --- 2️⃣ Hitung pegawai siap naik gaji berkala (>= 2 bulan sebelum 2 tahun dari KGB terakhir) ---
        $pegawaiSiapNaikKgb = $dataDiris->filter(function ($item) use ($today) {
            if (!$item->kgb_terakhir) return false;

            $kgb = Carbon::parse($item->kgb_terakhir);
            $nextKgb = $kgb->copy()->addYears(2);
            $twoMonthsBefore = $nextKgb->copy()->subMonths(2);

            // Pegawai dianggap siap jika sudah masuk 2 bulan sebelum masa 2 tahun
            return $today->greaterThanOrEqualTo($twoMonthsBefore);
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
                'tmt_golongan' => $tmt ? $tmt->translatedFormat('d F Y') : '-',
            ];
        })->values();

        // --- 4️⃣ Siapkan data tabel KGB: 10 random pegawai siap naik gaji berkala ---
        $pegawaiNaikKgb = $pegawaiSiapNaikKgb->shuffle()->take(10)->map(function ($item) {
            $kgb = $item->kgb_terakhir ? Carbon::parse($item->kgb_terakhir) : null;

            return [
                'nama' => $item->pegawai->nama ?? '-',
                'nip' => $item->pegawai->nip ?? '-',
                'unit_kerja' => $item->pegawai->unit_kerja ?? '-',
                'kgb_terakhir' => $kgb ? $kgb->translatedFormat('d F Y') : '-',
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

<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    public function index()
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])
            ->select('id', 'nama', 'nomor', 'email', 'jenis_kelamin', 'alamat', 'created_at')
            // ->get();
            ->paginate(20);

        $pegawai->transform(function ($item) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;
            $status = 'Belum Siap';
            $isActive = false;

            if ($tmt) {
                // 1️⃣ Konversi TMT ke Carbon
                $tmtDate = Carbon::parse($tmt);

                // 2️⃣ Tambahkan 4 tahun dari TMT
                $nextPromotionDate = $tmtDate->copy()->addYears(4);

                // 3️⃣ Hitung 3 bulan sebelum tanggal kenaikan pangkat berikutnya
                $threeMonthsBefore = $nextPromotionDate->copy()->subMonths(3);

                // 4️⃣ Jika tanggal saat ini >= tiga bulan sebelum, maka Siap
                if (Carbon::now()->greaterThanOrEqualTo($threeMonthsBefore)) {
                    $status = 'Siap';
                }
            }

            // 5️⃣ Pastikan berkas juga sudah lengkap
            $hasBerkas = $item->berkas && $item->berkas->count() > 0;

            // 6️⃣ Aktif jika status siap dan berkas lengkap
            $isActive = $status === 'Siap' && $hasBerkas;

            // 7️⃣ Format data untuk dikirim ke frontend
            $item->status = $status;
            $item->tmt_golongan = $tmt ? Carbon::parse($tmt)->format('d/m/Y') : '-';
            $item->is_active = $isActive;

            return $item;
        });

        return Inertia::render('pangkat/pegawai/index', [
            'pegawai' => $pegawai,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    public function show($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/pegawai/show', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    public function status($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.pegawai')->with('message', 'Data pegawai tidak ditemukan.');
        }

        return Inertia::render('pangkat/pegawai/status', [
            'pegawai' => $pegawai,
            'data_diri' => $pegawai->dataDiri,
            'berkas' => $pegawai->berkas,
        ]);
    }
}

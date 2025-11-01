<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
use App\Models\DataDiri;
use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UsulanPangkatController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Ambil semua pegawai dengan relasi data diri dan berkas
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->get();

        // Filter pegawai yang:
        // 1. Sudah mendekati TMT (3 bulan sebelum)
        // 2. Sudah melengkapi seluruh berkas
        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;

            if (!$tmt) {
                return false; // jika belum punya TMT, skip
            }

            $tmtDate = Carbon::parse($tmt);
            $threeMonthsBefore = $tmtDate->copy()->subMonths(3);

            // kondisi 1: waktu sekarang sudah melewati 3 bulan sebelum TMT
            $isEligibleByDate = $today->greaterThanOrEqualTo($threeMonthsBefore);

            // kondisi 2: cek berkas lengkap
            $berkas = $item->berkas->first(); // ambil baris pertama (karena biasanya 1 pegawai = 1 kumpulan berkas)
            $isBerkasComplete = $berkas &&
                $berkas->sk_cpns &&
                $berkas->sk_pns &&
                $berkas->sk_gaji_berkala &&
                $berkas->sk_jabatan &&
                $berkas->sk_pangkat_terakhir;

            // return true jika dua-duanya terpenuhi
            return $isEligibleByDate && $isBerkasComplete;
        })->values();

        return Inertia::render('pangkat/usulanPangkat/index', [
            'pegawai' => $filteredPegawai,
        ]);
    }

    public function status($id)
    {
        $pegawai = Pegawai::with(['dataDiri', 'berkas'])->find($id);

        if (!$pegawai) {
            return redirect()->route('pangkat.usulanPangkat')
                ->with('message', 'Data pegawai tidak ditemukan.');
        }

        // Ambil 1 berkas terbaru
        $berkas = $pegawai->berkas()->latest()->first();

        return Inertia::render('pangkat/usulanPangkat/status', [
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

            // Hapus file lama jika ada
            if ($berkas->file_sk && Storage::disk('public')->exists('berkas/' . $berkas->file_sk)) {
                Storage::disk('public')->delete('berkas/' . $berkas->file_sk);
            }

            // Simpan file baru
            $file = $request->file('file_sk');
            $filename = 'sk_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('berkas', $filename, 'public');

            // Update status + file bersamaan
            $berkas->status = 'sk telah terbit';
            $berkas->file_sk = $filename;
            $berkas->save();

            // 🟩 Otomatis naikkan golongan pegawai 1 tingkat
            $dataDiri = DataDiri::where('pegawais_id', $id)->first();
            if ($dataDiri) {
                $urutanGolongan = [
                    'I/A', 'I/B', 'I/C', 'I/D',
                    'II/A', 'II/B', 'II/C', 'II/D',
                    'III/A', 'III/B', 'III/C', 'III/D',
                    'IV/A', 'IV/B', 'IV/C', 'IV/D', 'IV/E',
                ];

                $current = strtoupper(trim($dataDiri->golongan_ruang));
                $currentIndex = array_search($current, array_map('strtoupper', $urutanGolongan));

                if ($currentIndex !== false && isset($urutanGolongan[$currentIndex + 1])) {
                    $nextGolongan = $urutanGolongan[$currentIndex + 1];
                    $dataDiri->golongan_ruang = $nextGolongan;
                }

                // 📅 Tanggal SK = hari ini
                $today = now();
                $dataDiri->tanggal_sk = $today->toDateString();

                // ⏩ TMT golongan = 4 tahun setelah SK terbit
                $dataDiri->tmt_golongan = $today->copy()->addYears(4)->toDateString();

                $dataDiri->save();
            }

            return redirect()->route('pangkat.usulanPangkat.status', $id)
                ->with('message', 'File SK berhasil diunggah.')
                ->with('error', false);
        }

    }
}

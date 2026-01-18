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

        // Filter pegawai yang:
        // 1. Sudah mendekati TMT (3 bulan sebelum)
        // 2. Sudah melengkapi seluruh berkas
        // 3. Belum naik pangkat (status belum 'sk telah terbit')
        $filteredPegawai = $pegawai->filter(function ($item) use ($today) {
            $tmt = $item->dataDiri->tmt_golongan ?? null;

            if (!$tmt) {
                return false; // jika belum punya TMT, skip
            }

            // Tambahkan 4 tahun untuk mencari TMT Kenaikan Pangkat berikutnya
            $tmtDate = Carbon::parse($tmt)->addYears(4);
            $threeMonthsBefore = $tmtDate->copy()->subMonths(3);

            // Kondisi 1: waktu sekarang sudah melewati 3 bulan sebelum TMT
            $isEligibleByDate = $today->greaterThanOrEqualTo($threeMonthsBefore);

            // Kondisi 2: cek berkas lengkap (ambil berkas terbaru/pertama)
            $berkas = $item->berkas->first();
            $isBerkasComplete = $berkas &&
                $berkas->sk_cpns &&
                $berkas->sk_pns &&
                $berkas->sk_gaji_berkala &&
                $berkas->sk_jabatan &&
                $berkas->sk_pangkat_terakhir;

            // 🚫 Kondisi 3: pastikan belum punya status SK telah terbit
            $belumNaikPangkat = !$berkas || $berkas->status !== 'sk telah terbit';

            return $isEligibleByDate && $isBerkasComplete && $belumNaikPangkat;
        })->values(); 

        $perPage = 20;
        $currentPage = $request->get('page', 1);
        $offset = ($currentPage * $perPage) - $perPage;

        $items = $filteredPegawai->slice($offset, $perPage)->all();

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

        // Ambil 1 berkas terbaru
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

                // 📅 Tanggal SK = hari ini
                $today = now();
                $dataDiri->tanggal_sk = $today->toDateString();

                // ✅ TMT golongan = tanggal SK diterbitkan (bukan +4 tahun)
                $dataDiri->tmt_golongan = $today->toDateString();

                $dataDiri->save();
            }

            return redirect()->route('pangkat.usulan-pangkat.status', $id)
                ->with('message', 'File SK berhasil diunggah dan data pangkat diperbarui.')
                ->with('error', false);
        }
    }
}

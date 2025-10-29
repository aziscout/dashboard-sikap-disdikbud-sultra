<?php

namespace App\Http\Controllers;

use App\Models\Berkas;
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
            'berkas' => $berkas, // ✅ bukan collection lagi
        ]);
    }

    
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:berkas terkirim,telah dikirim ke bkd,telah dikirim ke bkn,sk telah terbit',
        'file_sk' => 'nullable|mimes:pdf|max:2048',
    ]);

    $berkas = Berkas::where('pegawais_id', $id)->first();

    if (!$berkas) {
        return redirect()->back()->with('message', 'Data berkas tidak ditemukan.');
    }

    $statusOrder = [
        'berkas terkirim',
        'telah dikirim ke bkd',
        'telah dikirim ke bkn',
        'sk telah terbit',
    ];

    $currentIndex = array_search($berkas->status, $statusOrder);
    $newIndex = array_search($request->status, $statusOrder);

    // ✅ Batasi perubahan status agar berurutan
    if ($newIndex !== $currentIndex + 1 && $newIndex !== $currentIndex) {
        return redirect()->back()
            ->with('message', 'Status hanya bisa diubah secara berurutan.')
            ->with('error', true);
    }

    $berkas->status = $request->status;

    if ($request->status === 'sk telah terbit') {
        if ($request->hasFile('file_sk')) {
            // Hapus file lama jika ada
            if ($berkas->file_sk && Storage::disk('public')->exists('berkas/' . $berkas->file_sk)) {
                Storage::disk('public')->delete('berkas/' . $berkas->file_sk);
            }

            // Simpan file baru ke storage/app/public/berkas
            $file = $request->file('file_sk');
            $filename = 'sk_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('berkas', $filename, 'public');

            // Simpan nama file di database
            $berkas->file_sk = $filename;
        } else {
            return redirect()->back()->with('message', 'File SK wajib diunggah untuk status ini.');
        }
    }

    $berkas->save();

    return redirect()->route('pangkat.usulanPangkat.status', $id)
        ->with('message', 'Status dan file SK berhasil diperbarui.')
        ->with('error', false);
}

}

<?php

namespace App\Http\Controllers;

use App\Mail\LayananReceived;
use App\Models\Document;
use App\Models\Layanan;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * Simpan layanan baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'          => 'required|string|max:255',
            'deskripsi'      => 'required|string',
            'bidang'         => 'required|string|max:255',
            'nama_pengirim'  => 'required|string|max:255',
            'email_pengirim' => 'required|email|max:255',

            // file media
            'files.*'        => 'nullable|mimes:jpg,jpeg,png,|max:50000',

            // file dokumen
            'dokumen'   => 'nullable|mimes:pdf|max:30000',
        ]);

        // Mapping bidang ke singkatan
        $mapBidang = [
            'bidang_sma'         => 'SMA',
            'bidang_smk'         => 'SMK',
            'bidang_pklk'        => 'PKLK',
            'bidang_gtk'         => 'GTK',
            'bidang_perencanaan' => 'PRC',
            'bidang_kebudayaan'  => 'KBD',
        ];

        $singkatanBidang = $mapBidang[$validated['bidang']] ?? 'UMUM';
        $tanggal = now()->format('Ymd');

        $jumlahHariIni = Layanan::where('bidang', $validated['bidang'])
            ->whereDate('created_at', now()->toDateString())
            ->count() + 1;

        $increment = str_pad($jumlahHariIni, 4, '0', STR_PAD_LEFT);
        $validated['kode_tracking'] = "{$singkatanBidang}{$tanggal}{$increment}";
        $validated['status'] = 'Diterima';

        DB::beginTransaction();
        try {
            // Upload media (foto/video file)
            $mediaFiles = [];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    if ($file->getSize() > 50000 * 1024) continue;
                    $path = $file->store('layanan/file', 'public');
                    $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                    $mediaFiles[] = ['file' => $path, 'type' => $type];
                }
            }

            if (count($mediaFiles) > 0) {
                $media = Media::create(['file' => $mediaFiles]);
                $validated['media_id'] = $media->id;
            } else {
                $validated['media_id'] = null;
            }

            // Upload dokumen
            if ($request->hasFile('dokumen')) {
                $docFile = $request->file('dokumen');
                if ($docFile->getSize() <= 30000 * 1024) {
                    $docPath = $docFile->store('layanan/documents', 'public');
                    $documents = Document::create(['dokumen' => $docPath]);
                    $validated['dokumens_id'] = $documents->id;
                } else {
                    Log::warning('Dokumen file terlalu besar untuk layanan submission.');
                    $validated['dokumens_id'] = null;
                }
            } else {
                $validated['dokumens_id'] = null;
            }

            unset($validated['dokumen']);

            // Simpan data layanan
            $layanan = Layanan::create($validated);

            // Kirim email konfirmasi
            if (!empty($layanan->email_pengirim)) {
                try {
                    Mail::to($layanan->email_pengirim)->send(new LayananReceived($layanan));
                } catch (\Exception $e) {
                    Log::error('Gagal mengirim email untuk layanan: ' . $layanan->kode_tracking . ' - ' . $e->getMessage());
                }
            }

            DB::commit();

            return response()->json([
                'message'       => 'Laporan berhasil dikirim',
                'kode_tracking' => $layanan->kode_tracking,
                'data'          => $layanan->load('media', 'dokumen'),
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Gagal menyimpan layanan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengirim laporan.'], 500);
        }
    }

    /**
     * Cek status layanan berdasarkan kode tracking.
     */
    public function status($kode_tracking)
    {
        $layanan = Layanan::where('kode_tracking', $kode_tracking)
            ->with('media', 'dokumen')
            ->first();

        if (!$layanan) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }

        return response()->json($layanan);
    }

    /**
     * List layanan untuk Inertia.
     */
    public function index()
    {
        $user = Auth::user();
        $layanans = Layanan::query();

        if ($user && $user->role === 'bidang') {
            $bidangFilter = $user->name ?? explode('@', $user->email)[0];
            $layanans->where('bidang', $bidangFilter);
        }

        $data = $layanans->with('media', 'dokumen')->latest()->get();

        return Inertia::render('layanan/index', [
            'layanans' => $data
        ]);
    }

    /**
     * Tampilkan detail layanan.
     */
    public function show($id)
    {
        $layanan = Layanan::with('media', 'dokumen')->findOrFail($id);

        return inertia('layanan/show', [
            'layanan' => $layanan,
        ]);
    }

    /**
     * Update layanan.
     */
    public function update(Request $request, $id)
    {
        $layanan = Layanan::findOrFail($id);

        $validated = $request->validate([
            'judul'         => 'sometimes|string|max:255',
            'deskripsi'     => 'sometimes|string',
            'bidang'        => 'sometimes|string|max:255',
            'status'        => 'sometimes|in:Diterima,Diproses,Selesai,Ditolak',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png|max:50000',
            'dokumen'  => 'nullable|mimes:pdf|max:30000',
        ]);

        $layanan->update($validated);

        return redirect()->back()->with('success', 'Data layanan berhasil diperbarui');
    }

    /**
     * Hapus layanan.
     */
    public function destroy($id)
    {
        $layanan = Layanan::with('media', 'dokumen')->findOrFail($id);

        // Hapus file media
        if ($layanan->media && is_array($layanan->media->file)) {
            foreach ($layanan->media->file as $m) {
                if (isset($m['file']) && !preg_match('/^https?:\/\//', $m['file'])) {
                    if (Storage::disk('public')->exists($m['file'])) {
                        Storage::disk('public')->delete($m['file']);
                    }
                }
            }
            $layanan->media->delete();
        }

        // Hapus file dokumen
        if ($layanan->dokumen) {
            $docPath = $layanan->dokumen->dokumen;
            if (Storage::disk('public')->exists($docPath)) {
                Storage::disk('public')->delete($docPath);
            }
            $layanan->dokumen->delete();
        }

        $layanan->delete();

        return redirect()->back()->with('success', 'Data layanan berhasil dihapus');
    }
}

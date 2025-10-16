<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\LayananReceived;
use App\Models\Layanan;
use App\Models\Media;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LayananApiController extends Controller
{
    /**
     * Simpan layanan (laporan) baru dari API.
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
        
        // Buat kode unik acak (6 karakter)
        $random = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        
        // Buat kode tracking: SMA20251015-1A2B3C
        $validated['kode_tracking'] = "{$singkatanBidang}{$tanggal}{$random}";
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
    $layanan = \App\Models\Layanan::where('kode_tracking', $kode_tracking)->first();

    if (!$layanan) {
        return response()->json([
            'message' => 'Laporan tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'kode_tracking' => $layanan->kode_tracking,
        'status'        => $layanan->status,
        'judul'         => $layanan->judul,
        'bidang'        => $layanan->bidang,
        'tanggal'       => $layanan->created_at->format('d-m-Y H:i'),
    ]);
}

}

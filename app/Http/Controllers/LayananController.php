<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Layanan;
use App\Models\Media;
use App\Models\Dokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\LayananReceived;

class LayananController extends Controller
{
    /**
     * Simpan layanan baru
     */
    

public function store(Request $request)
{
    // 1. Validasi input

    $validated = $request->validate([
        'judul'          => 'required|string|max:255',
        'deskripsi'      => 'required|string',
        'bidang'         => 'required|string|max:255',
        'nama_pengirim'  => 'required|string|max:255',
        'email_pengirim' => 'required|email|max:255',

        // upload file
        'files.*'        => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
        'document_file'  => 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000',

        // url video
        'video_urls'     => 'nullable|array',
        'video_urls.*'   => 'url',
    ]);

    // 2. Generate kode tracking unik
    $singkatanBidang = strtoupper(implode('', array_map(fn ($word) => $word[0], explode(' ', $validated['bidang']))));
    $tanggal = date('Ymd');
    $jumlahHariIni = Layanan::where('bidang', $validated['bidang'])
        ->whereDate('created_at', now()->toDateString())
        ->count() + 1;
    $increment = str_pad($jumlahHariIni, 4, '0', STR_PAD_LEFT);

    $validated['kode_tracking'] = "{$singkatanBidang}-{$tanggal}-{$increment}";
    $validated['status'] = 'Diterima';

    // 3. Simpan media (foto/video)
    $mediaFiles = [];

    if ($request->hasFile('files')) {
        foreach ($request->file('files') as $file) {
            $path = $file->store('layanan/file', 'public'); // simpan di storage/app/public
            $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
            $mediaFiles[] = ['file' => $path, 'type' => $type];
        }
    }

    // Tambahkan video dari URL
    if ($request->video_urls) {
        foreach ($request->video_urls as $url) {
            $mediaFiles[] = ['file' => $url, 'type' => 'video'];
        }
    }

    // Buat media record jika ada file/URL
    if (count($mediaFiles) > 0) {
        $media = Media::create([
            'file' => $mediaFiles,
        ]);
        $validated['media_id'] = $media->id;
    }

    // 4. Upload dokumen (pdf/docx dsb)
    if ($request->hasFile('document_file')) {
        $docPath = $request->file('document_file')->store('layanan/document', 'public');
        $document = Dokumen::create([
            'dokumen' => $docPath
        ]);
        $validated['document_id'] = $document->id;
    }

    // 5. Buat layanan baru
    $layanan = Layanan::create($validated);

    // 6. Kirim email ke pelapor (opsional)
    // if (!empty($layanan->email_pengirim)) {
    //     Mail::to($layanan->email_pengirim)
    //         ->send(new LayananReceived($layanan));
    // }

    // 7. Return response JSON
    return response()->json([
        'message'       => 'Laporan berhasil dikirim',
        'kode_tracking' => $layanan->kode_tracking,
        'data'          => $layanan->load('media','document'),
    ], 201);
}


    /**
     * Cek status layanan berdasarkan kode tracking
     */
    public function status($kode_tracking)
    {
        $layanan = Layanan::where('kode_tracking', $kode_tracking)
            ->with('media','document')
            ->first();

        if (!$layanan) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }

        return response()->json($layanan);
    }

    /**
     * List layanan untuk Inertia
     */
    public function index()
    {
        $user = Auth::user();
        $layanans = Layanan::query();

        if ($user && $user->role === 'bidang') {
            $layanans->where('bidang', $user->username ?? $user->name);
        }

        $data = $layanans->with('media','document')->latest()->get();

        return Inertia::render('layanan/index', [
            'layanans' => $data
        ]);
    }

    /**
     * Tampilkan detail layanan
     */
    public function show($id)
    {
        $layanan = Layanan::with('media','document')->findOrFail($id);

        return inertia('layanan/show', [
            'layanan' => $layanan,
        ]);
    }

    /**
     * Update layanan
     */
    public function update(Request $request, $id)
    {
        $layanan = Layanan::findOrFail($id);

        $validated = $request->validate([
            'judul'       => 'sometimes|string|max:255',
            'deskripsi'   => 'sometimes|string',
            'bidang'      => 'sometimes|string|max:255',
            'status'      => 'sometimes|in:Diterima,Diproses,Selesai,Ditolak',
            'files.*'     => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'document_file' => 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000',
        ]);

        // (optional) tambahkan logika update file media & dokumen di sini

        $layanan->update($validated);

        return redirect()->back()->with('success', 'Data layanan berhasil diperbarui');
    }

    /**
     * Hapus layanan
     */
    public function destroy($id)
    {
        $layanan = Layanan::with('media','document')->findOrFail($id);

        // hapus file-file di storage
        if ($layanan->media && is_array($layanan->media->file)) {
            foreach ($layanan->media->file as $m) {
                // hanya hapus file lokal, bukan URL
                if (isset($m['file']) && !preg_match('/^https?:\/\//', $m['file'])) {
                    if (Storage::disk('public')->exists($m['file'])) {
                        Storage::disk('public')->delete($m['file']);
                    }
                }
            }
            $layanan->media->delete();
        }

        if ($layanan->document && Storage::disk('public')->exists($layanan->document->file)) {
            Storage::disk('public')->delete($layanan->document->file);
            $layanan->document->delete();
        }

        $layanan->delete();

        return redirect()->back()->with('success', 'Data layanan berhasil dihapus');
    }
}
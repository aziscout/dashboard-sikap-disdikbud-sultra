<?php

namespace App\Http\Controllers;

use App\Mail\LayananReceived;
use App\Models\Document; 
use App\Models\Layanan;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; 
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * Simpan layanan baru (Memperbaiki logika kode_tracking)
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
            'documents_file'  => 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000', // Diubah: documents_file

            // url video
            'video_urls'     => 'nullable|array',
            'video_urls.*'   => 'nullable|url',
        ]);

        // 2. Generate kode tracking unik
        
        // Menentukan singkatan berdasarkan nilai bidang (misal: bidang_smk -> SMK)
        // Ini mengatasi masalah unique constraint yang sebelumnya muncul.
        switch ($validated['bidang']) {
            case 'bidang_sma':
                $singkatanBidang = 'SMA';
                break;
            case 'bidang_smk':
                $singkatanBidang = 'SMK';
                break;
            case 'bidang_pklk':
                $singkatanBidang = 'PKLK';
                break;
            case 'bidang_gtk':
                $singkatanBidang = 'GTK';
                break;
            case 'bidang_perencanaan':
                $singkatanBidang = 'PRC';
                break;
            case 'bidang_kebudayaan':
                $singkatanBidang = 'KBD';
                break;
            default:
                $singkatanBidang = 'UMUM';
                break;
        }

        $tanggal = date('Ymd');
        
        // Menghitung jumlah layanan hari ini HANYA untuk bidang ini
        $jumlahHariIni = Layanan::where('bidang', $validated['bidang'])
            ->whereDate('created_at', now()->toDateString())
            ->count() + 1;
            
        $increment = str_pad($jumlahHariIni, 4, '0', STR_PAD_LEFT);

        // Contoh kode_tracking: SMK-20251008-0001
        $validated['kode_tracking'] = "{$singkatanBidang}-{$tanggal}-{$increment}";
        $validated['status'] = 'Diterima';

        // 3. Simpan media (foto/video)
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Tambahkan pengecekan ukuran file di sisi server jika validasi kurang ketat
                if ($file->getSize() > 50000 * 1024) continue; // max 50MB
                
                $path = $file->store('layanan/file', 'public'); // simpan di storage/app/public
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        // Tambahkan video dari URL
        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                // Pastikan URL tidak kosong
                if (!empty($url)) {
                    $mediaFiles[] = ['file' => $url, 'type' => 'video'];
                }
            }
        }

        // Buat media record jika ada file/URL
        if (count($mediaFiles) > 0) {
            $media = Media::create([
                'file' => $mediaFiles,
            ]);
            $validated['media_id'] = $media->id;
        } else {
            // Pastikan media_id disetel null jika tidak ada file/url (sesuai skema DB)
            $validated['media_id'] = null; 
        }

        // 4. Upload dokumen (pdf/docx dsb)
        if ($request->hasFile('documents_file')) { // Diubah: documents_file
            $docFile = $request->file('documents_file'); // Diubah: documents_file
            
            // Tambahkan pengecekan ukuran file di sisi server jika validasi kurang ketat
            if ($docFile->getSize() <= 30000 * 1024) { // max 30MB
                $docPath = $docFile->store('layanan/documents', 'public'); // Diubah: layanan/documents
                $documents = Document::create([ // KOREKSI: Menggunakan Document::create
                    'file' => $docPath
                ]);
                $validated['documents_id'] = $documents->id; // Diubah: documents_id
            } else {
                // Jika file terlalu besar, Anda bisa melempar exception atau skip
                Log::warning('documents file too large for layanan submission.'); // Diubah: documents
                $validated['documents_id'] = null; // Diubah: documents_id
            }
        } else {
            // Pastikan documents_id disetel null jika tidak ada dokumen
            $validated['documents_id'] = null; // Diubah: documents_id
        }

        // 5. Buat layanan baru
        $layanan = Layanan::create($validated);

        // 6. Kirim email ke pelapor (opsional)
        if (!empty($layanan->email_pengirim)) {
            // Pastikan LayananReceived Mailable class sudah dibuat
            try {
                 Mail::to($layanan->email_pengirim)
                    ->send(new LayananReceived($layanan));
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email untuk layanan: ' . $layanan->kode_tracking . ' Error: ' . $e->getMessage());
            }
        }

        // 7. Return response JSON
        return response()->json([
            'message'       => 'Laporan berhasil dikirim',
            'kode_tracking' => $layanan->kode_tracking,
            'data'          => $layanan->load('media','documents'), // Diubah: documents
        ], 201);
    }


    /**
     * Cek status layanan berdasarkan kode tracking
     */
    public function status($kode_tracking)
    {
        $layanan = Layanan::where('kode_tracking', $kode_tracking)
            ->with('media','documents') // Diubah: documents
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

        // Asumsi nama user bidang sama dengan nilai kolom 'bidang' di tabel layanans (e.g. 'bidang_smk')
        if ($user && $user->role === 'bidang') {
             // Menggunakan $user->email sebagai fallback jika $user->name atau $user->username tidak sesuai
             // Jika $user->name/username tidak ada, Anda mungkin perlu mengubahnya menjadi 'bidang_smk' dari $user->email
             // Di sini diasumsikan $user->name atau $user->email adalah string yang sama dengan nilai kolom 'bidang'
            $bidangFilter = $user->name ?? explode('@', $user->email)[0];
            $layanans->where('bidang', $bidangFilter);
        }

        // Jika Anda ingin mengizinkan admin melihat semua, tidak perlu filter
        // Jika hanya bidang yang login, filter sudah diterapkan di atas
        
        $data = $layanans->with('media','documents')->latest()->get(); // Diubah: documents

        return Inertia::render('layanan/index', [
            'layanans' => $data
        ]);
    }

    /**
     * Tampilkan detail layanan
     */
    public function show($id)
    {
        $layanan = Layanan::with('media','documents')->findOrFail($id); // Diubah: documents

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
            // File update logic should handle replacement/addition to existing media/documentss, 
            // but for simplicity, the validation remains for new uploads if implemented.
            'files.*'     => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'documents_file' => 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:30000', // Diubah: documents_file
        ]);

        // (optional) tambahkan logika update file media & dokumen di sini
        // Logika update file bisa lebih kompleks, melibatkan penghapusan file lama jika diganti.
        // Catatan: Jika Anda ingin mengupdate dokumen, Anda harus menambahkan logika di sini untuk menghapus dokumen lama dan membuat record dokumen baru.

        if ($layanan->isDirty('documents_id')) {
            // Jika Anda mengizinkan perubahan 'documents_id' di update, Anda perlu logika khusus di sini.
        }

        $layanan->update($validated);

        return redirect()->back()->with('success', 'Data layanan berhasil diperbarui');
    }

    /**
     * Hapus layanan
     */
    public function destroy($id)
    {
        $layanan = Layanan::with('media','documents')->findOrFail($id); // Diubah: documents

        // Hapus media files di storage
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

        // Hapus dokumen file di storage
        // Perhatikan bahwa kolom 'file' di documentss adalah string, bukan JSON
        if ($layanan->documents) { // Diubah: documents
            $docPath = $layanan->documents->file; // Diubah: documents
            if (Storage::disk('public')->exists($docPath)) {
                Storage::disk('public')->delete($docPath);
            }
            $layanan->documents->delete(); // Diubah: documents
        }

        $layanan->delete();

        return redirect()->back()->with('success', 'Data layanan berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $laporan = Laporan::latest()->get();
        } else {
            $laporan = Laporan::where('bidangs_id', $user->id)->latest()->get();
        }

        return Inertia::render("laporan/index", compact("laporan"));
    }

    public function create()
    {
        return Inertia::render("laporan/create", []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
            'lokasi'        => 'required|string|max:255',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'deskripsi'     => 'required|string|max:1000',
            'peserta'       => 'required|numeric|max:255',
            'dokumen'       => 'nullable|mimes:pdf|max:20240',
        ]);

        $dokumenId = null;

        if ($request->hasFile('dokumen')) {
            $path = $request->file('dokumen')->store('laporan-kegiatan', 'public');

            $dokumen = Dokumen::create([
                'dokumen' => $path,
            ]);

            $dokumenId = $dokumen->id;
        }

        // Save laporan kegiatan
        Laporan::create([
            'dokumens_id'     => $dokumenId,
            'judul'         => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'deskripsi'     => $request->deskripsi,
            'peserta'    => $request->peserta,
            'tabel'    => 'laporan',
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('laporan.index')
            ->with('message', 'Laporan kegiatan berhasil ditambahkan');
    }

    public function edit($id)
    {
        $user = Auth::user();
        $laporan = Laporan::with('dokumens')->findOrFail($id);

        if ($user->role !== 'admin' && $laporan->bidangs_id !== $user->id) {
            abort(403, 'Unauthorized to edit this laporan kegiatan.');
        }

        return Inertia::render("laporan/edit", ['laporan' => $laporan]);
    }

    // public function update(Request $request, LaporanKegiatan $laporan_kegiatan)
    // {
    //     $user = Auth::user();

    //     if ($user->role !== 'admin' && $laporan_kegiatan->bidangs_id !== $user->id) {
    //         abort(403, 'Unauthorized to update this laporan kegiatan.');
    //     }

    //     $request->validate([
    //         'judul'        => 'required|string|max:255',
    //         'penyelenggara'=> 'required|string|max:255',
    //         'lokasi'       => 'required|string|max:255',
    //         'instansi'     => 'required|in:umum,sma,smk,slb',
    //         'deskripsi'    => 'required|string|max:1000',
    //         'coverImage'  => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
    //         'files.*'      => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
    //         'video_urls'   => 'nullable|array',
    //         'video_urls.*' => 'url',
    //         'deleted_files'=> 'nullable|array',
    //     ]);

    //     // Update cover
    //     if ($request->hasFile('coverImage')) {
    //         if ($laporan_kegiatan->cover_image && Storage::disk('public')->exists($laporan_kegiatan->cover_image)) {
    //             Storage::disk('public')->delete($laporan_kegiatan->cover_image);
    //         }
    //         $coverPath = $request->file('coverImage')->store('laporan-kegiatan/cover', 'public');
    //         $laporan_kegiatan->cover_image = $coverPath;
    //     }

    //     // Ambil media lama
    //     $oldMedia = $laporan_kegiatan->medias ? $laporan_kegiatan->medias->file : [];
    //     $mediaFiles = $oldMedia ?? [];

    //     // Hapus media yang dipilih user
    //     if ($request->deleted_files) {
    //         foreach ($request->deleted_files as $delFile) {
    //             if (!preg_match('/^https?:\/\//', $delFile) && Storage::disk('public')->exists($delFile)) {
    //                 Storage::disk('public')->delete($delFile);
    //             }
    //             $mediaFiles = array_filter($mediaFiles, function ($m) use ($delFile) {
    //                 return $m['file'] !== $delFile;
    //             });
    //         }
    //         $mediaFiles = array_values($mediaFiles);
    //     }

    //     // Tambah file baru (foto/video upload)
    //     if ($request->hasFile('files')) {
    //         foreach ($request->file('files') as $file) {
    //             $path = $file->store('laporan-kegiatan/file', 'public');
    //             $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
    //             $mediaFiles[] = ['file' => $path, 'type' => $type];
    //         }
    //     }

    //     $mediaFiles = array_filter($mediaFiles, function ($m) {
    //         return $m['type'] !== 'video' || !preg_match('/^https?:\/\//', $m['file']);
    //     });

    //     // Masukkan ulang link video dari request
    //     if ($request->video_urls) {
    //         foreach ($request->video_urls as $url) {
    //             $mediaFiles[] = ['file' => $url, 'type' => 'video'];
    //         }
    //     }

    //     // Simpan media
    //     if ($laporan_kegiatan->medias) {
    //         $laporan_kegiatan->medias->update(['file' => array_values($mediaFiles)]);
    //     } else {
    //         $laporan_kegiatan->medias()->create(['file' => array_values($mediaFiles)]);
    //     }

    //     $laporan_kegiatan->update([
    //         'judul'        => $request->judul,
    //         'penyelenggara'=> $request->penyelenggara,
    //         'lokasi'       => $request->lokasi,
    //         'instansi'     => $request->instansi,
    //         'deskripsi'    => $request->deskripsi,
    //     ]);

    //     return redirect()->route('laporan-kegiatan.index')
    //         ->with('message', 'Laporan kegiatan berhasil diperbarui');
    // }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $laporan = Laporan::findOrFail($id);

        if ($user->role !== 'admin' && $laporan->bidangs_id !== $user->id) {
            abort(403, 'Unauthorized to update this laporan kegiatan.');
        }

        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
            'lokasi'        => 'required|string|max:255',
            'instansi'      => 'required|in:Umum,SMA,SMK,SLB',
            'deskripsi'     => 'required|string|max:1000',
            'peserta'       => 'required|numeric|max:255',
            'dokumen'       => 'nullable|mimes:pdf|max:20240',
        ]);

        // update field biasa
        $laporan->judul = $request->judul;
        $laporan->deskripsi = $request->deskripsi;
        $laporan->penyelenggara = $request->penyelenggara;
        $laporan->instansi = $request->instansi;
        $laporan->lokasi = $request->lokasi;
        $laporan->peserta = $request->peserta;
        $laporan->save();

        // ambil dokumen lama (kalau ada)
        $dokumen = $laporan->dokumens()->first();

        if ($request->hasFile('dokumen')) {
            // hapus file lama dari storage
            if ($dokumen && Storage::disk('public')->exists($dokumen->dokumen)) {
                Storage::disk('public')->delete($dokumen->dokumen);
            }

            // simpan file baru
            $path = $request->file('dokumen')->store('laporan-kegiatan', 'public');

            if ($dokumen) {
                // update record lama
                $dokumen->update([
                    'dokumen' => $path,
                ]);
            } else {
                // bikin record baru
                $laporan->dokumens()->create([
                    'dokumen' => $path,
                ]);
            }
        }

        return redirect()->route('laporan.index')
            ->with('message', 'Laporan berhasil diperbarui');
    }

    public function destroy(Laporan $laporan)
    {
        if ($laporan->dokumens) {
            $dokumenPath = $laporan->dokumens->dokumen;

            if ($dokumenPath && Storage::disk('public')->exists($dokumenPath)) {
                Storage::disk('public')->delete($dokumenPath);
            }

            $laporan->dokumens()->delete();
        }

        $laporan->delete();

        return redirect()->route('laporan.index')
            ->with('message', 'Laporan kegiatan berhasil dihapus');
    }
}

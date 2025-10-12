<?php

namespace App\Http\Controllers;

use App\Models\laporan;
use App\Models\Media;
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
            'coverImage'    => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'video_urls'    => 'nullable|array',
            'video_urls.*'  => 'url',
        ]);

        // Upload cover image
        $coverPath = $request->file('coverImage')->store('laporan/cover', 'public');

        // Collect media files
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('laporan/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            foreach ($request->video_urls as $url) {
                $mediaFiles[] = ['file' => $url, 'type' => 'video'];
            }
        }

        // Save media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // Save laporan kegiatan
        Laporan::create([
            'medias_id'     => $media->id,
            'judul'         => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'deskripsi'     => $request->deskripsi,
            'coverImage'    => $coverPath,
            'tabel'         => 'laporan',
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('laporan.index')
            ->with('message', 'Laporan kegiatan berhasil ditambahkan');
    }

    public function edit($id)
    {
        $user = Auth::user();
        $laporan = Laporan::with('medias')->findOrFail($id);

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

    public function update(Request $request, Laporan $laporan)
{
    $user = Auth::user();

    if ($user->role !== 'admin' && $laporan->bidangs_id !== $user->id) {
        abort(403, 'Unauthorized to update this laporan kegiatan.');
    }

    $request->validate([
        'judul'         => 'required|string|max:255',
        'penyelenggara' => 'required|string|max:255',
        'lokasi'        => 'required|string|max:255',
        'instansi'      => 'required|in:umum,sma,smk,slb',
        'deskripsi'     => 'required|string|max:1000',
        'coverImage'    => 'nullable|image|mimes:jpg,jpeg,png|max:20480',
        'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
        'video_urls'    => 'nullable|array',
        'video_urls.*'  => 'url',
        'deleted_files' => 'nullable|array',
    ]);

    // --- 1. Update cover image ---
    if ($request->hasFile('coverImage')) {
        if ($laporan->coverImage && Storage::disk('public')->exists($laporan->coverImage)) {
            Storage::disk('public')->delete($laporan->coverImage);
        }
        $coverPath = $request->file('coverImage')->store('laporan/cover', 'public');
        $laporan->coverImage = $coverPath;
    }

    // --- 2. Ambil media lama ---
    $oldMedia = $laporan->medias ? $laporan->medias->file : [];
    $mediaFiles = $oldMedia ?? [];

    // --- 3. Hapus media yang dipilih user ---
    if ($request->deleted_files) {
        foreach ($request->deleted_files as $delFile) {
            if (!preg_match('/^https?:\/\//', $delFile) && Storage::disk('public')->exists($delFile)) {
                Storage::disk('public')->delete($delFile);
            }
            $mediaFiles = array_filter($mediaFiles, fn($m) => $m['file'] !== $delFile);
        }
        $mediaFiles = array_values($mediaFiles);
    }

    // --- 4. Tambah file baru ---
    if ($request->hasFile('files')) {
        foreach ($request->file('files') as $file) {
            $path = $file->store('laporan/file', 'public');
            $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
            $mediaFiles[] = ['file' => $path, 'type' => $type];
        }
    }

    // --- 5. Tambah link video baru ---
    // (hapus video lama berbentuk URL agar tidak duplikat)
    $mediaFiles = array_filter($mediaFiles, fn($m) => !preg_match('/^https?:\/\//', $m['file']));
    if ($request->video_urls) {
        foreach ($request->video_urls as $url) {
            $mediaFiles[] = ['file' => $url, 'type' => 'video'];
        }
    }

    // --- 6. Update media ---
    if ($laporan->medias) {
        $laporan->medias->update(['file' => array_values($mediaFiles)]);
    } else {
        $laporan->medias()->create(['file' => array_values($mediaFiles)]);
    }

    // --- 7. Update field utama laporan kegiatan ---
    $laporan->update([
        'judul'         => $request->judul,
        'penyelenggara' => $request->penyelenggara,
        'lokasi'        => $request->lokasi,
        'instansi'      => $request->instansi,
        'deskripsi'     => $request->deskripsi,
        'coverImage'    => $laporan->coverImage, // penting!
    ]);

    return redirect()->route('laporan.index')
        ->with('message', 'Laporan berhasil diperbarui');
}

    public function destroy($id)
    {
        $laporan = Laporan::with('medias')->findOrFail($id);

        // Delete cover image
        if ($laporan->coverImage && Storage::disk('public')->exists($laporan->coverImage)) {
            Storage::disk('public')->delete($laporan->coverImage);
        }

        // Delete all media files
        if ($laporan->medias && is_array($laporan->medias->file)) {
            foreach ($laporan->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $laporan->medias->delete();
        }

        $laporan->delete();

        return redirect()->route('laporan.index')
            ->with('message', 'Laporan kegiatan berhasil dihapus beserta media terkait');
    }
}

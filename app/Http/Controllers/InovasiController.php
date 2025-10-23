<?php

namespace App\Http\Controllers;

use App\Models\Inovasi;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InovasiController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            // Admin bisa lihat semua inovasi
            $inovasi = Inovasi::with('medias')->latest()->get();
        } else {
            // Bidang hanya bisa lihat inovasi miliknya
            $inovasi = Inovasi::with('medias')->where('bidangs_id', $user->id)->latest()->get();
        }

        return Inertia::render('inovasi/index', compact('inovasi'));
    }

    public function create()
    {
        return Inertia::render('inovasi/create', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:1000',
            'penyelenggara' => 'required|string|max:255',
            'category'      => 'required|string|max:255',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'lokasi'        => 'required|string|max:255',
            'coverImage'    => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:100000',
            'video_urls'    => 'nullable|url',
        ]);

        // cover image
        $coverPath = $request->file('coverImage')->store('inovasi/cover', 'public');

        // kumpulkan file media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('inovasi/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            $mediaFiles[] = ['file' => $request->video_urls, 'type' => 'video'];
        }
        // simpan media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // simpan inovasi
        Inovasi::create([
            'medias_id'      => $media->id,
            'judul'          => $request->judul,
            'deskripsi'      => $request->deskripsi,
            'penyelenggara'  => $request->penyelenggara,
            'category'       => $request->category,
            'instansi'       => $request->instansi,
            'lokasi'         => $request->lokasi,
            'coverImage'     => $coverPath,
            'tabel'          => 'inovasi',
            'bidangs_id'     => Auth::id(),
        ]);

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil ditambahkan');
    }

    public function edit($id)
    {
        $inovasi = Inovasi::with('medias')->findOrFail($id);
        return Inertia::render('inovasi/edit', compact('inovasi'));
    }

    public function update(Request $request, Inovasi $inovasi)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:1000',
            'penyelenggara' => 'required|string|max:255',
            'category'      => 'required|string|max:255',
            'instansi'      => 'required|in:umum,sma,smk,slb',
            'lokasi'        => 'required|string|max:255',
            'coverImage'    => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:100000',
            'video_urls'    => 'nullable|url',
            'deleted_files' => 'nullable|array',
        ]);

        // Update cover
        if ($request->hasFile('coverImage')) {
            if ($inovasi->coverImage && Storage::disk('public')->exists($inovasi->coverImage)) {
                Storage::disk('public')->delete($inovasi->coverImage);
            }
            $coverPath = $request->file('coverImage')->store('inovasi/cover', 'public');
            $inovasi->coverImage = $coverPath;
        }

        // Ambil media lama
        $mediaFiles = $inovasi->medias ? $inovasi->medias->file : [];

        // Hapus media yang dipilih user
        if ($request->deleted_files) {
            foreach ($request->deleted_files as $delFile) {
                if (!preg_match('/^https?:\/\//', $delFile) && Storage::disk('public')->exists($delFile)) {
                    Storage::disk('public')->delete($delFile);
                }

                $mediaFiles = array_filter($mediaFiles, function ($m) use ($delFile) {
                    return $m['file'] !== $delFile;
                });
            }
            $mediaFiles = array_values($mediaFiles);
        }

        // Tambah file baru
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('inovasi/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        $mediaFiles = array_filter($mediaFiles, function ($m) {
            return $m['type'] !== 'video' || !preg_match('/^https?:\/\//', $m['file']);
        });

        // Masukkan ulang link video dari request
        if ($request->video_urls) {
            $mediaFiles[] = ['file' => $request->video_urls, 'type' => 'video'];
        }

        // Simpan media
        if ($inovasi->medias) {
            $inovasi->medias->update(['file' => array_values($mediaFiles)]);
        } else {
            $inovasi->medias()->create(['file' => array_values($mediaFiles)]);
        }

        // Update inovasi
        $inovasi->update([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'category'      => $request->category,
            'instansi'      => $request->instansi,
            'lokasi'        => $request->lokasi,
        ]);

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $inovasi = Inovasi::with('medias')->findOrFail($id);

        // Hapus cover image
        if ($inovasi->coverImage && Storage::disk('public')->exists($inovasi->coverImage)) {
            Storage::disk('public')->delete($inovasi->coverImage);
        }

        // Hapus semua file media
        if ($inovasi->medias && is_array($inovasi->medias->file)) {
            foreach ($inovasi->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $inovasi->medias->delete();
        }

        $inovasi->delete();

        return redirect()->route('inovasi.index')->with('message', 'Inovasi berhasil dihapus beserta media terkait');
    }
}

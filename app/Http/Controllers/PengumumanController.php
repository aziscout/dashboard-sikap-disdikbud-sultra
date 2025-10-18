<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $pengumuman = Pengumuman::with('medias')->latest()->get();
        } else {
            $pengumuman = Pengumuman::with('medias')->where('bidangs_id', $user->id)->latest()->get();
        }

        return Inertia::render("pengumuman/index", compact("pengumuman"));
    }

    public function create()
    {
        return Inertia::render("pengumuman/create");
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'instansi'      => 'required|in:umum,slb,smk,sma',
            'deskripsi'     => 'required|string|max:2000',
            'category'      => 'required|string|max:255',
            'coverImage'    => 'required|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:100000',
            'video_urls'    => 'nullable|url',
        ]);

        // Simpan cover image
        $coverPath = $request->file('coverImage')->store('pengumuman/cover', 'public');

        // Kumpulkan file media
        $mediaFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman/file', 'public');
                $type = in_array($file->extension(), ['mp4', 'mov', 'avi']) ? 'video' : 'foto';
                $mediaFiles[] = ['file' => $path, 'type' => $type];
            }
        }

        if ($request->video_urls) {
            $mediaFiles[] = ['file' => $request->video_urls, 'type' => 'video'];
        }

        // Simpan media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // Simpan pengumuman
        Pengumuman::create([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'category'      => $request->category,
            'coverImage'    => $coverPath,
            'tabel'         => 'pengumuman',
            'medias_id'     => $media->id,
            'bidangs_id'    => Auth::id(),
        ]);

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil ditambahkan');
    }

    public function edit($id)
    {
        $pengumuman = Pengumuman::with('medias')->findOrFail($id);
        return Inertia::render("pengumuman/edit", compact('pengumuman'));
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'required|string|max:2000',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'instansi'      => 'required|in:umum,slb,smk,sma',
            'category'      => 'required|string|max:255',
            'coverImage'    => 'nullable|image|mimes:jpg,jpeg,png,gif,svg,webp,bmp,tiff|max:20480',
            'files.*'       => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:100000',
            'video_urls'    => 'nullable|url',
            'deleted_files' => 'nullable|array',
        ]);

        // Update cover
        if ($request->hasFile('coverImage')) {
            if ($pengumuman->coverImage && Storage::disk('public')->exists($pengumuman->coverImage)) {
                Storage::disk('public')->delete($pengumuman->coverImage);
            }
            $coverPath = $request->file('coverImage')->store('pengumuman/cover', 'public');
            $pengumuman->coverImage = $coverPath;
        }

        // Ambil media lama
        $oldMedia = $pengumuman->medias ? $pengumuman->medias->file : [];
        $mediaFiles = $oldMedia ?? [];

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

        // Tambah file baru (foto/video upload)
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
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
        if ($pengumuman->medias) {
            $pengumuman->medias->update(['file' => array_values($mediaFiles)]);
        } else {
            $pengumuman->medias()->create(['file' => array_values($mediaFiles)]);
        }

        $pengumuman->update([
            'judul'         => $request->judul,
            'deskripsi'     => $request->deskripsi,
            'penyelenggara' => $request->penyelenggara,
            'lokasi'        => $request->lokasi,
            'instansi'      => $request->instansi,
            'category'      => $request->category,
        ]);

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::with('medias')->findOrFail($id);

        // Hapus cover
        if ($pengumuman->coverImage && Storage::disk('public')->exists($pengumuman->coverImage)) {
            Storage::disk('public')->delete($pengumuman->coverImage);
        }

        // Hapus semua file media
        if ($pengumuman->medias && is_array($pengumuman->medias->file)) {
            foreach ($pengumuman->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }
            $pengumuman->medias->delete();
        }

        $pengumuman->delete();

        return redirect()->route('pengumuman.index')
            ->with('message', 'Pengumuman berhasil dihapus beserta media terkait');
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Media;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::with('medias')->latest()->get();
        return Inertia::render("berita/index", compact("berita"));
    }

    public function create()
    {
        return Inertia::render("berita/create", []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'       => 'required|string|max:255',
            'penyelenggara'       => 'required|string|max:255',
            'deskripsi'   => 'required|string',
            'coverImage' => 'required|image|mimes:jpg,jpeg,png|max:20048',
            'files.*'     => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'category'    => 'nullable|string|max:255',
            'instansi'    => 'required|in:umum,sma,smk,slb',
            'lokasi'      => 'required|string|max:200',
            'video_urls'  => 'nullable|url',
        ]);

        // cover image
        $coverPath = $request->file('coverImage')->store('berita/cover', 'public');

        // simpan semua media ke array JSON
        $mediaFiles = [];

        // upload file gambar
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('berita/file', 'public');
                $type = in_array($file->extension(), ['mp4','mov','avi']) ? 'video' : 'foto';
                $mediaFiles[] = [
                    'file' => $path,
                    'type' => $type
                ];
            }
        }

        // simpan link video
        if ($request->video_urls) {
            $mediaFiles[] = ['file' => $request->video_urls, 'type' => 'video'];
        }

        // buat media
        $media = Media::create([
            'file' => $mediaFiles
        ]);

        // buat berita
        Berita::create([
            'medias_id'   => $media->id,
            'judul'       => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'deskripsi'   => $request->deskripsi,
            'coverImage' => $coverPath,
            'category'    => $request->category,
            'instansi'    => $request->instansi,
            'lokasi'      => $request->lokasi,
            'tabel'       => 'berita',
        ]);

        return redirect()->route('berita.index')
            ->with('message', 'Berita berhasil ditambahkan');
    }

    public function edit($id)
    {
        $berita = Berita::with('medias')->findOrFail($id);
        return Inertia::render('berita/edit', compact('berita'));
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'judul'        => 'required|string|max:255',
            'deskripsi'    => 'required|string',
            'coverImage'  => 'nullable|image|mimes:jpg,jpeg,png|max:20048',
            'penyelenggara'   => 'required|string',
            'files.*'      => 'nullable|mimes:jpg,jpeg,png,mp4,mov,avi|max:50000',
            'category'     => 'nullable|string|max:255',
            'instansi'     => 'required|in:umum,sma,smk,slb',
            'lokasi'       => 'required|string|max:200',
            'video_urls'   => 'nullable|url',
            'deleted_files'=> 'nullable|array',
        ]);

        // Update cover
        if ($request->hasFile('coverImage')) {
            $coverPath = $request->file('coverImage')->store('berita/cover', 'public');
            $berita->coverImage = $coverPath;
        }

        // Ambil media lama
        $oldMedia = $berita->medias ? $berita->medias->file : [];
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
                $path = $file->store('berita/file', 'public');
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
        if ($berita->medias) {
            $berita->medias->update(['file' => array_values($mediaFiles)]);
        } else {
            $berita->medias()->create(['file' => array_values($mediaFiles)]);
        }

        // Update berita utama
        $berita->update([
            'judul'       => $request->judul,
            'penyelenggara' => $request->penyelenggara,
            'deskripsi'   => $request->deskripsi,
            'category'    => $request->category,
            'instansi'    => $request->instansi,
            'lokasi'      => $request->lokasi,
        ]);

        return redirect()->route('berita.index')->with('message', 'Berita berhasil diperbarui');
    }

    public function destroy($id)
    {
        $berita = Berita::with('medias')->findOrFail($id);

        // Hapus cover image di storage
        if ($berita->coverImage && Storage::disk('public')->exists($berita->coverImage)) {
            Storage::disk('public')->delete($berita->coverImage);
        }

        // Hapus semua file media
        if ($berita->medias && is_array($berita->medias->file)) {
            foreach ($berita->medias->file as $media) {
                if (isset($media['file']) && !preg_match('/^https?:\/\//', $media['file'])) {
                    // hanya hapus file lokal
                    if (Storage::disk('public')->exists($media['file'])) {
                        Storage::disk('public')->delete($media['file']);
                    }
                }
            }

            // Hapus record medias
            $berita->medias->delete();
        }

        // Hapus record berita
        $berita->delete();

        return redirect()->route('berita.index')
            ->with('message', 'Berita berhasil dihapus beserta media terkait');
    }
}

